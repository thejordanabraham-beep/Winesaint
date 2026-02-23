# Sub-Region Sidebar Guidelines

## Core Principle: Always Show Geographic Hierarchy, Never Individual Producers/Wines

The sidebar navigation for wine sub-regions should **always reflect the geographic and political structure** of the wine region, NOT individual producers, vineyards, or wines.

---

## Correct Patterns

### ✅ Geographic Sub-Divisions
Show official sub-regions that divide a larger region into meaningful geographic areas:
- **Rioja**: Rioja Alta, Rioja Alavesa, Rioja Oriental
- **Douro**: Baixo Corgo, Cima Corgo, Douro Superior
- **Yarra Valley**: Upper Yarra, Central Yarra, Lower Yarra

### ✅ Villages and Towns
Show villages or towns where wine is produced:
- **Mosel**: Bernkastel, Wehlen, Erden, Graach, Ürzig, Piesport, etc.
- **Alsace**: Riquewihr, Ribeauvillé, Eguisheim, Kaysersberg, Turckheim, etc.
- **Ribera del Duero**: Peñafiel, Roa de Duero, Aranda de Duero, etc.

### ✅ Official Appellations or Classifications
Show official geographic designations when they exist:
- **Champagne**: Villages can be grouped by region (Montagne de Reims, Vallée de la Marne, etc.)
- **Burgundy**: Villages like Gevrey-Chambertin, Vosne-Romanée, Meursault, etc.
- **Barolo**: Villages like Barolo, La Morra, Serralunga d'Alba, etc.

### ✅ When to Skip the Sidebar
For **homogeneous regions** with no meaningful sub-divisions, omit the sidebar entirely:
- **Margaret River**: Relatively uniform region, no significant sub-regions

---

## Incorrect Patterns

### ❌ Individual Vineyard Names
Never show individual vineyards (Einzellagen, lieux-dits, MGAs, etc.) in the sidebar:
- **WRONG**: Bernkasteler Doctor, Wehlener Sonnenuhr (these are vineyards)
- **RIGHT**: Bernkastel, Wehlen (these are villages)

### ❌ Producer Names
Never show producer or estate names:
- **WRONG**: Domäne Wachau, FX Pichler, Prager (these are producers)
- **RIGHT**: Dürnstein, Weißenkirchen, Spitz (these are towns)

### ❌ Famous Wines
Never show individual wine names or brands:
- **WRONG**: Penfolds Grange, Henschke Hill of Grace (these are wines)
- **RIGHT**: Tanunda, Greenock, Marananga (these are towns)

### ❌ Grand Cru or Premier Cru Names Without Villages
Showing classification names without village context breaks the hierarchy:
- **WRONG**: 51 Alsace Grand Crus listed individually
- **RIGHT**: 29 Alsace villages that contain those Grand Crus

### ❌ Flat Lists Without Hierarchy
A long flat list of items without structure is confusing:
- **WRONG**: 68 Champagne villages listed alphabetically with no grouping
- **RIGHT**: Villages grouped by sub-region (Montagne de Reims, Vallée de la Marne, etc.)

---

## How to Determine Proper Structure

When creating or updating a sub-region page, use these methods to determine the correct sidebar structure:

### 1. Check Official Wine Region Organization
Look for official sub-region designations from wine boards or appellations:
- Spain: Consejo Regulador websites
- France: INAO appellations
- Italy: Consorzio websites
- Germany: VDP regional associations

### 2. Use the Village Extraction Script
For regions with data files (German GG, Burgundy climats, etc.), use the extraction script:
```bash
npx tsx scripts/extract-villages-from-data.ts --region mosel
```

### 3. Research Geographic Wine Literature
Check authoritative sources:
- Jancis Robinson's Wine Grapes
- Oxford Companion to Wine
- Hugh Johnson's Wine Atlas
- Regional wine board websites

### 4. Google Search Patterns
Use these search queries:
- "sub-regions of [Region Name]"
- "[Region Name] wine villages"
- "[Region Name] wine map"
- "[Region Name] wine towns"

### 5. Ask François (AI Assistant)
Query: "What are the main sub-regions and villages of [Region]?"

---

## Examples of Good Implementations

### German Regions (Mosel, Rheingau)
```typescript
const MOSEL_VILLAGES = [
  { name: 'Bernkastel', slug: 'bernkastel', type: 'village' },
  { name: 'Wehlen', slug: 'wehlen', type: 'village' },
  { name: 'Erden', slug: 'erden', type: 'village' },
  // ... 39 villages total
];
```
**Why it works**: Shows villages (geographic units) instead of Einzellagen (individual vineyards)

