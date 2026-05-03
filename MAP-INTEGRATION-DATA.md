# Payload CMS Slug Structure for Map Integration

## Goal

When a user clicks on a region in the map (e.g., Brouilly), we want the **AppellationPanel info box** to show content from the **Payload CMS region guide** instead of just the static GeoJSON properties.

**Current behavior:**
```
┌─────────────────────────────┐
│ Brouilly                  ✕ │
│ FRANCE                      │
│ TYPE: PDO                   │
│ KEY GRAPES: Gamay, ...      │  ← Static GeoJSON data
└─────────────────────────────┘
```

**Desired behavior:**
```
┌─────────────────────────────┐
│ Brouilly                  ✕ │
│ FRANCE / BEAUJOLAIS         │
│ Cru                         │
│ ─────────────────────────── │
│ The southernmost and largest│
│ of the Beaujolais Crus...   │  ← Rich content from Payload
│                             │
│ [View Full Guide →]         │  ← Links to /regions/france/beaujolais/brouilly
└─────────────────────────────┘
```

## How to Connect Them

1. **On feature click**, get the GeoJSON feature properties
2. **Build or lookup the `fullSlug`** that matches Payload's path format
3. **Fetch from Payload API:** `GET /api/regions?where[fullSlug][equals]=france/beaujolais/brouilly`
4. **Display the `description` field** (markdown content) in the info panel
5. **Add "View Full Guide" link** to `/regions/{fullSlug}`

## Overview
- **Total regions in Payload:** 2,397
- **Full slug list:** `/Users/jordanabraham/wine-reviews/payload-all-slugs.txt`

## Regions by Country

| Country | Count | Example Path |
|---------|-------|--------------|
| france | 1,055 | `france/burgundy/cote-de-nuits/gevrey-chambertin/chambertin` |
| germany | 470 | `germany/mosel/saar/scharzhofberg` |
| italy | 330 | `italy/piedmont/barolo/serralunga-d-alba/lazzarito` |
| austria | 207 | `austria/wachau/loibenberg` |
| united-states | 152 | `united-states/california/napa-valley/oakville` |
| spain | 39 | `spain/rioja` |
| australia | 31 | `australia/barossa-valley` |
| portugal | 20 | `portugal/douro` |
| Others | 53 | Single country-level entries |

## Hierarchy Patterns

### France
```
france/{region}                                    → france/burgundy
france/{region}/{subregion}                        → france/burgundy/cote-de-nuits
france/{region}/{subregion}/{village}              → france/burgundy/cote-de-nuits/gevrey-chambertin
france/{region}/{subregion}/{village}/{vineyard}   → france/burgundy/cote-de-nuits/gevrey-chambertin/chambertin
```

### Germany
```
germany/{region}                         → germany/mosel
germany/{region}/{subregion}             → germany/mosel/saar
germany/{region}/{subregion}/{vineyard}  → germany/mosel/saar/scharzhofberg
```
**Note:** Payload has subregion level (saar, ruwer, mittelmosel, terrassenmosel, obermosel). GeoJSON may skip this.

### Italy
```
italy/{region}                                → italy/piedmont
italy/{region}/{appellation}                  → italy/piedmont/barolo
italy/{region}/{appellation}/{village}        → italy/piedmont/barolo/serralunga-d-alba
italy/{region}/{appellation}/{village}/{mga}  → italy/piedmont/barolo/serralunga-d-alba/lazzarito
```
**Note:** Payload has village level. GeoJSON MGA file may have no parentId.

### USA
```
united-states/{state}                    → united-states/california
united-states/{state}/{region}           → united-states/california/napa-valley
united-states/{state}/{region}/{ava}     → united-states/california/napa-valley/oakville
```

## Known Matching Issues

### 1. German Vineyards (Einzellagen)
- **GeoJSON:** `name: "Scharzhofberg"`, `parentId: "PDO-DE-A1270"` (Mosel)
- **Payload:** `germany/mosel/saar/scharzhofberg`
- **Problem:** GeoJSON skips subregion level (Saar)

