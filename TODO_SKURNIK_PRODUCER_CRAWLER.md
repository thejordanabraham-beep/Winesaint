# TODO: Skurnik Producer Crawler

**Status:** On hold - will return to this later
**Priority:** Medium - Enhances producer data for reviews and website

---

## What This Is

Crawl https://www.skurnik.com/our-producers/ to extract detailed producer information and add to both François (RAG) and WEG (Wine Education Guide).

## Why It's Valuable

**For François (RAG) - Review Generation:**
- Producer histories and philosophies enrich AI-generated reviews
- Winemaker names and approaches add authenticity
- Example: "Finca Adalgisa, working with Carmelo Patti since 1916, focuses on balance and terroir..."

**For WEG - Website Producer Pages:**
- Structured producer database for browsing
- Producer detail pages with descriptions
- Filter by region, search by name

## What's Available on Skurnik

**Main Page Structure:**
- ~800-900 producers organized by Country → Region
- Each producer has a detail page link

**Individual Producer Pages Include:**
- Producer name
- Location (country, region, sub-region)
- Description/history
- Founding year
- Winemaker name
- Production volume
- Vineyard acreage
- Grape varieties
- Philosophy/approach

**Example Producer Page:**
https://www.skurnik.com/producer/finca-adalgisa/
- Shows: "Carmelo Patti", "less than 500 cases per year", "Three generations", "1916", etc.

## Technical Implementation

### Time Estimate: 1 to 1.5 hours total

**Phase 1: Get URLs** (~30 seconds)
- Scrape main page for all producer links

**Phase 2: Crawl Individual Pages** (~45-60 minutes)
- Visit each producer page
- Extract structured data
- Rate limit: 1-2 seconds between requests (respectful)

**Phase 3: Add to François** (~5-10 minutes)
- Format as documents for ChromaDB
- Batch insert into RAG system

**Phase 4: Export to WEG** (~2-5 minutes)
- Create structured JSON
- Format similar to grape_guide_complete.json

### Filtering Considerations

- Skip spirits/distilleries (saves ~50-100 entries)
- Can focus on specific countries if desired
- Can exclude regions we don't care about

## Integration Notes

### François (RAG)
- Safe to add while reviews are being generated
- Just adds documents, doesn't rebuild index
- New producer context available for future reviews (not retroactive)

### WEG (Wine Education Guide)
- Location: `/Users/jordanabraham/Desktop/WINESAINT CLAUDE/Wine Saint/Wine_Guide_Project/`
- Add to producer database JSON
- Can power producer browsing on website

## Next Steps When We Return

1. **Decide on filtering:**
   - Which countries/regions to include
   - Whether to skip spirits

2. **Build the crawler script:**
   - URL extraction from main page
   - Individual page scraping
   - Data parsing and structuring

3. **Format for both systems:**
   - François documents (text for RAG)
   - WEG JSON (structured data)

4. **Run crawler:**
   - Can run in background during other tasks
   - Monitor progress
   - Verify data quality

5. **Verify integration:**
   - Check François can retrieve producer data
   - Test WEG JSON structure
   - Spot-check a few producers

## Related Files

- François RAG: `/Users/jordanabraham/wine-rag/`
- WEG location: `/Users/jordanabraham/Desktop/WINESAINT CLAUDE/Wine Saint/Wine_Guide_Project/`
- Current review system: `/Users/jordanabraham/wine-reviews/scripts/wine-saint-unified-system-fixed.ts`

## Additional Context

From conversation on Jan 29, 2026:
- Currently generating reviews (Batch 4 of 500 running)
- Total review goal: ~2,000 reviews
- Skurnik has excellent structured producer data
- Would significantly improve review quality and website content

---

**When ready to implement:** Reference this document and build the crawler script based on the plan above.
