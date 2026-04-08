import { useMemo } from 'react';
import { getDepth } from '@/lib/maplibre/hierarchyConfig';
import { GRAND_CRU_VILLAGE_MAP, GRAND_CRU_PDO_ONLY_MAP, HIDDEN_GC_PDO_NAMES, HIDDEN_APPELLATIONS } from '@/lib/maplibre/burgundyClimatMap';

/**
 * Builds an in-memory tree from a flat array of GeoJSON features.
 *
 * Each node: { id, name, hierarchyLevel, depth, parentId, children[], feature }
 *
 * @param {Array} features - GeoJSON feature objects
 * @returns {{ roots: Array, nodeMap: Map<string, object> }}
 */
export function buildTree(features) {
  const nodeMap = new Map();

  // First pass: create nodes
  for (const feat of features) {
    const p = feat.properties;
    const id = p.id || p.name;
    nodeMap.set(id, {
      id,
      name: p.name,
      hierarchyLevel: p.hierarchyLevel || 'appellation',
      depth: getDepth(p.hierarchyLevel),
      parentId: p.parentId || null,
      children: [],
      feature: feat,
      bbox: computeBbox(feat.geometry),
    });
  }

  // Second pass: link children to parents
  const roots = [];
  for (const node of nodeMap.values()) {
    if (node.parentId && nodeMap.has(node.parentId)) {
      nodeMap.get(node.parentId).children.push(node);
    } else {
      roots.push(node);
    }
  }

  // Recompute bbox for virtual nodes from children (so tiny geometry doesn't break navigation)
  function recomputeVirtualBbox(node) {
    for (const child of node.children) recomputeVirtualBbox(child);
    if (node.feature?.properties?._virtual && node.children.length > 0) {
      let minLng = Infinity, minLat = Infinity, maxLng = -Infinity, maxLat = -Infinity;
      for (const child of node.children) {
        if (child.bbox) {
          if (child.bbox[0] < minLng) minLng = child.bbox[0];
          if (child.bbox[1] < minLat) minLat = child.bbox[1];
          if (child.bbox[2] > maxLng) maxLng = child.bbox[2];
          if (child.bbox[3] > maxLat) maxLat = child.bbox[3];
        }
      }
      if (minLng !== Infinity) node.bbox = [minLng, minLat, maxLng, maxLat];
    }
  }
  for (const root of roots) recomputeVirtualBbox(root);

  // Sort children alphabetically
  const sortChildren = (nodes) => {
    nodes.sort((a, b) => a.name.localeCompare(b.name));
    for (const node of nodes) {
      if (node.children.length > 0) sortChildren(node.children);
    }
  };
  sortChildren(roots);

  return { roots, nodeMap };
}

/**
 * Returns the set of feature IDs that should be visible on the map
 * given the current zoom level and unchecked set.
 *
 * A feature is visible if:
 * 1. Its depth is appropriate for the current zoom
 * 2. Neither it nor any ancestor is unchecked
 *
 * A feature should "fade" (render as outline only) if:
 * - It has children AND the zoom is past its maxZoom threshold
 */
export function getVisibleFeatureIds(tree, zoom, uncheckedIds) {
  const visible = new Set();
  const faded = new Set();

  function walk(nodes, ancestorUnchecked) {
    for (const node of nodes) {
      const isUnchecked = ancestorUnchecked || uncheckedIds.has(node.id);

      if (!isUnchecked && !node._mapHidden) {
        // Always add to visible set — MapLibre filter handles zoom gating
        visible.add(node.id);

        // Mark as faded only if the node has actual PDO children (not just climat categories).
        // Villages with only GC/PC climat children should keep their fill.
        const hasPdoChildren = node.children.some(c => !c.isClimat && !c.isClimatCategory);
        if (hasPdoChildren) {
          faded.add(node.id);
        }
      }

      if (node.children.length > 0) {
        walk(node.children, isUnchecked);
      }
    }
  }

  walk(tree.roots, false);
  return { visible, faded };
}

/**
 * Collects all descendant IDs of a node (for batch operations).
 */
