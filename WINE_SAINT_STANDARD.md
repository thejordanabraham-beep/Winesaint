# WINE SAINT REVIEW SYSTEM - STANDARDIZATION

**Version:** 1.1
**Effective Date:** January 27, 2026
**Status:** ✅ ACTIVE - PERMANENT DEFAULT SYSTEM

---

## 🎯 THIS IS THE OFFICIAL REVIEW SYSTEM

**wine-saint-unified-system.ts** is the **PERMANENT, DEFAULT** review generation system for all wines.

- ✅ Use this for ALL review generation (single wines, batches, bulk operations)
- ✅ Import functions from this script - do NOT create new review generators
- ✅ This supersedes ALL previous systems (Vitaly, François AI, old Wine Saint)
- ❌ Do NOT use old scripts: generate-5-random-reviews.ts, generate-5-jura-reviews.ts, etc.
- ❌ Do NOT create new review generation logic - extend this system instead

---

## 🎯 STANDARD CONFIGURATION

### Reviewer Name
**ALWAYS USE:** `"Wine Saint"`

- ✅ All reviews must use exactly "Wine Saint" as reviewerName
- ❌ No other reviewer names (François AI, Vitaly Vochenko, Claude, etc.)
- 📝 All existing reviews have been migrated to "Wine Saint"

### Review Date Display
**FRONTEND:** Do not display `reviewDate` to users

- Review dates are stored in database for tracking
- Not shown on wine detail pages
- Not shown in search results
- Internal use only

---

## 📊 SCORING SYSTEM

### Formula (Generous)
```javascript
// Base calculation
const weighted = (criticAvg * 0.85) + (vivinoTo100(vivinoScore) * 0.15);

// Add boost
const boosted = weighted + 2;

// Apply floor
const final = Math.max(boosted, 87);

// Result: All wines score 87-100
```

### Vivino Conversion
```javascript
function vivinoTo100(vivinoScore: number): number {
  return Math.round(vivinoScore * 20 + 10);
}
// Example: 4.5 → 95 points
```

### Weights
- **Critic Average:** 85% (increased from 90%)
- **Vivino Score:** 15% (increased from 10%)
- **Boost:** +2 points added to all scores
- **Floor:** Minimum 87 points

### No External Scores?
- If wine has NO criticAvg or vivinoScore: **Default to 90**
- System can generate reviews for ALL wines

---

## ✍️ WRITING STYLE

### Wine Saint Voice
**Academic, Technical, Natural**

#### Core Principles:
1. **Technical precision**
   - Use specific wine terminology (structure, tannins, acidity, minerality, texture)
   - Vary technical details - don't default to the same metrics every time
   - **pH**: Mention occasionally for variety (roughly 30-40% of reviews), not in every review
   - Rotate through different technical details: tannin structure, soil types, texture, concentration
   - Reference terroir (soil types, elevation, aspect)
   - Discuss tannin structure, mouthfeel, concentration, balance

2. **Vintage context - weave naturally**
   - Include when vintage meaningfully shaped the wine
   - Vary placement: sometimes open, sometimes mid-paragraph, sometimes end
   - Sometimes focus on terroir/character instead
   - Not every review needs vintage discussion

3. **Educational tone**
   - Factual and analytical
   - No marketing speak or flowery language
   - No clichés ("masterpiece", "showcasing", "ability to craft")

4. **Natural variation**
   - Don't follow rigid templates
   - Sound like a knowledgeable critic writing naturally
   - Vary sentence structure and focus

#### Examples (Correct Style):

**Vintage woven mid-paragraph:**
```
✅ "Medium-bodied with silky tannins and bright acidity, showing red cherry,
violet, and sage on the palate. The cool spring of 2018 preserved the delicate
aromatics typical of Trousseau, while the warm summer allowed complete flavor
development without overripeness."
```

**Vintage as explanation:**
```
✅ "Pronounced chalky minerality dominates this premier cru, characteristic
of Chassagne's limestone terroir. The wine's laser-like acidity and tension
reflect the small yields from 2021's spring frost challenges."
```

**Focus on terroir, minimal vintage:**
```
✅ "Exhibits profound chalky minerality from Le Mesnil's Campanian chalk
subsoils, with saline notes and citrus pith. The magnum format has preserved
remarkable freshness over two decades."
```

