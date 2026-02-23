# WineSaint Review Generation System - Complete Overview

## 📊 SCORING SYSTEMS

### **System 1: Wine Saint Unified (Generous Scoring)**
**File:** `wine-saint-unified-system-fixed.ts`

**Formula:**
```typescript
baseScore = 88 (default if no data)
boost = +2
minScore = 87
maxScore = 100

If criticAvg exists:
  score = criticAvg + 2
Else if vivinoScore exists:
  score = (vivinoScore × 20) + 2
Else:
  score = 88 + 2 = 90

Final = clamp(score, 87, 100)
```

**Output:** 87-100 range (stays on 100-point scale)
**Reviewer Name:** "Wine Saint"
**Style:** Technical precision with casual confidence

---

### **System 2: V2 Weighted Scoring**
**File:** `generate-reviews-v2.ts`

**Formula:**
```typescript
criticAs100 = criticAvg
vivinoAs100 = (vivinoScore × 20) + 10

weighted = (criticAs100 × 0.9) + (vivinoAs100 × 0.1)
final = round(weighted)
```

**Output:** 85-100 range typically (100-point scale)
**Reviewer Name:** "François AI"
**Style:** Academic, concise tasting notes

---

### **System 3: Weighted with Boost (Original)**
**File:** `wine-saint-unified-system.ts` (older version)

**Formula:**
```typescript
critic = criticAvg || 88
vivino = (vivinoScore × 20) || 88

weighted = (critic × 0.85) + (vivino × 0.15)
boosted = weighted + 2
final = max(round(boosted), 87)
```

**Output:** 87-100 range
**Reviewer Name:** "Wine Saint"

---

## 🔄 100-POINT → 10-POINT CONVERSION

**File:** `score-conversion.ts`

```typescript
100 → 9.8-10.0 (avg: 9.9)
99  → 9.5-9.7  (avg: 9.6)
98  → 9.3-9.5  (avg: 9.4)
97  → 9.1-9.3  (avg: 9.2)
96  → 8.5-9.0  (avg: 8.75)
95  → 8.1-8.5  (avg: 8.3)
94  → 8.0-8.0  (avg: 8.0)
93  → 7.7-7.9  (avg: 7.8)
92  → 7.5-7.6  (avg: 7.55)
91  → 7.3-7.4  (avg: 7.35)
90  → 7.1-7.2  (avg: 7.15)
89  → 6.9-7.0  (avg: 6.95)
88  → 6.6-6.8  (avg: 6.7)
87  → 6.4-6.5  (avg: 6.45)
```

**Usage:** Take 100-point score, get midpoint of range
**Note:** This was for displaying scores to users on a 10-point scale (not used in current Sanity schema which uses 50-100)

---

## ✍️ REVIEW TEXT GENERATION SYSTEMS

### **System A: Wine Saint Voice (Unified System)**
**Files:**
- `wine-saint-unified-system-fixed.ts` (recommended - has duplicate checking)
- `wine-saint-unified-system.ts` (older version)

**Process:**
1. Calculate score (see scoring formulas above)
2. Generate review with Claude Sonnet 4.5 using Wine Saint style prompt
3. Create review document in Sanity

**Style Guidelines:**
- Technical precision with casual confidence
- Direct, punchy language (no flowery BS)
- Specific tasting notes (not generic)
- Self-aware wit (no pretension)
- Strong opinions backed by knowledge
- **Avoid mentioning pH in most reviews** (only 1 in 10)
- Focus on texture, tannins, acidity, fruit, terroir

**Output Fields:**
```json
{
  "score": 92,
  "shortSummary": "One sharp, witty sentence (15-20 words)",
  "tastingNotes": "2-3 paragraphs of technical notes",
  "flavorProfile": ["flavor1", "flavor2", ...],
  "drinkThisIf": "You like X but want Y",
  "foodPairings": ["pairing1", "pairing2", ...],
  "drinkingWindowStart": 2025,
  "drinkingWindowEnd": 2040
}
```

**Reviewer:** "Wine Saint"
**isAiGenerated:** `true`

---

### **System B: Academic/Concise (V2)**
**File:** `generate-reviews-v2.ts`

**Two-Pass Generation:**

**Pass 1: Keyword Extraction**
- Extract specific descriptors from reference materials
- Build flavor vocabulary from Flavor Wheel
- Output: Comma-separated keywords

**Pass 2: Review Generation**
- Use keywords from Pass 1
- Select random template (5 templates available)
- Generate prose using few-shot examples
- Apply academic, concise style

**Reference Sources (Waterfall):**
1. K&L Wine Notes (curated notes for specific wines/vintages)
2. François RAG (vector search on wine knowledge base)
3. Flavor Wheel vocabulary

**Output Fields:** Same as System A
**Reviewer:** "François AI"
**isAiGenerated:** `true`

---

### **System C: Original (with K&L Notes)**
**File:** `generate-reviews.ts` (38KB - comprehensive)

**Features:**
- Extensive K&L Wine reference notes database (Opus One, Caymus, Burgundy whites/reds, etc.)
- Napa vintage characteristics (2015-2022)
- Producer style profiles (50+ producers)
- Region/appellation context
- Detailed scoring conversion tables