export function getDescendantIds(nodeMap, nodeId) {
  const ids = new Set();
  const node = nodeMap.get(nodeId);
  if (!node) return ids;

  function collect(n) {
    for (const child of n.children) {
      ids.add(child.id);
      collect(child);
    }
  }
  collect(node);
  return ids;
}

/**
 * Counts total features and visible features in a tree.
 */
export function countFeatures(roots, uncheckedIds) {
  let total = 0;
  let visible = 0;

  function walk(nodes, ancestorUnchecked) {
    for (const node of nodes) {
      // Skip climat category headers and leaf nodes — they aren't PDO features
      if (node.isClimatCategory || node.isClimat) {
        continue;
      }
      total++;
      const isUnchecked = ancestorUnchecked || uncheckedIds.has(node.id);
      if (!isUnchecked) visible++;
      if (node.children.length > 0) walk(node.children, isUnchecked);
    }
  }

  walk(roots, false);
  return { total, visible };
}

function computeBbox(geometry) {
  if (!geometry || !geometry.coordinates) return null;
  let minLng = Infinity, minLat = Infinity, maxLng = -Infinity, maxLat = -Infinity;
  const coords = geometry.type === 'Polygon' ? [geometry.coordinates] : geometry.coordinates;
  for (const polygon of coords) {
    for (const ring of polygon) {
      for (const [lng, lat] of ring) {
        if (lng < minLng) minLng = lng;
        if (lat < minLat) minLat = lat;
        if (lng > maxLng) maxLng = lng;
        if (lat > maxLat) maxLat = lat;
      }
    }
  }
  return [minLng, minLat, maxLng, maxLat];
}

function slugify(str) {
  return str.toLowerCase()
    .normalize('NFD').replace(/[\u0300-\u036f]/g, '')
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-|-$/g, '');
}

/**
 * Injects Burgundy Grand Cru and Premier Cru climat nodes into an existing
 * France appellation tree, nesting them under their parent village nodes.
 *
 * Call this after buildTree() for France.
 *
 * @param {object} tree - { roots, nodeMap } from buildTree()
 * @param {Array} climatFeatures - features from burgundy-climats.geojson
 */