### 2. Barolo MGAs
- **GeoJSON (piedmont-mga.geojson):** `name: "Lazzarito"`, `parentId: null`
- **Payload:** `italy/piedmont/barolo/serralunga-d-alba/lazzarito`
- **Problem:** GeoJSON has no village info

### 3. Beaujolais Crus ✓ WORKS
- **GeoJSON:** `name: "Brouilly"`, `parentId: "fr-region-beaujolais"`
- **Payload:** `france/beaujolais/brouilly`
- **Match:** Direct, hierarchy aligns

## Recommended Matching Approach

```javascript
// For easy matches (Beaujolais, major regions)
function buildSlugFromGeoJSON(feature) {
  const { country, parentId, name } = feature.properties;
  const parentSlug = parentId?.replace(/^[a-z]{2}-region-/, '') || '';
  const nameSlug = slugify(name);
  return [country, parentSlug, nameSlug].filter(Boolean).join('/');
}

// For complex matches (MGAs, Einzellagen)
// Load payload-all-slugs.txt and search by name
function findPayloadSlug(name, payloadSlugs) {
  const nameSlug = slugify(name);
  return payloadSlugs.find(slug => slug.endsWith('/' + nameSlug));
}
```

## Quick Reference: What Matches Easily

| GeoJSON Source | Payload Match | Notes |
|----------------|---------------|-------|
| Country-level regions | ✓ Yes | france, germany, italy, etc. |
| Major regions | ✓ Yes | burgundy, bordeaux, mosel |
| Beaujolais crus | ✓ Yes | Hierarchy matches |
| Bordeaux appellations | ✓ Yes | left-bank/right-bank structure |
| Barolo MGAs | ⚠ Needs lookup | No village in GeoJSON |
| German Einzellagen | ⚠ Needs lookup | No subregion in GeoJSON |
| Burgundy climats | ⚠ Needs lookup | May need village mapping |

## Implementation Example

### Step 1: Add fullSlug to GeoJSON features (map-side work)

Either at build time or runtime, add a `fullSlug` property to each feature:

```javascript
// In the map app, when loading/processing GeoJSON
feature.properties.fullSlug = buildFullSlug(feature.properties);
```

### Step 2: Fetch from Payload on click (after integration)

```javascript
// In AppellationPanel.tsx
async function fetchRegionGuide(fullSlug) {
  // After map is integrated into Winesaint, this is a local API call
  const res = await fetch(`/api/regions?where[fullSlug][equals]=${fullSlug}&limit=1`);
  const data = await res.json();

  if (data.docs && data.docs.length > 0) {
    return {
      found: true,
      name: data.docs[0].name,
      description: data.docs[0].description,  // Markdown content
      classification: data.docs[0].classification,
      level: data.docs[0].level,
      fullSlug: data.docs[0].fullSlug
    };
  }
  return { found: false };
}
```

### Step 3: Display in AppellationPanel

```jsx
// If Payload has a guide, show rich content
{regionGuide.found ? (
  <>
    <div className="description">
      {regionGuide.description.substring(0, 300)}...
    </div>
    <a href={`/regions/${regionGuide.fullSlug}`}>
      View Full Guide →
    </a>
  </>
) : (
  // Fall back to GeoJSON data
  <div className="grapes">{feature.properties.grapes}</div>
)}
```

### Payload API Response Example

```json
{
  "docs": [{
    "id": 1234,
    "name": "Brouilly",
    "slug": "brouilly",
    "fullSlug": "france/beaujolais/brouilly",
    "level": "subregion",
    "classification": "cru",
    "description": "# Brouilly\n\nThe southernmost and largest of the ten Beaujolais Crus, Brouilly encompasses 1,300 hectares of vineyards surrounding Mont Brouilly...",
    "parentRegion": { "id": 45, "fullSlug": "france/beaujolais" }
  }],
  "totalDocs": 1
}
```

## File Locations

- **Full slug list:** `/Users/jordanabraham/wine-reviews/payload-all-slugs.txt`
- **This document:** `/Users/jordanabraham/wine-reviews/MAP-INTEGRATION-DATA.md`