**Vintage opening (when truly notable):**
```
✅ "The 2009 vintage in Tokaj produced ideal conditions for botrytis, with
warm autumn days and humid mornings yielding Aszú berries of exceptional
concentration. This Eszencia exhibits profound acidity that counterbalances
extreme sweetness, creating electric tension."
```

#### Anti-Patterns (Wrong Style):
```
❌ "Absolutely stunning! A masterpiece showcasing the winemaker's
ability to craft elegant wines with power and finesse."
(Marketing speak, flowery, clichés)

❌ "The 2020 vintage in Burgundy was..." [every review opening identically]
(Robotic template, lacks natural variation)
```

### Length
- **Tasting Notes:** 2-3 sentences maximum
- **Short Summary:** 1 sentence
- **Total:** Concise and academic

---

## 🔍 REFERENCE SOURCES

### Priority Order
1. **K&L Wine Merchants Notes** (hardcoded in system)
   - Use if available for wine/vintage
   - Reword completely, never copy

2. **François RAG API** (primary knowledge base)
   - Vintage charts (78 PDFs, 2,739 documents)
   - Vineyard profiles (113 vineyards)
   - Producer information
   - Regional characteristics

3. **Wine.com** (optional, if needed)
   - Web scraping as fallback
   - Extract product tasting notes

4. **Pure AI Generation** (if no references)
   - Still use Wine Saint style
   - Focus on vintage/region knowledge

### François RAG Contents
```
Total: 2,739 documents

Vintage Charts:
├── France (Burgundy, Bordeaux, Rhône, Loire, Champagne, etc.)
├── Italy (Barolo, Barbaresco, Tuscany, Piedmont, etc.)
├── Germany/Austria (Mosel, Rheingau, Wachau, etc.)
├── Spain/Portugal (Rioja, Priorat, Port, etc.)
└── New World (Napa, Sonoma, Australia, NZ, etc.)

Vineyard Profiles:
├── 113 vineyards with detailed information
├── Soil types, elevation, aspect
├── Notable producers
└── Historical significance

K&L Notes:
└── Curated tasting notes from training materials
```

---

## 🏗️ GENERATION PROCESS

### Method
**Two-Pass Wine Saint Style** (if time permits)

#### Pass 1: Context Extraction
- Query François RAG
- Extract vintage information
- Identify key descriptors
- Build flavor vocabulary

#### Pass 2: Review Generation
- Write in Wine Saint academic style
- Weave vintage/terroir context naturally
- Use technical language and precise terminology
- Keep concise (2-3 sentences)
- Vary approach - don't follow rigid template

### Single-Pass Alternative
If two-pass is too slow, use single-pass but maintain:
- Wine Saint style prompt
- Natural vintage/terroir integration (varied placement)
- Technical descriptors
- Academic tone with variation

---

## 📝 REVIEW COMPONENTS

### Required Fields
```typescript
{
  score: number;                    // 87-100
  shortSummary: string;             // 1 sentence
  tastingNotes: string;             // 2-3 sentences, vintage-focused
  flavorProfile: string[];          // 5-8 items
  drinkThisIf: string;              // 1 sentence
  foodPairings: string[];           // 3-5 dishes
  drinkingWindowStart: number;      // Year
  drinkingWindowEnd: number;        // Year
  reviewerName: 'Wine Saint';       // ALWAYS "Wine Saint"
  reviewDate: string;               // ISO 8601 (not displayed)
  isAiGenerated: true;              // Always true
}
```

### Storage
- Save to Sanity `review` document type
- Link to wine via reference: `wine: { _type: 'reference', _ref: wineId }`
- All fields required except optional frontend elements

---

## 🔧 IMPLEMENTATION

### Primary Script (PERMANENT DEFAULT)
**File:** `scripts/wine-saint-unified-system.ts`

This is the **OFFICIAL, PERMANENT** Wine Saint review generator.

**CRITICAL:** This is the ONLY review generation system to use going forward.

### Usage

**Single Wine:**
```bash
npx tsx scripts/wine-saint-unified-system.ts <wine-id>
```

**Batch Processing:**
Create new scripts that import from this system:
```typescript
import { calculateScore, generateWineSaintReview, generateReview } from './wine-saint-unified-system';

// Example: Generate reviews for all wines without reviews
const wines = await client.fetch(`*[_type == 'wine' && !defined(*[_type == 'review' && wine._ref == ^._id][0]._id)]`);

for (const wine of wines) {
  await generateReview(wine._id);
}
```

