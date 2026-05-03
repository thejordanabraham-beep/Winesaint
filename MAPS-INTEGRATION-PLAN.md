# Wine Saint Maps Integration Plan

## Current State

### Wine Saint Maps (Standalone App)
- **Location**: `/Users/jordanabraham/Desktop/WINESAINT CLAUDE/wine-saint-maps/`
- **Live**: https://wine-saint-maps.vercel.app
- **Stack**: Vite 8 + React 19 + MapLibre GL 5.21
- **Size**: ~5,000 lines of code across 9 components + 4 hooks

### Winesaint (Main App)
- **Location**: `/Users/jordanabraham/wine-reviews/`
- **Stack**: Next.js 16 + React 19 + Payload CMS + Tailwind
- **Current maps page**: Simple redirect link to standalone app

---

## Map App Architecture

### Components
| Component | Lines | Purpose |
|-----------|-------|---------|
| MapView.jsx | 2,327 | MapLibre GL canvas, 40+ layers, events |
| App.jsx | 425 | State orchestration (10+ useState hooks) |
| RegionTree.jsx | 347 | Sidebar country/region tree with tri-state checkboxes |
| ElevationProfile.jsx | 349 | Draw line → show elevation graph |
| SearchBar.jsx | ~200 | Pre-baked index search (~1MB) |
| AppellationPanel.jsx | ~150 | Feature details on click |
| MeasureTools.jsx | ~150 | Distance/area measurement |
| TerrainOverlayPanel.jsx | ~100 | Slope/aspect/contours/drainage toggles |
| RegionBreadcrumb.jsx | ~80 | Navigation breadcrumb |

### Custom Hooks
| Hook | Purpose |
|------|---------|
| useCheckboxTree.js | Via-negativa checkbox state (uncheckedIds) |
| useRegionHierarchy.js | Navigation stack for drill-down |
| useHierarchyTree.js | Tree builder + visibility logic |
| useUrlState.js | Hash-based URL persistence |

### Data Files (public/data/)
**21 Country GeoJSONs:**
france.geojson, italy.geojson, spain.geojson, germany.geojson, austria.geojson, portugal.geojson, greece.geojson, hungary.geojson, romania.geojson, bulgaria.geojson, croatia.geojson, slovenia.geojson, czech-republic.geojson, slovakia.geojson, cyprus.geojson, united-states.geojson, australia.geojson, chile.geojson, argentina.geojson, new-zealand.geojson, south-africa.geojson

**Fine Detail GeoJSONs:**
- burgundy-climats.geojson (Grand Cru/Premier Cru parcels)
- piedmont-mga.geojson (Barolo/Barbaresco MGAs)
- german-einzellagen.geojson (~2,600 vineyard sites)
- austrian-rieden.geojson
- rhone-lieux-dits.geojson, loire-lieux-dits.geojson, champagne-lieux-dits.geojson
- etna-contrade.geojson
- france-extra-lieux-dits.geojson (Beaujolais, Jura, Languedoc, etc.)

**Context Layers:**
countries-outline.geojson, us-states-outline.geojson

**Search:**
search-index.json (~1MB pre-baked)

### Dependencies
```json
{
  "maplibre-gl": "^5.21.0",
  "pmtiles": "^4.4.0",
  "react": "^19.2.4"
}
```

---

## Integration Options

### Option A: Iframe Embed ❌
Embed standalone app in iframe.
- **Pros**: Zero code changes
- **Cons**: No deep linking, separate navigation, feels disconnected

### Option B: Full Next.js Port ✅ (Recommended)
Move all components into Winesaint as client components.
- **Pros**: Full integration, deep linking, shared navigation, unified deployment
- **Cons**: More upfront work (~12-14 hours)

### Option C: Micro-frontend (postMessage) ❌
Keep standalone, communicate via postMessage.
- **Pros**: Isolated
- **Cons**: Complex sync, still separate deployments

---

