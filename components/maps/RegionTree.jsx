import { useState, useCallback, useMemo, memo } from 'react';
import { COUNTRIES } from './data/colorPalette';
import { isVisibleAtZoom } from './data/hierarchyConfig';
import { countFeatures, getDescendantIds } from './hooks/useHierarchyTree';

function RegionTree({
  visibleCountries,
  onToggleCountry,
  countryTrees,
  checkboxTree,
  zoomLevel,
  onFlyTo,
  onFeatureClick,
  parentOnlyHiddenIds,
  onSetParentHidden,
}) {
  return (
    <div className="region-tree">
      <h2>Wine Regions</h2>
      {COUNTRIES.map(({ id, name, color }) => (
        <CountryNode
          key={id}
          countryId={id}
          displayName={name}
          color={color}
          isActive={visibleCountries.has(id)}
          onToggle={onToggleCountry}
          tree={countryTrees[id]}
          checkboxTree={checkboxTree}
          zoomLevel={zoomLevel}
          onFlyTo={onFlyTo}
          onFeatureClick={onFeatureClick}
          parentOnlyHiddenIds={parentOnlyHiddenIds}
          onSetParentHidden={onSetParentHidden}
        />
      ))}
    </div>
  );
}

const CountryNode = memo(function CountryNode({
  countryId,
  displayName,
  color,
  isActive,
  onToggle,
  tree,
  checkboxTree,
  zoomLevel,
  onFlyTo,
  onFeatureClick,
  parentOnlyHiddenIds,
  onSetParentHidden,
}) {
  const [expanded, setExpanded] = useState(false);
  const uncheckedIds = checkboxTree.getUncheckedIds(countryId);
  const hasTree = tree && tree.roots && tree.roots.length > 0;

  let countLabel = '';
  if (hasTree) {
    const { total, visible } = countFeatures(tree.roots, uncheckedIds);
    countLabel = visible < total ? ` (${visible}/${total})` : ` (${total})`;
  }

  return (
    <div className="country-node">
      <div className="country-node-header">
        {isActive && hasTree ? (
          <button
            className={`region-chevron ${expanded ? 'region-chevron--open' : ''}`}
            onClick={() => setExpanded(!expanded)}
            aria-label={expanded ? 'Collapse' : 'Expand'}
          >
            ▸
          </button>
        ) : (
          <span className="region-chevron region-chevron--placeholder" />
        )}
        <input
          type="checkbox"
          id={`toggle-${countryId}`}
          checked={isActive}
          onChange={(e) => onToggle(countryId, e.target.checked)}
        />
        <label htmlFor={`toggle-${countryId}`}>
          <span className="color-swatch" style={{ backgroundColor: color }} />
          {displayName}
          {isActive && <span className="count-badge">{countLabel}</span>}
        </label>
      </div>
      {isActive && expanded && hasTree && (
        <div className="country-children">
          {tree.roots.map(node => (
            <RegionNode
              key={node.id}
              node={node}
              countryId={countryId}
              depth={0}
              checkboxTree={checkboxTree}
              zoomLevel={zoomLevel}
              onFlyTo={onFlyTo}
              onFeatureClick={onFeatureClick}
              nodeMap={tree.nodeMap}
              parentOnlyHiddenIds={parentOnlyHiddenIds}
              onSetParentHidden={onSetParentHidden}
            />
          ))}
        </div>
      )}
    </div>
  );
});

