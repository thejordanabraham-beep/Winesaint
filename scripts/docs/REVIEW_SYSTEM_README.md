# 🍷 Wine Saint Review System

## ⭐ THE PERMANENT DEFAULT REVIEW SYSTEM

**wine-saint-unified-system.ts** is the official, permanent review generation system for all wines.

---

## 🚀 Quick Start

### Generate a Single Review
```bash
# Using npm script (recommended)
npm run review <wine-id>

# Or directly
npx tsx scripts/wine-saint-unified-system.ts <wine-id>
```

### Generate Multiple Reviews
```bash
# Generate 10 reviews
npm run review:batch 10

# Generate reviews for ALL wines without reviews
npm run review:batch all
```

---

## 📋 What This System Does

✅ **Standardized "Wine Saint" reviewer** - All reviews unified under one name
✅ **Generous scoring** - All wines score 87-100 (no score below 87)
✅ **Natural writing style** - Academic/technical but varied, not robotic
✅ **Reference-based** - Pulls from K&L notes → François RAG → AI generation
✅ **Works for ALL wines** - Even without external scores

---

## 🎯 System Features

### Scoring Formula
```
Base: (criticAvg × 0.85) + (vivinoScore × 0.15)
Boost: +2 points
Floor: 87 minimum
Result: All wines score 87-100
```

### Writing Style
- **Academic/Technical** - Precise wine terminology (pH, acidity, tannins, minerality)
- **Natural Variation** - Reviews don't follow rigid templates
- **Vintage Context** - Woven in naturally when relevant (not forced as opening)
- **Educational** - Factual and analytical, not marketing speak

### Reference Priority
1. **K&L Wine Merchants notes** (hardcoded reference data)
2. **François RAG API** (2,739 documents: vintage charts, vineyard profiles)
3. **Wine.com** (web scraping fallback)
4. **Pure AI Generation** (maintains Wine Saint style)

---

## 📝 Examples

### Single Wine
```bash
npm run review 0JKmUvWKRn6KvuTN5C9XlD
```

Output:
```
🍷 WINE SAINT UNIFIED SYSTEM
======================================================================

📝 Processing: 2021 Jean-Claude Ramonet La Boudriotte
   Producer: Jean-Claude Ramonet
   Region: France - Burgundy
   Vintage: 2021

📊 SCORING:
   Critic Avg: N/A
   Vivino: N/A
   → Final Score: 90/100 (with +2 boost)

✍️  Generating Wine Saint review...
   ⚠️  No reference found, using pure AI generation

✅ Review generated:
   Score: 93/100
   Summary: A textbook expression of premier cru Chassagne-Montrachet...

💾 Saving to Sanity...

✅ COMPLETE
   Review ID: sAARhwPVXsFPP3uJ8TPRms
   View at: http://localhost:3000/wines/2021-jean-claude-ramonet-la-boudriotte
```

### Batch Generation
```bash
npm run review:batch 5
```

Generates Wine Saint reviews for 5 wines without reviews.

---

## 🔧 For Developers

### Import Functions in Your Scripts

```typescript
import {
  calculateScore,
  generateWineSaintReview,
  generateReview
} from './wine-saint-unified-system';

// Calculate score only
const score = calculateScore(criticAvg, vivinoScore);

// Generate review data (doesn't save)
const reviewData = await generateWineSaintReview(wine, score);

// Full pipeline: generate + save to Sanity
const savedReview = await generateReview(wineId);
```

### Example: Custom Batch Script

```typescript
import { generateReview } from './wine-saint-unified-system';
import { createClient } from '@sanity/client';

// Get wines from a specific region
const wines = await client.fetch(`
  *[_type == 'wine' && region->name == 'Burgundy' &&
    !defined(*[_type == 'review' && wine._ref == ^._id][0]._id)]
`);

// Generate reviews
for (const wine of wines) {
  await generateReview(wine._id);
}
```

---

## ⚠️ Important Notes

### DO:
✅ Use `wine-saint-unified-system.ts` for ALL review generation
✅ Import functions from this script for batch operations
✅ Use "Wine Saint" as reviewer name (system handles this)
✅ Trust the generous scoring (87-100 range is intentional)

### DON'T:
❌ Create new review generation scripts from scratch
❌ Use old scripts: `generate-5-random-reviews.ts`, etc.
❌ Reimplement scoring formulas
❌ Change the "Wine Saint" reviewer name
❌ Display review dates to users (store only)

---

## 📚 Full Documentation

See `WINE_SAINT_STANDARD.md` for comprehensive system documentation including:
- Complete scoring formula explanation
- Writing style guidelines with examples
- Reference source details (François RAG contents)
- Anti-patterns and best practices
- Version history

---

## 🆘 Troubleshooting

### François RAG not found?
The system will gracefully fall back to pure AI generation while maintaining Wine Saint style.

### Sanity quota exceeded?
Upgrade your Sanity plan or wait for quota reset. The system will show clear error messages.

### Reviews sound too similar?
The updated system (v1.1+) includes natural variation. If using an old version, pull latest code.

---

**Last Updated:** January 27, 2026
**System Version:** 1.1
**Status:** ✅ Active - Permanent Default
