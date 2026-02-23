# Session Notes - January 23, 2026

## ✅ What We Accomplished Today

### 1. Wine Display Formatting - FIXED
**Problem:** Wine titles showed duplications like "2020 Opus One Opus One Cabernet Sauvignon"

**Solution:** Implemented smart deduplication logic in both front and back pages:
- Exact match removal (e.g., "Opus One" producer + "Opus One" wine name → "2020 Opus One")
- Prefix match removal (e.g., "Abreu Vineyards" producer + "Abreu Vineyards Cabernet Sauvignon" → "2020 Abreu Vineyards Cabernet Sauvignon")
- First-word match removal (e.g., "Aperture Cellars" producer + "Aperture Alexander Valley Cabernet Sauvignon" → "2020 Aperture Cellars Alexander Valley Cabernet Sauvignon")
- Removed automatic grape variety appending (was making titles too long)

**Files Modified:**
- `/Users/jordanabraham/wine-reviews/components/search/SearchResultCard.tsx`
- `/Users/jordanabraham/wine-reviews/app/wines/[slug]/page.tsx`

### 2. Wine Detail Page (Back Page) - REDESIGNED
**Changes:**
- Removed left photo column entirely
- Main title now: "Vintage Producer Wine Name" (e.g., "2021 Clemens Busch Marienburg Fahrlay")
- Location subtitle: "Region, Country" (e.g., "Mosel, Germany")
- Consolidated header + reviews into single box
- Removed "Reviews (1)" heading
- Removed "See more wines from..." link
- Removed AI badge
- Removed Vintage/Critic Score/Vivino stats section

**Added Three Info Boxes:**
1. **Producer Box**: Just producer name + bio (no heading)
2. **Vineyard Box**: Just vineyard name (e.g., "Marienburg Fahrlay-Terrassen")
3. **Vintage Box**: Auto-populated as "Region Vintage" (e.g., "Mosel 2021")

**Review Format Standardized:**
- Tasting notes
- Flavor profile badges
- "Pairs with: ..." (above drink this if)
- "Drink this if: ... 🍷" (at end)

### 3. Front Page (Reviews Listing) - STANDARDIZED
**Changes:**
- Same title format: "Vintage Producer Wine Name"
- Location: "Region, Country"
- Score + Price on right side
- When expanded: shows flavor badges, food pairings, "Drink this if: ... 🍷"

**Files Modified:**
- `/Users/jordanabraham/wine-reviews/components/search/SearchResultCard.tsx`
- `/Users/jordanabraham/wine-reviews/app/search/page.tsx`
- `/Users/jordanabraham/wine-reviews/app/api/wines/route.ts`

### 4. Schema Updates
**Added:**
- `vineyard` field to wine schema (`/Users/jordanabraham/wine-reviews/sanity/schemas/wine.ts`)

**Data Updates:**
- Added vineyard data to all 25 Clemens Busch wines
- Vineyard mapping:
  - "Marienburg Grosses Gewächs" → "Marienburg"
  - "Marienburg Rothenpfad" → "Marienburg Rothenpfad"
  - "Marienburg Fahrlay" → "Marienburg Fahrlay-Terrassen"
  - "Vom Roten Schiefer" → "Estate"
  - "Pündericher Marienburg Kabinett" → "Marienburg"
- Added Clemens Busch producer bio

**Scripts Created:**
- `/Users/jordanabraham/wine-reviews/scripts/add-vineyards-to-clemens-busch.ts`
- `/Users/jordanabraham/wine-reviews/scripts/add-slugs-to-wines.ts`

## 🎯 Next Session: Geranium Wine List Import

### Files Ready for Import
Located on desktop:
- `/Users/jordanabraham/Desktop/Geranium Wine List.pdf` (477KB) - **USE THIS ONE**
- `/Users/jordanabraham/Desktop/Geranium Wine List.txt` (325KB) - (has pricing mixed in, harder to parse)

### The Plan
1. **Parse PDF** to extract structured wine data:
   - Producer
   - Vintage
   - Wine name
   - Vineyard (if present)
   - Region
   - Price

2. **Slowly crawl and add wines** to Sanity:
   - Create/fetch producers
   - Create/fetch regions
   - Add wine entries with all metadata
   - **NO REVIEWS YET** (just populate wine database)

3. **Back pages will auto-populate** because structure is already built:
   - Producer box
   - Vineyard box
   - Vintage box
   - Empty review section (to be filled later)

4. **Later**: Batch generate reviews using François RAG + WEG

### Why PDF Over TXT?
- PDF preserves visual structure (columns, spacing)
- Clear distinction between producer, vintage, wine name, vineyard
- TXT has prices mixed in which makes parsing harder

### Estimated Scope
- Likely 500-1000+ wines in Geranium list
- Need rate limiting (crawl slowly)
- Need duplicate detection
- Need to handle regional naming conventions:
  - Burgundy climats
  - German Prädikats (GG, Kabinett, Spätlese, etc.)
  - Italian classifications

## 🗄️ Important Context

### Vintage Report System
- Schema exists (`vintageReport.ts`) but no data yet
- Currently showing "Mosel 2021" in vintage box
- **Future plan**: Automate vintage report generation using François + WEG
- Don't manually create vintage reports yet - will automate later

### Review Generation System
- Uses François RAG API (http://localhost:8000)
- Uses reranked search for better context
- K&L notes waterfall (K&L curated notes → François RAG → fallback)
- Script: `/Users/jordanabraham/wine-reviews/scripts/generate-reviews-v2.ts`

### Current Wine Count
- Check with: `npx tsx -e "import { createClient } from '@sanity/client'; ..." `
- Includes: Jolie Laide Trousseau, Clemens Busch, various Napa/Bordeaux wines

## 🚨 Known Issues
None - all formatting issues resolved!

## 📝 Quick Reference

### Run Development Server
```bash
cd ~/wine-reviews
npm run dev
# Access at http://localhost:3000
```

### Check François RAG API
```bash
curl http://localhost:8000/
# Should return: {"status":"ok","service":"Wine Expert RAG API"}
```

### Generate Wine Slugs
```bash
npx tsx scripts/add-slugs-to-wines.ts
```

### Query Sanity Data
```bash
npx tsx -e "
import { createClient } from '@sanity/client';
import dotenv from 'dotenv';
import path from 'path';

dotenv.config({ path: path.resolve(process.cwd(), '.env.local') });

const client = createClient({
  projectId: process.env.SANITY_PROJECT_ID,
  dataset: process.env.SANITY_DATASET || 'production',
  apiVersion: '2024-01-01',
  useCdn: false,
  token: process.env.SANITY_API_TOKEN,
});

async function query() {
  const count = await client.fetch(\`count(*[_type == 'wine'])\`);
  console.log('Total wines:', count);
}

query().catch(console.error);
"
```

## 🔑 Environment Variables
Located at: `/Users/jordanabraham/wine-reviews/.env.local`
- Sanity credentials
- Anthropic API key
- RAG API URL and key
- Mapbox token

---

**Ready to continue!** Next session: Parse and import Geranium wine list PDF.
