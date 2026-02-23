# Wine Import Guide

Complete guide for importing wines from the Excel spreadsheet into Sanity.

## Prerequisites

1. ✅ Excel file at: `/Users/jordanabraham/Desktop/WINESAINT_MSTR_RVW.xlsx`
2. ✅ François RAG server running at `http://localhost:8000` (optional but recommended)
3. ✅ Sanity credentials in `.env.local`
4. ✅ Anthropic API key in `.env.local`

## Main Import Script

**File:** `scripts/import-wines-from-excel.ts`

### Basic Usage

```bash
# Import ALL wines from all sheets (Austria, California, Italy)
npx tsx scripts/import-wines-from-excel.ts
```

### Import Options

```bash
# Import only from California sheet
npx tsx scripts/import-wines-from-excel.ts --sheets California

# Import first 100 wines from each sheet
npx tsx scripts/import-wines-from-excel.ts --limit 100

# Import wines 100-200 from Austria only
npx tsx scripts/import-wines-from-excel.ts --sheets Austria --offset 100 --limit 100

# Import from multiple specific sheets
npx tsx scripts/import-wines-from-excel.ts --sheets "Austria,Italy"

# Faster processing (500ms delay between wines)
npx tsx scripts/import-wines-from-excel.ts --delay 500
```

### Command-Line Options

| Option | Description | Default |
|--------|-------------|---------|
| `--sheets` | Comma-separated sheet names to import | `Austria,California,Italy` |
| `--limit` | Max wines per sheet | All wines |
| `--offset` | Skip first N wines per sheet | 0 |
| `--delay` | Delay between imports (ms) | 1000 |

## What Gets Imported

For each wine, the script:

1. **Converts score:** 100-point → 1-10 scale with randomization
2. **Queries François RAG:** Gets contextual knowledge about the wine
3. **Rewords review:** Original review → WineSaint academic voice
4. **Determines region:** If blank in Excel, uses Claude to identify region & country
5. **Creates wine document:**
   - Name, vintage, producer
   - Grape varieties
   - Wine type/color (red, white, rosé, etc.)
   - Region reference
6. **Creates review document:**
   - Score (1-10 scale)
   - Short summary
   - Tasting notes (reworded)
   - Flavor profile (4-6 descriptors)
   - Drinking window
   - Review date
   - Reviewer: "WineSaint"

## Excel Column Mapping

| Excel Column | Field | Notes |
|--------------|-------|-------|
| A - Producer | wine.producer | Auto-creates if doesn't exist |
| B - Wine Name | wine.name | Used in title display |
| C - Vintage | wine.vintage | Required |
| D - Score | review.score | Converted to 1-10 scale |
| E - Color/Type | wine.wineType | Red, White, Rosé, etc. |
| F - Release Price | (not imported) | |
| G - Drinking Window | review.drinkingWindow | Parsed as start/end years |
| H - Reviewer | (ignored) | All reviews → "WineSaint" |
| I - Review Date | review.reviewDate | Parsed to ISO format |
| J - Tasting Notes | review.tastingNotes | Reworded in WineSaint voice |
| K - Grape Varieties | wine.grapeVarieties | Comma-separated array |
| L - Region | wine.region | Auto-created; determined by Claude if blank |

## Cost Estimates

**Per wine:** ~$0.0084 (~0.8 cents)

**Full import (5,022 wines):** ~$42

Breakdown:
- Review rewording: ~$0.007 per wine
- Region determination (when blank): ~$0.0013 per wine
- François RAG: Free (local)

## Performance

**Import speed:**
- Default: ~1 wine per second (1000ms delay)
- Faster: ~2 wines per second (500ms delay) - use with caution to avoid rate limits
- Full import time: ~1.5 hours for 5,022 wines at default speed

## Output Example

```
[California #1523] 🍷 Littorai - Chardonnay The Tributary Estate Vineyard (2021)
   Original score: 94/100
   Converted score: 8.0/10
   ✓ François context: 1847 chars
   ✍️  Rewording review...
   ✅ Review reworded
   Summary: Precise Sonoma Coast Chardonnay displaying remarkable tension and refinement.
   🤔 No region in Excel, asking Claude...
   ✓ Determined: Sonoma Coast, USA
   📝 Creating region: sonoma-coast (USA)
   📝 Creating wine document...
   ✅ Wine created: wine_abc123
   📝 Creating review document...
   ✅ Review created: review_xyz789
```

## Troubleshooting

### François RAG not available
- Script continues without François context
- Reviews still generated, just without additional knowledge base

### Duplicate wines
- Script does NOT check for duplicates
- Delete existing wines first if re-importing

### API rate limits
- Increase `--delay` value (e.g., `--delay 2000`)
- Import in smaller batches using `--limit`

### Region determination fails
- Wine will be created without region reference
- Shows "Unknown Region" on frontend
- Can manually add region later in Sanity Studio

## After Import

1. **Check Sanity Studio** - View imported wines and reviews
2. **Visit website** - Browse `/wines` or `/search` to see results
3. **Verify counts** - Script shows success/failed summary at end

## Related Scripts

- `scripts/nuclear-delete-final.ts` - Delete all wines and reviews (use before re-import)
- `scripts/check-recent-reviews.ts` - View recently created reviews

## Archive

Old test scripts are in `scripts/archive/` - do not use these for production.