**K&L Notes Include:**
- Opus One (vintages 2000-2019)
- Caymus Special Selection
- Caymus Napa Cabernet
- Cain Five
- Burgundy producers (Dauvissat, Roulot, Lafon, Méo-Camuzet, etc.)
- Many others

**Process:**
1. Check if wine/producer/vintage has K&L reference notes
2. Use notes as inspiration for original review
3. Generate with Claude API
4. Score using conversion tables

---

## 🔍 FRANÇOIS RAG INTEGRATION

**All systems can query François RAG:**

**Endpoint:** `http://localhost:8000/search`

**Request:**
```json
{
  "query": "Producer Wine Name Vintage Region tasting notes",
  "n_results": 10,
  "rerank": true
}
```

**Used by:**
- `generate-reviews-v2.ts` (primary)
- `generate-5-random-reviews.ts`
- `reference-sources.ts` (library function)

**Purpose:** Fetch contextual tasting notes from François knowledge base to inform review generation

---

## 🎯 RECOMMENDED SCRIPTS FOR EXCEL IMPORT

### **Option 1: Wine Saint Style (Simple & Reliable)**
**Script:** `wine-saint-unified-system-fixed.ts`

**Pros:**
- ✅ Simple, proven system
- ✅ Has duplicate checking
- ✅ Consistent Wine Saint voice
- ✅ Single-pass generation (faster)

**Scoring:** criticAvg + 2 boost → 87-100 range
**Style:** Technical + witty

**Usage:**
```bash
npx tsx scripts/wine-saint-unified-system-fixed.ts <wine-id>
```

---

### **Option 2: Academic Style (More Sophisticated)**
**Script:** `generate-reviews-v2.ts`

**Pros:**
- ✅ Two-pass generation (more precise)
- ✅ Uses François RAG extensively
- ✅ Template variation (5 different styles)
- ✅ Flavor Wheel vocabulary
- ✅ Few-shot learning

**Scoring:** Weighted (90% critic, 10% vivino)
**Style:** Academic, concise

**Usage:**
```bash
npx tsx scripts/generate-reviews-v2.ts --limit 10 [--dry-run]
```

---

## 📋 UTILITY SCRIPTS

**Checking/Analysis:**
- `check-review.ts` - Check single review
- `check-recent-reviews.ts` - List recent reviews
- `count-reviews.ts` - Count total reviews
- `diagnose-reviews.ts` - Diagnostic info

**Maintenance:**
- `delete-all-reviews.ts` - Delete all reviews
- `delete-duplicate-reviews.ts` - Remove duplicates
- `fix-duplicate-reviews.ts` - Fix duplicate issues
- `link-reviews-to-wines.ts` - Re-link orphaned reviews

**Testing:**
- `test-kl-conversion.ts` - Test score conversion
- `generate-test-review.ts` - Generate single test review
- `generate-5-random-reviews.ts` - Generate 5 random reviews

---

## 🆕 FOR YOUR EXCEL IMPORT

You need to decide:

### **1. Which Scoring System?**

**A) Use Excel scores as-is** (already 50-100 scale from Vinous/Wine Advocate)
- Just import the professional scores directly
- No conversion needed

**B) Apply Wine Saint boost** (Excel score + 2)
- Makes scores slightly more generous
- Matches Wine Saint philosophy

**C) Ignore Excel, calculate fresh** (use criticAvg/Vivino from somewhere else)
- Only if you have other data sources

### **2. Which Review Generation Style?**

**A) Wine Saint Voice** (`wine-saint-unified-system-fixed.ts`)
- Technical + witty
- Reviewer: "Wine Saint"

**B) Academic Style** (`generate-reviews-v2.ts`)
- Concise + precise
- Reviewer: "François AI"

**C) Keep Excel reviews as-is**
- Use original reviewer names (Antonio Galloni, Anne Krebiehl MW, etc.)
- Don't generate new text, import as written

### **3. Which Reviewer Attribution?**

- "Wine Saint" (AI-generated in Wine Saint voice)
- "François AI" (AI-generated academic style)
- Original reviewer (from Excel: "Antonio Galloni", "Anne Krebiehl MW", etc.)
- Hybrid: Import original review + generate Wine Saint commentary as second review

---

## ❓ NEXT STEPS

1. **Tell me which scoring approach you want**
2. **Tell me which review style you want**
3. **Tell me which reviewer attribution you want**

Then I'll build the test import script with:
- 10 random wines from Austria
- 10 random wines from California
- 10 random wines from Italy
- Using your chosen system

---

## 📊 SUMMARY TABLE

| Script | Scoring | Review Style | Reviewer | Uses François? |
|--------|---------|--------------|----------|----------------|
| wine-saint-unified-system-fixed.ts | critic + 2 | Wine Saint (witty) | Wine Saint | Optional |
| generate-reviews-v2.ts | 90% critic + 10% vivino | Academic | François AI | Yes |
| generate-reviews.ts | Weighted + K&L | Detailed | François AI | No (uses K&L) |

**Current Sanity Schema:** 50-100 scale (not 10-point)
**Excel Scores:** 50-100 scale already ✅