## Recommended: Full Port to Next.js

### Phase 1: Setup (~1 hour)

1. **Add dependencies**
   ```bash
   cd /Users/jordanabraham/wine-reviews
   npm install maplibre-gl pmtiles
   ```

2. **Create directory structure**
   ```
   components/maps/
   ├── MapView.tsx
   ├── MapApp.tsx (orchestrator, formerly App.jsx)
   ├── RegionTree.tsx
   ├── AppellationPanel.tsx
   ├── SearchBar.tsx
   ├── RegionBreadcrumb.tsx
   ├── TerrainOverlayPanel.tsx
   ├── MeasureTools.tsx
   ├── ElevationProfile.tsx
   ├── hooks/
   │   ├── useCheckboxTree.ts
   │   ├── useRegionHierarchy.ts
   │   ├── useHierarchyTree.ts
   │   └── useUrlState.ts
   └── config/
       ├── hierarchyConfig.ts
       ├── colorPalette.ts
       └── countryHierarchies/
   ```

3. **Copy data files**
   ```bash
   cp -r "/Users/jordanabraham/Desktop/WINESAINT CLAUDE/wine-saint-maps/public/data" \
         "/Users/jordanabraham/wine-reviews/public/data/maps"
   ```

### Phase 2: Component Migration (~4-6 hours)

For each component:
1. Copy from wine-saint-maps/src/components/
2. Rename .jsx → .tsx
3. Add `'use client'` directive (MapLibre requires browser)
4. Add TypeScript types
5. Update imports to Next.js conventions

**Key changes:**
```tsx
// Before (Vite)
import './MapView.css';

// After (Next.js)
'use client';
import styles from './MapView.module.css';
// or keep global CSS in app/maps/maps.css
```

### Phase 3: Routes (~1 hour)

**app/(main)/maps/layout.tsx**
```tsx
import '@/components/maps/maps.css'; // MapLibre styles

export default function MapsLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="h-[calc(100vh-64px)] overflow-hidden">
      {children}
    </div>
  );
}
```

**app/(main)/maps/[[...path]]/page.tsx**
```tsx
import dynamic from 'next/dynamic';

const MapApp = dynamic(() => import('@/components/maps/MapApp'), {
  ssr: false, // MapLibre requires browser APIs
  loading: () => <div className="animate-pulse bg-gray-100 h-full" />
});

interface Props {
  params: Promise<{ path?: string[] }>;
}

export default async function MapsPage({ params }: Props) {
  const { path } = await params;
  const initialRegion = path?.join('/') || null;

  return <MapApp initialRegionPath={initialRegion} />;
}
```

**URL Structure:**
- `/maps` → World view
- `/maps/france` → France centered
- `/maps/france/burgundy` → Burgundy zoomed
- `/maps/france/burgundy/cote-de-nuits/gevrey-chambertin` → Village level

### Phase 4: Navigation Integration (~1 hour)

**Update Header MapsDropdown:**
Link to internal `/maps/[region]` instead of external URL.

**Region pages → Map:**
Add to RegionLayout.tsx:
```tsx
<Link href={`/maps/${fullSlug}`} className="...">
  <MapIcon /> View on Map
</Link>
```

**Map → Region pages:**
In AppellationPanel:
```tsx
<Link href={`/regions/${feature.properties.fullSlug}`}>
  View Full Guide →
</Link>
```

### Phase 5: Payload Integration (~2-3 hours)

Connect map features to Payload CMS:

1. **On feature click**, fetch region from Payload:
   ```ts
   const region = await fetch(`/api/regions?where[fullSlug][equals]=${slug}`);
   ```

2. **AppellationPanel shows:**
   - Region name + classification
   - Description excerpt from Payload
   - Link to full guide
   - Producers in region (from Payload)
   - Wines from region (from Payload)

3. **Sync GeoJSON slugs with Payload fullSlug:**
   - Ensure france.geojson features have `fullSlug` property matching Payload
   - May need migration script to align property names