export function injectClimatNodes(tree, climatFeatures = [], mgaFeatures = []) {
  // Build a name → node lookup for all nodes
  const nodeByName = new Map();
  for (const node of tree.nodeMap.values()) {
    nodeByName.set(node.name, node);
  }

  // Category header cache: key = `{villageId}-gc` or `{villageId}-pc`
  const categoryNodes = new Map();

  function getOrCreateCategory(villageNode, type) {
    const key = `${villageNode.id}-${type}`;
    if (categoryNodes.has(key)) return categoryNodes.get(key);

    const label = type === 'gc' ? 'Grand Crus' : type === 'pc' ? 'Premier Crus' : type === 'pago' ? 'Vinos de Pago' : type === 'cru' ? 'Crus' : type;
    const catNode = {
      id: key,
      name: label,
      hierarchyLevel: 'category',
      depth: villageNode.depth + 1,
      parentId: villageNode.id,
      children: [],
      feature: null,
      bbox: null,
      isClimatCategory: true,
    };
    villageNode.children.push(catNode);
    tree.nodeMap.set(key, catNode);
    categoryNodes.set(key, catNode);
    return catNode;
  }

  // Build a lookup of climat GC features by name
  const climatGcByName = new Map();
  for (const feat of climatFeatures) {
    if (feat.properties.classification === 'grand_cru') {
      climatGcByName.set(feat.properties.name, feat);
    }
  }

  // ── 1. Grand Crus with parcel data (burgundy-climats.geojson) ──────────────
  // Inject a climat leaf node under the village, then hide the duplicate PDO entry.
  for (const [gcName, villages] of Object.entries(GRAND_CRU_VILLAGE_MAP)) {
    const climatFeat = climatGcByName.get(gcName);
    if (!climatFeat) continue;

    for (const villageName of villages) {
      const villageNode = nodeByName.get(villageName);
      if (!villageNode) continue;

      const catNode = getOrCreateCategory(villageNode, 'gc');
      const nodeId = `climat-gc-${slugify(gcName)}-${slugify(villageName)}`;
      if (tree.nodeMap.has(nodeId)) continue;

      catNode.children.push({
        id: nodeId,
        name: gcName,
        hierarchyLevel: 'grand_cru',
        depth: catNode.depth + 1,
        parentId: catNode.id,
        children: [],
        feature: climatFeat,
        bbox: computeBbox(climatFeat.geometry),
        isClimat: true,
        climatName: gcName,
      });
      tree.nodeMap.set(nodeId, tree.nodeMap.get(nodeId) || catNode.children[catNode.children.length - 1]);
    }

    // Hide the original PDO appellation entry (it's now represented by the climat node)
    // _sidebarHidden: hides from sidebar tree; _mapHidden: hides from map (we have parcel data now)
    const pdoNode = nodeByName.get(gcName);
    if (pdoNode) {
      pdoNode._sidebarHidden = true;
      pdoNode._mapHidden = true;
    }
  }

  // ── 2. PDO-only Grand Crus (no parcel data) ────────────────────────────────
  // Keep the original PDO node in its subregion (the visibility walk needs it there
  // for the map to show the feature). Hide it from the sidebar with _sidebarHidden.
  // Create a display-alias node under the village category for sidebar navigation.
  for (const [gcName, villages] of Object.entries(GRAND_CRU_PDO_ONLY_MAP)) {
    const pdoNode = nodeByName.get(gcName);
    if (!pdoNode) continue;

    // Original node stays in tree for map visibility — just hide from sidebar render
    pdoNode._sidebarHidden = true;

    for (const villageName of villages) {
      const villageNode = nodeByName.get(villageName);
      if (!villageNode) continue;

      const catNode = getOrCreateCategory(villageNode, 'gc');
      const nodeId = `display-gc-${slugify(gcName)}-${slugify(villageName)}`;
      if (tree.nodeMap.has(nodeId)) continue;

      const displayNode = {
        id: nodeId,
        name: gcName,
        hierarchyLevel: 'grand_cru',
        depth: catNode.depth + 1,
        parentId: catNode.id,
        children: [],
        feature: pdoNode.feature,
        bbox: pdoNode.bbox,
        isClimat: true,  // sidebar treats it like a climat node (click-to-fly, no checkbox)
        climatName: gcName,
      };
      catNode.children.push(displayNode);
      tree.nodeMap.set(nodeId, displayNode);
    }
  }

  // ── 3. Hidden PDO GCs (suppress entirely, no reparenting) ─────────────────
  for (const gcName of HIDDEN_GC_PDO_NAMES) {
    const pdoNode = nodeByName.get(gcName);
    if (pdoNode) {
      pdoNode._sidebarHidden = true;
      pdoNode._mapHidden = true;
    }
  }

  // ── 3b. Hidden redundant appellations (regional/catch-all) ─────────────────
  // Iterate all nodes (not nodeByName) to catch duplicates with the same name.
  // Only hide appellation-level features — skip regions/subregions.
  for (const node of tree.nodeMap.values()) {
    if (!HIDDEN_APPELLATIONS.has(node.name)) continue;
    if (node.hierarchyLevel === 'region' || node.hierarchyLevel === 'subregion') continue;

    node._sidebarHidden = true;

    // Only region-level blankets (parent is "regional-*" subregion) stay on the map
    // as parent polygons controlled by tri-state. Others stay hidden.
    const isRegionBlanket = node.parentId && node.parentId.includes('regional');

    if (isRegionBlanket) {
      // Walk up to find the region ancestor and register as blanket child
      let ancestor = node.parentId ? tree.nodeMap.get(node.parentId) : null;
      while (ancestor) {
        if (ancestor.hierarchyLevel === 'region') {
          if (!ancestor._blanketIds) ancestor._blanketIds = [];
          ancestor._blanketIds.push(node.id);
          break;
        }
        ancestor = ancestor.parentId ? tree.nodeMap.get(ancestor.parentId) : null;
      }
    } else {
      node._mapHidden = true;
    }
  }
  // ── 4. Premier Crus ────────────────────────────────────────────────────────
  for (const feat of climatFeatures) {
    if (feat.properties.classification !== 'premier_cru') continue;
    const { name, village, lieu_dit } = feat.properties;
    if (!village) continue;

    const villageNode = nodeByName.get(village);
    if (!villageNode) continue;

    const catNode = getOrCreateCategory(villageNode, 'pc');
    const displayName = lieu_dit || name;
    const nodeId = `climat-pc-${slugify(village)}-${slugify(displayName)}`;
    if (tree.nodeMap.has(nodeId)) continue;

    const leafNode = {
      id: nodeId,
      name: displayName,
      hierarchyLevel: 'premier_cru',
      depth: catNode.depth + 1,
      parentId: catNode.id,
      children: [],
      feature: feat,
      bbox: computeBbox(feat.geometry),
      isClimat: true,
      climatName: name,
    };
    catNode.children.push(leafNode);
    tree.nodeMap.set(nodeId, leafNode);
  }

  // ── 5. Champagne village grouping ──────────────────────────────────────
  // Group Grand Cru and Premier Cru villages under category headers within
  // each Champagne subregion, matching Burgundy's sidebar organisation.
  const champagneSubregionIds = new Set([
    'fr-subregion-montagne-de-reims',
    'fr-subregion-vallee-de-la-marne',
    'fr-subregion-cote-des-blancs',
    'fr-subregion-cote-de-sezanne',
    'fr-subregion-cote-des-bar',
  ]);

  for (const node of tree.nodeMap.values()) {
    if (!champagneSubregionIds.has(node.id)) continue;
    if (node.children.length === 0) continue;

    const gcChildren = [];
    const pcChildren = [];
    const otherChildren = [];

    for (const child of node.children) {
      const cls = child.feature?.properties?.classification;
      if (cls === 'grand_cru') gcChildren.push(child);
      else if (cls === 'premier_cru') pcChildren.push(child);
      else otherChildren.push(child);
    }

    // Replace children array — categories first, then remaining appellations
    node.children = [];

    if (gcChildren.length > 0) {
      const catNode = getOrCreateCategory(node, 'gc');
      for (const gc of gcChildren) {
        gc.parentId = catNode.id;
        gc.depth = catNode.depth + 1;
        catNode.children.push(gc);
      }
    }

    if (pcChildren.length > 0) {
      const catNode = getOrCreateCategory(node, 'pc');
      for (const pc of pcChildren) {
        pc.parentId = catNode.id;
        pc.depth = catNode.depth + 1;
        catNode.children.push(pc);
      }
    }

    // Re-add non-classified appellations as direct children
    for (const other of otherChildren) {
      node.children.push(other);
    }
  }

  // ── 6. Beaujolais Cru grouping ─────────────────────────────────────────
  // Group the 10 named Crus under a "Crus" category header within Beaujolais.
  const beaujolaisCrus = new Set([
    'Brouilly', 'Côte de Brouilly', 'Chénas', 'Chiroubles', 'Fleurie',
    'Juliénas', 'Morgon', 'Moulin-à-Vent', 'Régnié', 'Saint-Amour',
  ]);

  const beaujolaisRegion = tree.nodeMap.get('fr-region-beaujolais');
  if (beaujolaisRegion && beaujolaisRegion.children.length > 0) {
    const cruChildren = [];
    const otherChildren = [];

    for (const child of beaujolaisRegion.children) {
      if (beaujolaisCrus.has(child.name)) cruChildren.push(child);
      else otherChildren.push(child);
    }

    beaujolaisRegion.children = [];

    if (cruChildren.length > 0) {
      const catNode = getOrCreateCategory(beaujolaisRegion, 'cru');
      for (const cru of cruChildren) {
        cru.parentId = catNode.id;
        cru.depth = catNode.depth + 1;
        catNode.children.push(cru);
      }
    }

    for (const other of otherChildren) {
      beaujolaisRegion.children.push(other);
    }
  }

  // ── 7. MGA / Einzellagen injection ─────────────────────────────
  // Groups vineyard-level features under their parent appellation in the sidebar.
  // If features have a subregion, adds an intermediate grouping:
  //   Appellation → Subregion → Village → Vineyard
  // Otherwise: Appellation → Village → Vineyard
  if (mgaFeatures && mgaFeatures.length > 0) {
    // Group features by appellation → subregion → commune
    const mgaByAppellation = new Map();
    for (const feat of mgaFeatures) {
      const { appellation } = feat.properties;
      if (!appellation) continue;
      if (!mgaByAppellation.has(appellation)) mgaByAppellation.set(appellation, []);
      mgaByAppellation.get(appellation).push(feat);
    }

    // Map appellation names to sidebar node names (handles slash variants)
    const mgaNameAliases = {
      "Dolcetto di Diano d'Alba": "Dolcetto di Diano d'Alba / Diano d'Alba",
      "Hermitage": "Hermitage / Ermitage / L'Hermitage / L'Ermitage",
      "Crozes-Hermitage": "Crozes-Hermitage / Crozes-Ermitage",
      "Côte-Rôtie": "Côte Rôtie",
      "Pouilly-Fumé": "Pouilly-Fumé / Blanc Fumé de Pouilly",
      "L'Étoile": "L'Etoile",
    };

    for (const [appellationName, allFeatures] of mgaByAppellation) {
      const sidebarName = mgaNameAliases[appellationName] || appellationName;
      const appellationNode = nodeByName.get(sidebarName) || nodeByName.get(appellationName);
      if (!appellationNode) continue;

      // Check if any features have a subregion — if so, use 3-level grouping
      const hasSubregions = allFeatures.some(f => f.properties.subregion);

      // Helper: create a leaf vineyard node under a parent
      function createLeafNode(feat, parentNode, parentSlug) {
        const mgaName = feat.properties.name;
        const mgaId = `mga-${parentSlug}-${slugify(mgaName)}`;
        if (tree.nodeMap.has(mgaId)) return null;

        const mgaBbox = computeBbox(feat.geometry);
        const mgaNode = {
          id: mgaId,
          name: mgaName,
          hierarchyLevel: feat.properties.classification || 'mga',
          depth: parentNode.depth + 1,
          parentId: parentNode.id,
          children: [],
          feature: feat,
          bbox: mgaBbox,
          isClimat: true,
          climatName: mgaName,
        };
        parentNode.children.push(mgaNode);
        tree.nodeMap.set(mgaId, mgaNode);
        return mgaBbox;
      }

      // Helper: create a category node (subregion or commune)
      function createCategoryNode(name, id, parentNode) {
        if (tree.nodeMap.has(id)) return tree.nodeMap.get(id);
        const node = {
          id,
          name,
          hierarchyLevel: 'category',
          depth: parentNode.depth + 1,
          parentId: parentNode.id,
          children: [],
          feature: null,
          bbox: null,
          isClimatCategory: true,
        };
        parentNode.children.push(node);
        tree.nodeMap.set(id, node);
        return node;
      }

      // Helper: compute bbox from children
      function updateBboxFromChildren(node) {
        let minLng = Infinity, minLat = Infinity, maxLng = -Infinity, maxLat = -Infinity;
        for (const child of node.children) {
          const b = child.bbox;
          if (b) {
            if (b[0] < minLng) minLng = b[0];
            if (b[1] < minLat) minLat = b[1];
            if (b[2] > maxLng) maxLng = b[2];
            if (b[3] > maxLat) maxLat = b[3];
          }
        }
        if (minLng !== Infinity) node.bbox = [minLng, minLat, maxLng, maxLat];
      }

      // Check if any features have VDP classification
      const hasVdp = allFeatures.some(f => f.properties.vdp);

      if (hasSubregions && hasVdp) {
        // Simplified VDP structure:
        // Region → Subregion → VDP Große Lage → [flat list] / VDP Erste Lage → [flat list]
        // If only one subregion, skip the subregion level
        const bySubregion = new Map();
        for (const feat of allFeatures) {
          const sub = feat.properties.subregion || 'Other';
          if (!bySubregion.has(sub)) bySubregion.set(sub, []);
          bySubregion.get(sub).push(feat);
        }

        const skipSubregionLevel = bySubregion.size === 1;

        for (const subName of [...bySubregion.keys()].sort((a, b) => a.localeCompare(b))) {
          const subFeatures = bySubregion.get(subName);

          // If only one subregion, attach VDP groups directly to appellation node
          let parentForVdp;
          if (skipSubregionLevel) {
            parentForVdp = appellationNode;
          } else {
            const subId = `mga-sub-${slugify(appellationName)}-${slugify(subName)}`;
            parentForVdp = createCategoryNode(subName, subId, appellationNode);
          }

          const grosseLage = subFeatures.filter(f => f.properties.vdp === 'grosse_lage');
          const ersteLage = subFeatures.filter(f => f.properties.vdp === 'erste_lage');
          const other = subFeatures.filter(f => !f.properties.vdp);

          // VDP Große Lage — flat list
          if (grosseLage.length > 0) {
            const glId = `mga-vdp-gl-${slugify(appellationName)}-${slugify(subName)}`;
            const glNode = createCategoryNode('VDP Große Lage', glId, parentForVdp);
            grosseLage.sort((a, b) => (a.properties.name || '').localeCompare(b.properties.name || ''));
            for (const feat of grosseLage) {
              createLeafNode(feat, glNode, `${slugify(appellationName)}-${slugify(subName)}-gl`);
            }
            updateBboxFromChildren(glNode);
          }

          // VDP Erste Lage — flat list
          if (ersteLage.length > 0) {
            const elId = `mga-vdp-el-${slugify(appellationName)}-${slugify(subName)}`;
            const elNode = createCategoryNode('VDP Erste Lage', elId, parentForVdp);
            ersteLage.sort((a, b) => (a.properties.name || '').localeCompare(b.properties.name || ''));
            for (const feat of ersteLage) {
              createLeafNode(feat, elNode, `${slugify(appellationName)}-${slugify(subName)}-el`);
            }
            updateBboxFromChildren(elNode);
          }

          // Non-VDP Einzellagen — flat list under "Einzellagen" header
          if (other.length > 0) {
            const otherId = `mga-vdp-other-${slugify(appellationName)}-${slugify(subName)}`;
            const otherNode = createCategoryNode('Einzellagen', otherId, parentForVdp);
            other.sort((a, b) => (a.properties.name || '').localeCompare(b.properties.name || ''));
            for (const feat of other) {
              createLeafNode(feat, otherNode, `${slugify(appellationName)}-${slugify(subName)}-other`);
            }
            updateBboxFromChildren(otherNode);
          }

          if (!skipSubregionLevel) updateBboxFromChildren(parentForVdp);
        }
      } else if (hasSubregions) {
        // Subregions without VDP: Region → Subregion → Village → Vineyard
        const bySubregion = new Map();
        for (const feat of allFeatures) {
          const sub = feat.properties.subregion || 'Other';
          if (!bySubregion.has(sub)) bySubregion.set(sub, []);
          bySubregion.get(sub).push(feat);
        }

        for (const subName of [...bySubregion.keys()].sort((a, b) => a.localeCompare(b))) {
          const subFeatures = bySubregion.get(subName);
          const subId = `mga-sub-${slugify(appellationName)}-${slugify(subName)}`;
          const subNode = createCategoryNode(subName, subId, appellationNode);

          const byCommune = new Map();
          for (const feat of subFeatures) {
            const commune = feat.properties.commune || 'Unknown';
            if (!byCommune.has(commune)) byCommune.set(commune, []);
            byCommune.get(commune).push(feat);
          }

          for (const communeName of [...byCommune.keys()].sort((a, b) => a.localeCompare(b))) {
            const communeFeatures = byCommune.get(communeName);
            const communeId = `mga-commune-${slugify(appellationName)}-${slugify(subName)}-${slugify(communeName)}`;
            const communeNode = createCategoryNode(communeName, communeId, subNode);

            communeFeatures.sort((a, b) => (a.properties.name || '').localeCompare(b.properties.name || ''));
            const parentSlug = `${slugify(appellationName)}-${slugify(subName)}-${slugify(communeName)}`;
            for (const feat of communeFeatures) {
              createLeafNode(feat, communeNode, parentSlug);
            }
            updateBboxFromChildren(communeNode);
          }
          updateBboxFromChildren(subNode);
        }
      } else {
        // 2-level: Appellation → Village → Vineyard
        // Features without commune go directly under appellation as flat list
        const byCommune = new Map();
        const noCommune = [];
        for (const feat of allFeatures) {
          const commune = feat.properties.commune;
          if (!commune) {
            noCommune.push(feat);
          } else {
            if (!byCommune.has(commune)) byCommune.set(commune, []);
            byCommune.get(commune).push(feat);
          }
        }

        // Flat list directly under appellation (e.g. Rhône lieux-dits)
        if (noCommune.length > 0) {
          noCommune.sort((a, b) => (a.properties.name || '').localeCompare(b.properties.name || ''));
          const parentSlug = slugify(appellationName);
          for (const feat of noCommune) {
            createLeafNode(feat, appellationNode, parentSlug);
          }
        }

        for (const communeName of [...byCommune.keys()].sort((a, b) => a.localeCompare(b))) {
          const communeFeatures = byCommune.get(communeName);
          const communeId = `mga-commune-${slugify(appellationName)}-${slugify(communeName)}`;
          const communeNode = createCategoryNode(communeName, communeId, appellationNode);

          communeFeatures.sort((a, b) => (a.properties.name || '').localeCompare(b.properties.name || ''));
          const parentSlug = `${slugify(appellationName)}-${slugify(communeName)}`;
          for (const feat of communeFeatures) {
            createLeafNode(feat, communeNode, parentSlug);
          }
          updateBboxFromChildren(communeNode);
        }
      }
    }
  }

  // ── 8. Spain Vino de Pago grouping ──────────────────────────────────
  // Group Vinos de Pago (single-estate DOs) under a "Vinos de Pago" category
  // header within their Pagos subregions.
  const spainPagoNames = new Set([
    // Castilla-La Mancha Pagos
    'Dominio de Valdepusa', 'Finca Élez', 'Dehesa del Carrizal',
    'Campo de La Guardia', 'Calzadilla', 'Pago Florentino',
    'Guijoso', 'Casa del Blanco', 'La Jaraba', 'Vallegarcía', 'El Vicario',
    // Castilla y León Pagos
    'Cebreros', 'Urueña', 'Dehesa Peñalba', 'Los Cerrillos', 'Valtiendas',
    // Navarra Pagos
    'Prado de Irache', 'Pago de Arínzano', 'Pago de Otazu',
    // Aragon Pagos
    'Aylés',
    // Valencia Pagos
    'El Terrerazo', 'Los Balagueses', 'Vera de Estenas', 'Chozas Carrascal',
  ]);

  // Group Pagos within subregions or regions that contain them
  for (const node of tree.nodeMap.values()) {
    if (node.id && !node.id.startsWith('es-')) continue;
    if (node.hierarchyLevel !== 'subregion' && node.hierarchyLevel !== 'region') continue;
    if (node.children.length === 0) continue;

    const pagoChildren = [];
    const otherChildren = [];

    for (const child of node.children) {
      if (spainPagoNames.has(child.name)) pagoChildren.push(child);
      else otherChildren.push(child);
    }

    // Only create category if there's a meaningful split
    if (pagoChildren.length === 0 || otherChildren.length === 0) continue;

    node.children = [];

    // Regular DOs first, then Pagos
    for (const other of otherChildren) {
      node.children.push(other);
    }

    const catNode = getOrCreateCategory(node, 'pago');
    for (const pago of pagoChildren) {
      pago.parentId = catNode.id;
      pago.depth = catNode.depth + 1;
      catNode.children.push(pago);
    }
  }

  // Sort category children alphabetically
  for (const catNode of categoryNodes.values()) {
    catNode.children.sort((a, b) => a.name.localeCompare(b.name));
  }
}

/**
 * React hook that memoizes tree building for a country's features.
 */
export function useHierarchyTree(features) {
  return useMemo(() => {
    if (!features || features.length === 0) return { roots: [], nodeMap: new Map() };
    return buildTree(features);
  }, [features]);
}
