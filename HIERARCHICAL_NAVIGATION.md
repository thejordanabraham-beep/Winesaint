# Hierarchical Vineyard & Village Navigation System

## Overview

WineSaint now supports a **5-level hierarchical navigation system** for wine regions:

```
Country → Region → Sub-region → Village → Vineyard/Climat
```

**Example Path:**
```
France → Burgundy → Côte de Nuits → Gevrey-Chambertin → Chambertin (Grand Cru)
```

---

## Architecture

### Data Layer (Single Source of Truth)

**`lib/guide-config.ts`** contains the complete hierarchy structure:

```typescript
{
  slug: 'gevrey-chambertin',
  name: 'Gevrey-Chambertin',
  level: 'village',
  parent: 'cote-de-nuits',
  sidebarLinks: [
    { name: 'Chambertin', slug: 'chambertin', classification: 'grand-cru' },
    // ... more vineyards
  ],
  subRegions: [
    {
      slug: 'chambertin',
      name: 'Chambertin',
      level: 'vineyard',
      classification: 'grand-cru',
      parent: 'gevrey-chambertin',
      guideFile: 'chambertin-vineyard-guide.md'
    }
  ]
}
```

**Key Fields:**
- `slug` - URL-safe identifier (lowercase, no accents)
- `name` - Display name (can have accents, proper capitalization)
- `level` - One of: `'country' | 'region' | 'sub-region' | 'village' | 'vineyard'`
- `parent` - Slug of parent region
- `classification` - For vineyards: `'grand-cru' | 'premier-cru' | 'village'` etc.
- `sidebarLinks` - Links shown in sidebar navigation
- `subRegions` - Nested children in hierarchy
- `guideFile` - Markdown guide filename
- `sanityRef` - Optional Sanity CMS document ID

### UI Layer

**`components/RegionLayout.tsx`** handles all 5 levels:

**For Villages:**
- Sidebar groups vineyards by classification
- "GRAND CRU (9)" / "PREMIER CRU (3)" / "VILLAGE" sections
- Color-coded (amber for Grand Cru, burgundy for Premier Cru)

**For Vineyards:**
- Classification badge at top
- Vineyard metadata panel (if Sanity data exists)
- Guide content from markdown files

### Page Generation

**`scripts/generate-all-region-pages.ts`** auto-creates all page files:

```bash
# See what would be created
npx tsx scripts/generate-all-region-pages.ts --dry-run

# Create all missing pages
npx tsx scripts/generate-all-region-pages.ts
```

**What it does:**
1. Reads `REGION_HIERARCHY` from guide-config.ts
2. Finds all `village` and `vineyard` entries
3. Creates `/app/regions/.../page.tsx` files
4. Skips files that already exist
5. Reports what was created

---

## Adding New Regions

### Step 1: Add to guide-config.ts

Add your villages and vineyards to the appropriate sub-region:

```typescript
{
  slug: 'cote-de-beaune',
  name: 'Côte de Beaune',
  level: 'sub-region',
  parent: 'burgundy',
  sidebarLinks: [
    { name: 'Beaune', slug: 'beaune' },
    { name: 'Pommard', slug: 'pommard' },
  ],
  subRegions: [
    {
      slug: 'beaune',
      name: 'Beaune',
      level: 'village',
      parent: 'cote-de-beaune',
      sidebarLinks: [
        { name: 'Clos des Mouches', slug: 'clos-des-mouches', classification: 'premier-cru' },
      ],
      subRegions: [
        {
          slug: 'clos-des-mouches',
          name: 'Clos des Mouches',
          level: 'vineyard',
          classification: 'premier-cru',
          parent: 'beaune',
        }
      ]
    }
  ]
}
```

### Step 2: Generate Pages

```bash
npx tsx scripts/generate-all-region-pages.ts
```

This automatically creates:
- `/app/regions/france/burgundy/cote-de-beaune/beaune/page.tsx`
- `/app/regions/france/burgundy/cote-de-beaune/beaune/clos-des-mouches/page.tsx`

### Step 3: Update Parent Page

Make sure the parent page links to villages:

```typescript
// app/regions/france/burgundy/cote-de-beaune/page.tsx
export default function CoteDeBeaunePage() {
  return (
    <RegionLayout
      title="Côte de Beaune"
      level="sub-region"
      parentRegion="france/burgundy"  // ✓ Full lowercase path
      sidebarLinks={COTE_DE_BEAUNE_VILLAGES}
      contentFile="cote-de-beaune-guide.md"
    />
  );
}
```

### Step 4: Generate Guide Content

```bash
npx tsx scripts/wine-region-guide-generator.ts --level village --only beaune
npx tsx scripts/wine-region-guide-generator.ts --level vineyard --only clos-des-mouches
```

---

## Best Practices

### ✅ DO

1. **Always use lowercase slug paths for `parentRegion`:**
   ```typescript
   parentRegion="france/burgundy/cote-de-nuits/gevrey-chambertin"  // ✓ Good
   ```

2. **Remove accents from slugs:**
   ```typescript
   slug: 'cote-de-nuits'  // ✓ Good (no accents)
   name: 'Côte de Nuits'  // ✓ Display name has accents
   ```

3. **Use the generator script:**
   ```bash
   npx tsx scripts/generate-all-region-pages.ts
   ```

4. **Keep guide-config.ts as the single source of truth**

### ❌ DON'T

1. **Don't use capitalized or partial paths:**
   ```typescript
   parentRegion="Burgundy"  // ✗ Bad
   parentRegion="France/Burgundy"  // ✗ Bad (capitalized)
   ```

2. **Don't create page files manually** - use the generator

3. **Don't put content in guide-config.ts** - only structure

4. **Don't forget to add sidebarLinks** - they drive navigation

---

## Current Implementation

### Burgundy Côte de Nuits (Complete)

✅ **5 Villages:**
- Gevrey-Chambertin (9 Grand Crus, 3 Premier Crus)
- Morey-Saint-Denis (5 Grand Crus)
- Chambolle-Musigny (2 Grand Crus, 1 Premier Cru)
- Vougeot (1 Grand Cru)
- Vosne-Romanée (8 Grand Crus)

✅ **33 Vineyards:** All Grand Crus + select Premier Crus

✅ **All page files generated**

### URL Examples

All these URLs now work:

```
/regions/france/burgundy/cote-de-nuits
/regions/france/burgundy/cote-de-nuits/gevrey-chambertin
/regions/france/burgundy/cote-de-nuits/gevrey-chambertin/chambertin
/regions/france/burgundy/cote-de-nuits/vosne-romanee/romanee-conti
```

---

## Wine Review Integration

Wine detail pages now show clickable vineyard information:

```typescript
// app/wines/[slug]/page.tsx
{wine.climat && (
  <div>
    {/* Classification Badge */}
    <span className="bg-amber-500">GRAND CRU</span>

    {/* Clickable Link */}
    <Link href={getVineyardPath(wine.climat.slug)}>
      {wine.climat.name} →
    </Link>

    {/* Quick Facts */}
    <p>Size: {wine.climat.acreage} hectares</p>
    <p>Soils: {wine.climat.soilTypes.join(', ')}</p>
  </div>
)}
```

---

## Troubleshooting

**Problem: "Region Not Found" when clicking village/vineyard**

**Solution 1:** Check if page file exists
```bash
ls app/regions/france/burgundy/cote-de-nuits/gevrey-chambertin/page.tsx
```

**Solution 2:** Regenerate all pages
```bash
npx tsx scripts/generate-all-region-pages.ts
```

**Solution 3:** Check parentRegion is correct (lowercase, full path)

---

**Problem: Accents in URLs causing 404s**

**Solution:** Slugs in guide-config.ts must have accents removed:
```typescript
slug: 'cote-de-nuits'  // ✓ Correct
slug: 'côte-de-nuits'  // ✗ Wrong
```

---

**Problem: Sidebar links not showing**

**Solution:** Make sure parent page has `sidebarLinks` prop:
```typescript
<RegionLayout
  sidebarLinks={VILLAGES}  // ← Must include this
/>
```

---

## Future Expansion

To add more regions (Bordeaux, Rhône, etc.):

1. Add structure to `lib/guide-config.ts`
2. Run `npx tsx scripts/generate-all-region-pages.ts`
3. Generate guide content
4. Done!

The system is designed to scale to hundreds of villages and thousands of vineyards.