### Exported Functions
```typescript
// Calculate score using generous formula (87-100 range)
calculateScore(criticAvg?: number, vivinoScore?: number): number

// Generate complete Wine Saint review (returns review data)
generateWineSaintReview(wine: any, score: number): Promise<any>

// Generate and save review to Sanity (full pipeline)
generateReview(wineId: string): Promise<any>
```

### ⚠️ Deprecated Scripts
**DO NOT USE:**
- `generate-5-random-reviews.ts` (old François AI system)
- `generate-5-jura-reviews.ts` (old system)
- `generate-5-random-red-reviews.ts` (old system)

These scripts use outdated review generation logic. Use `wine-saint-unified-system.ts` instead.

---

## 📋 CHECKLIST FOR NEW SCRIPTS

When creating new review generation scripts:

- [ ] Import from `wine-saint-unified-system.ts`
- [ ] Use `calculateScore()` function (do not reimplement)
- [ ] Use `generateWineSaintReview()` or follow Wine Saint style
- [ ] Set `reviewerName: 'Wine Saint'` (NEVER another name)
- [ ] Generate `reviewDate` but understand it's not displayed
- [ ] Set `isAiGenerated: true`
- [ ] Query François RAG when available
- [ ] Try K&L notes first if wine matches
- [ ] Maintain academic, technical tone with natural variation
- [ ] Keep tasting notes to 2-3 sentences
- [ ] Weave vintage/terroir context naturally (not as rigid template)

---

## 🚫 ANTI-PATTERNS

### DO NOT:
- ❌ Use any reviewer name except "Wine Saint"
- ❌ Use flowery marketing language
- ❌ Write long reviews (keep to 2-3 sentences)
- ❌ Follow rigid templates (every review starting identically)
- ❌ Use clichés ("masterpiece", "showcasing", "ability to craft")
- ❌ Copy-paste reference notes verbatim
- ❌ Create reviews without checking François RAG first
- ❌ Use old scoring formulas (must use generous scoring)
- ❌ Display review dates on frontend
- ❌ Score below 87 (floor enforced)

### DO:
- ✅ Always use "Wine Saint" as reviewer
- ✅ Weave vintage/terroir context naturally (vary placement and approach)
- ✅ Use technical, academic tone with precise terminology
- ✅ Keep reviews concise but natural-sounding
- ✅ Query François RAG for context
- ✅ Check K&L notes for reference
- ✅ Use generous scoring (+2 boost, 87 floor)
- ✅ Focus on vintage conditions and their impact
- ✅ Use precise wine terminology
- ✅ Be educational, not promotional

---

## 📊 MIGRATION STATUS

### Completed ✅
- All 1,179 reviews standardized to "Wine Saint"
- Review date display removed from frontend
- Unified scoring system documented
- François RAG database populated (2,739 docs)
- Primary script created (`wine-saint-unified-system.ts`)

### Statistics
- **Vitaly Vochenko:** 602 reviews → migrated to Wine Saint
- **François AI:** 20 reviews → migrated to Wine Saint
- **Claude Sonnet 4.5:** 1 review → migrated to Wine Saint
- **Wine Saint:** 556 reviews → unchanged
- **Total:** 1,179 reviews, all now "Wine Saint"

---

## 🔄 VERSION HISTORY

### v1.1 (January 27, 2026) - CURRENT
- **Made wine-saint-unified-system.ts the PERMANENT DEFAULT**
- Removed rigid "must start with vintage" template requirement
- Added natural variation to writing style (vary opening, placement, focus)
- Updated prompts to weave vintage/terroir context naturally
- Created batch generation script (generate-reviews-batch.ts)
- Added npm scripts: `npm run review` and `npm run review:batch`
- Created REVIEW_SYSTEM_README.md for quick reference
- Deprecated old review generation scripts

### v1.0 (January 27, 2026)
- Initial standardization
- Unified all reviews under "Wine Saint"
- Implemented generous scoring (+2 boost, 87 floor)
- Created canonical unified system script
- Removed review date display from frontend
- Documented Wine Saint style requirements

---

## 📞 SUPPORT

If you need to modify the review system:
1. Read this document first
2. Update `wine-saint-unified-system.ts` if changing scoring/style
3. Update this document if changing standards
4. Test with small batch before running at scale
5. Always use "Wine Saint" reviewer name

---

**Last Updated:** January 27, 2026 (v1.1)
**Status:** Permanent Default Review System
**Maintainer:** WineSaint Development Team