### Spanish Regions (Rioja)
```typescript
const RIOJA_SUBREGIONS = [
  { name: 'Rioja Alta', slug: 'rioja-alta', type: 'sub-region' },
  { name: 'Rioja Alavesa', slug: 'rioja-alavesa', type: 'sub-region' },
  { name: 'Rioja Oriental', slug: 'rioja-oriental', type: 'sub-region' }
];
```
**Why it works**: Shows official sub-regions of Rioja, not producers like CVNE or Viña Tondonia

### Portuguese Regions (Douro)
```typescript
const DOURO_SUBREGIONS = [
  { name: 'Baixo Corgo', slug: 'baixo-corgo', type: 'sub-region' },
  { name: 'Cima Corgo', slug: 'cima-corgo', type: 'sub-region' },
  { name: 'Douro Superior', slug: 'douro-superior', type: 'sub-region' }
];
```
**Why it works**: Shows the three official sub-zones of the Douro Valley

---

## Data Structure

All sidebar items should follow this structure:

```typescript
interface SidebarLink {
  name: string;        // Display name (e.g., "Bernkastel-Kues")
  slug: string;        // URL-friendly slug (e.g., "bernkastel-kues")
  type: string;        // Type of entity (e.g., "village", "sub-region", "town", "department")
}
```

### Type Field Values
- `'village'` - For wine villages (Germany, France, etc.)
- `'town'` - For wine towns (Spain, Austria, Australia, etc.)
- `'sub-region'` - For official sub-regions (Rioja Alta, Cima Corgo, etc.)
- `'department'` - For administrative regions (Argentina's Mendoza departments)

---

## Common Pitfalls and Solutions

### Pitfall 1: "But these are famous vineyards!"
**Problem**: Famous vineyards like Bernkasteler Doctor or Erbacher Marcobrunn are important sites.

**Solution**: Show the village (Bernkastel, Erbach) in the sidebar. The vineyard information belongs in the village's detail page or in individual wine reviews.

### Pitfall 2: "The Grand Crus are the most important sites"
**Problem**: Alsace has 51 Grand Crus, Burgundy has many Grands and Premiers Crus.

**Solution**: Show the villages that contain those Grand Crus. Users navigating geographically think in terms of "I want to learn about wines from Riquewihr" not "I want to learn about Schoenenbourg Grand Cru."

### Pitfall 3: "There are too many villages"
**Problem**: Some regions have 50+ villages (Mosel has 39, Champagne has 68).

**Solution**:
- For 20-40 villages: Show them all in a scrollable list
- For 40+ villages: Consider grouping by sub-region if meaningful divisions exist
- Or: Show only the most significant villages (10-20) with a note about others

### Pitfall 4: "The region doesn't have clear sub-divisions"
**Problem**: Some regions like Margaret River are relatively homogeneous.

**Solution**: Don't force it. Omit the sidebar entirely if there's no meaningful geographic hierarchy to show.

---

## Implementation Checklist

When creating or updating a sub-region page:

- [ ] Research the region's official structure
- [ ] Identify villages, towns, or sub-regions (NOT producers or vineyards)
- [ ] Use extraction script if data files exist
- [ ] Create an array of sidebar links with proper structure
- [ ] Use descriptive variable names (e.g., `MOSEL_VILLAGES`, not `MOSEL_LINKS`)
- [ ] Add a comment explaining the choice (e.g., "Villages of the Mosel - proper geographic hierarchy")
- [ ] Verify the sidebar renders correctly
- [ ] Test on mobile for responsive behavior

---

## Future Considerations

### Potential Enhancements
- **Collapsible sections**: Group villages by sub-region with expand/collapse
- **Search functionality**: Filter long lists of villages
- **Maps**: Visual representation of geographic structure
- **Breadcrumb trails**: Show hierarchy (Country > Region > Sub-region > Village)

### When to Group Villages
If a region has many villages AND clear sub-regions, consider grouping:
```typescript
const CHAMPAGNE_REGIONS = [
  {
    name: 'Montagne de Reims',
    villages: ['Ambonnay', 'Verzenay', 'Bouzy', ...]
  },
  {
    name: 'Vallée de la Marne',
    villages: ['Aÿ', 'Hautvillers', 'Cumières', ...]
  },
  // etc.
];
```

---

## Questions?

If you're unsure whether to include something in the sidebar, ask:

1. **Is this a geographic unit?** (village, town, sub-region) ✅
2. **Or is this a commercial entity?** (producer, wine brand, vineyard) ❌

The answer determines whether it belongs in the sidebar.

---

## Changelog

- **2024-02-02**: Initial creation after fixing 12 problematic sub-region pages
- Fixed regions: Mosel, Rheingau, Alsace, Rioja, Ribera del Duero, Wachau, Barossa Valley, Yarra Valley, Margaret River, Douro, Mendoza
- Champagne pending user guidance on grouping strategy