---

## File Migration Checklist

### Components
- [ ] MapView.jsx → components/maps/MapView.tsx (2,327 lines)
- [ ] App.jsx → components/maps/MapApp.tsx (425 lines)
- [ ] RegionTree.jsx → components/maps/RegionTree.tsx
- [ ] AppellationPanel.jsx → components/maps/AppellationPanel.tsx
- [ ] SearchBar.jsx → components/maps/SearchBar.tsx
- [ ] RegionBreadcrumb.jsx → components/maps/RegionBreadcrumb.tsx
- [ ] TerrainOverlayPanel.jsx → components/maps/TerrainOverlayPanel.tsx
- [ ] MeasureTools.jsx → components/maps/MeasureTools.tsx
- [ ] ElevationProfile.jsx → components/maps/ElevationProfile.tsx

### Hooks
- [ ] useCheckboxTree.js → components/maps/hooks/useCheckboxTree.ts
- [ ] useRegionHierarchy.js → components/maps/hooks/useRegionHierarchy.ts
- [ ] useHierarchyTree.js → components/maps/hooks/useHierarchyTree.ts
- [ ] useUrlState.js → components/maps/hooks/useUrlState.ts

### Utils
- [ ] colorFamilies.js → lib/maps/colorFamilies.ts
- [ ] terrainAnalysis.js → lib/maps/terrainAnalysis.ts

### Config
- [ ] hierarchyConfig.js → components/maps/config/hierarchyConfig.ts
- [ ] colorPalette.js → components/maps/config/colorPalette.ts
- [ ] burgundyClimatMap.js → components/maps/config/burgundyClimatMap.ts
- [ ] grandCruList.js → components/maps/config/grandCruList.ts
- [ ] *Hierarchy.js (15 files) → components/maps/config/countryHierarchies/

### Data
- [ ] Copy all 40+ GeoJSON files → public/data/maps/
- [ ] Copy search-index.json → public/data/maps/

### Styles
- [ ] index.css (MapLibre imports) → app/(main)/maps/maps.css
- [ ] Component styles → CSS modules or inline Tailwind

---

## Technical Considerations

### SSR / Client Components
- All map components need `'use client'`
- Use `dynamic()` with `ssr: false` for MapLibre
- Server components can provide initial data

### MapLibre GL CSS
Required CSS import:
```css
@import 'maplibre-gl/dist/maplibre-gl.css';
```

### Performance
- GeoJSON files cached by browser (static assets)
- MapLibre handles GPU-accelerated rendering
- Search index loaded lazily
- React.lazy() for TerrainOverlayPanel, MeasureTools, ElevationProfile

### Mobile
- Already responsive
- Sidebar collapses
- Touch gestures handled by MapLibre

---

## Estimated Effort

| Phase | Tasks | Time |
|-------|-------|------|
| Phase 1 | Dependencies, folders, data copy | 1 hour |
| Phase 2 | Port 9 components + 4 hooks + types | 4-6 hours |
| Phase 3 | Routes + layout | 1 hour |
| Phase 4 | Navigation integration | 1 hour |
| Phase 5 | Payload CMS connection | 2-3 hours |
| Testing | Cross-browser, mobile, edge cases | 2 hours |
| **Total** | | **11-14 hours** |

---

## Success Criteria

1. ✅ Map loads at `/maps` with full functionality
2. ✅ Deep linking: `/maps/france/burgundy` works
3. ✅ Bidirectional navigation: Region ↔ Map
4. ✅ Search works within map
5. ✅ Mobile responsive
6. ✅ Single deployment (no separate Vercel project)
7. ✅ Shared header/footer with main site
8. ✅ Feature click shows Payload region data

---

## Post-Integration Cleanup

After successful integration:
1. Archive wine-saint-maps standalone repo
2. Update any external links to new `/maps` route
3. Remove standalone Vercel deployment
4. Redirect old domain to new route