const RegionNode = memo(function RegionNode({
  node,
  countryId,
  depth,
  checkboxTree,
  zoomLevel,
  onFlyTo,
  onFeatureClick,
  nodeMap,
  parentOnlyHiddenIds,
  onSetParentHidden,
}) {
  const [expanded, setExpanded] = useState(false);
  const uncheckedIds = checkboxTree.getUncheckedIds(countryId);
  const isChecked = !uncheckedIds.has(node.id);
  const hasChildren = node.children.length > 0;
  const isZoomVisible = isVisibleAtZoom(node.hierarchyLevel, zoomLevel);

  // Tri-state applies to nodes with children AND blanket polygon(s) to control
  const blanketIds = useMemo(() => node._blanketIds || [], [node._blanketIds]);
  const useTriState = hasChildren && blanketIds.length > 0;
  const isParentHidden = blanketIds.some(id => parentOnlyHiddenIds?.has(id)) || false;

  const handleToggle = useCallback(() => {
    const getDescFn = (nodeId) => getDescendantIds(nodeMap, nodeId);
    checkboxTree.toggleNode(countryId, node.id, nodeMap, getDescFn);
  }, [countryId, node.id, nodeMap, checkboxTree]);

  // Tri-state cycle: ✓ → ✕ → ☐ → ✓
  const handleTriStateClick = useCallback(() => {
    const getDescFn = (nid) => getDescendantIds(nodeMap, nid);
    if (isChecked && !isParentHidden) {
      // ✓ → ✕: hide blanket polygon(s), children stay
      for (const bid of blanketIds) onSetParentHidden(bid, true);
    } else if (isChecked && isParentHidden) {
      // ✕ → ☐: hide everything
      for (const bid of blanketIds) onSetParentHidden(bid, false);
      checkboxTree.uncheckNode(countryId, node.id, getDescFn);
    } else {
      // ☐ → ✓: show everything (blanket + children)
      checkboxTree.recheckNode(countryId, node.id);
      for (const bid of blanketIds) onSetParentHidden(bid, false);
    }
  }, [isChecked, isParentHidden, blanketIds, node.id, countryId, nodeMap, checkboxTree, onSetParentHidden]);

  const handleNameClick = useCallback(() => {
    if (node.bbox && onFlyTo) {
      onFlyTo(node.bbox);
    }
    if (node.feature && onFeatureClick) {
      onFeatureClick({
        id: node.id,
        ...node.feature.properties,
        bbox: node.bbox,
      });
    }
  }, [node, onFlyTo, onFeatureClick]);

  if (node._sidebarHidden) return null;

  // Determine tri-state visual
  let triStateIcon = null;
  let triStateClass = '';
  if (useTriState) {
    if (!isChecked) {
      triStateClass = 'tristate--empty';
    } else if (isParentHidden) {
      triStateClass = 'tristate--cross';
      triStateIcon = '\u00d7'; // ×
    } else {
      triStateClass = 'tristate--checked';
      triStateIcon = '\u2713'; // ✓
    }
  }

  if (node.isClimatCategory) {
    return (
      <div className="region-node region-node--category">
        <div
          className="region-node-row"
          style={{ paddingLeft: `${(depth + 1) * 16}px` }}
        >
          {hasChildren ? (
            <button
              className={`region-chevron ${expanded ? 'region-chevron--open' : ''}`}
              onClick={() => setExpanded(!expanded)}
            >
              ▸
            </button>
          ) : (
            <span className="region-chevron region-chevron--placeholder" />
          )}
          <span className="climat-category-label">
            {node.name}
            <span className="climat-category-count"> ({node.children.length})</span>
          </span>
        </div>
        {expanded && hasChildren && (
          <div className="region-children">
            {node.children.map(child => (
              <RegionNode
                key={child.id}
                node={child}
                countryId={countryId}
                depth={depth + 1}
                checkboxTree={checkboxTree}
                zoomLevel={zoomLevel}
                onFlyTo={onFlyTo}
                onFeatureClick={onFeatureClick}
                nodeMap={nodeMap}
                parentOnlyHiddenIds={parentOnlyHiddenIds}
                onSetParentHidden={onSetParentHidden}
              />
            ))}
          </div>
        )}
      </div>
    );
  }

  if (node.isClimat) {
    const vdp = node.feature?.properties?.vdp;
    const badge = node.hierarchyLevel === 'grand_cru' ? 'GC'
      : node.hierarchyLevel === 'mga' ? 'MGA'
      : vdp === 'grosse_lage' ? 'GL'
      : vdp === 'erste_lage' ? '1L'
      : node.hierarchyLevel === 'einzellage' ? 'EL'
      : node.hierarchyLevel === 'ried' ? 'R'
      : node.hierarchyLevel === 'lieu_dit' ? 'LD'
      : '1er';
    const badgeClass = node.hierarchyLevel === 'grand_cru'
      ? 'climat-badge climat-badge--gc'
      : node.hierarchyLevel === 'mga'
      ? 'climat-badge climat-badge--mga'
      : vdp === 'grosse_lage'
      ? 'climat-badge climat-badge--gl'
      : vdp === 'erste_lage'
      ? 'climat-badge climat-badge--1l'
      : node.hierarchyLevel === 'einzellage'
      ? 'climat-badge climat-badge--el'
      : node.hierarchyLevel === 'ried'
      ? 'climat-badge climat-badge--ried'
      : node.hierarchyLevel === 'lieu_dit'
      ? 'climat-badge climat-badge--ld'
      : 'climat-badge climat-badge--pc';
    return (
      <div className="region-node region-node--climat">
        <div
          className="region-node-row"
          style={{ paddingLeft: `${(depth + 1) * 16}px` }}
        >
          <span className="region-chevron region-chevron--placeholder" />
          <span
            className="region-name region-name--climat"
            onClick={handleNameClick}
            title={node.name}
          >
            {node.name}
          </span>
          <span className={badgeClass}>{badge}</span>
        </div>
      </div>
    );
  }

  return (
    <div className={`region-node ${!isChecked ? 'region-node--off' : !isZoomVisible ? 'region-node--faded' : ''}`}>
      <div
        className="region-node-row"
        style={{ paddingLeft: `${(depth + 1) * 16}px` }}
      >
        {hasChildren ? (
          <button
            className={`region-chevron ${expanded ? 'region-chevron--open' : ''}`}
            onClick={() => setExpanded(!expanded)}
          >
            ▸
          </button>
        ) : (
          <span className="region-chevron region-chevron--placeholder" />
        )}

        {useTriState ? (
          <button
            className={`tristate ${triStateClass}`}
            onClick={handleTriStateClick}
          >
            {triStateIcon}
          </button>
        ) : (
          <input
            type="checkbox"
            checked={isChecked}
            onChange={handleToggle}
            className="region-checkbox"
          />
        )}

        <span
          className="region-name"
          onClick={handleNameClick}
          title={`${node.name} (${node.hierarchyLevel})`}
        >
          {node.name}
        </span>

        {!isZoomVisible && (
          <span className="zoom-hint" title="Zoom in to see on map">🔍</span>
        )}
      </div>
      {expanded && hasChildren && (
        <div className="region-children">
          {node.children.map(child => (
            <RegionNode
              key={child.id}
              node={child}
              countryId={countryId}
              depth={depth + 1}
              checkboxTree={checkboxTree}
              zoomLevel={zoomLevel}
              onFlyTo={onFlyTo}
              onFeatureClick={onFeatureClick}
              nodeMap={nodeMap}
              parentOnlyHiddenIds={parentOnlyHiddenIds}
              onSetParentHidden={onSetParentHidden}
            />
          ))}
        </div>
      )}
    </div>
  );
});

export default RegionTree;
