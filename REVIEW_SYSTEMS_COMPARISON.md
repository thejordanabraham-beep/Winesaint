# Wine Review Systems Comparison

## Overview

Three different AI review systems have been used to generate wine reviews:

1. **Vitaly Vochenko** (602 reviews) - v1 system
2. **Wine Saint** (556 reviews) - v2 system
3. **François AI** (20 reviews) - v3 system (new)

---

## 1️⃣ VITALY VOCHENKO SYSTEM (v1)

### Data Sources
```
┌─────────────────────────────────────────────┐
│         VITALY VOCHENKO PIPELINE            │
└─────────────────────────────────────────────┘

INPUT DATA:
├── Wine metadata from Sanity
│   ├── Name, vintage, producer
│   ├── Region, grape varieties
│   ├── Price USD
│   ├── Critic Average score
│   └── Vivino score

REFERENCE SOURCES (in order):
├── 1. K&L Wine Merchants notes (hardcoded)
│   └── ~50 wines with vintage-specific notes
│
└── 2. Wine.com web scraping
    └── Live fetch of product pages
    └── Extract tasting notes from HTML

GENERATION:
├── Single-pass Claude API call
├── Model: claude-sonnet-4-5-20250929
└── Direct prose generation
```

### Scoring System
```javascript
// WEIGHTED SCORING
criticAvg * 0.9 + vivinoScore * 0.1

// Vivino conversion (5-point to 100-point)
vivinoScore * 20 + 10
// Example: 4.5 → 95 points

// Final: Round to nearest integer
```

### Style Characteristics
- **Tone**: Punchy, modern, editorial
- **Length**: Concise
- **Format**: Direct prose, no fluff
- **Example**: "Silverado delivers serious Napa Cab without the flash or fury. Dark cassis meets cedar shavings."

### Technical Details
- **Script**: `scripts/generate-reviews.ts`
- **Reviewer Name**: "Vitaly Vochenko"
- **Created**: ~January 15, 2026
- **Total Reviews**: 602

---

## 2️⃣ WINE SAINT SYSTEM (v2)

### Data Sources
```
┌─────────────────────────────────────────────┐
│           WINE SAINT PIPELINE               │
└─────────────────────────────────────────────┘

INPUT DATA:
├── Same as v1 (Sanity metadata)
│   ├── Name, vintage, producer
│   ├── Region, grape varieties
│   ├── Price USD
│   ├── Critic Average + Vivino score
│   └── Same weighted scoring

REFERENCE SOURCES (improved):
├── 1. K&L Wine Merchants notes
│
├── 2. François RAG system
│   └── Query: producer + region + wine keywords
│   └── Returns: vintage charts, vineyard data
│
└── 3. Flavor Wheel vocabulary
    └── Pre-built flavor palettes by category

GENERATION (two-pass):
├── PASS 1: Keyword extraction
│   └── Claude extracts specific descriptors
│
├── PASS 2: Review generation
│   └── 5 random templates
│   └── Few-shot examples
│   └── Write prose using extracted keywords
```

### Scoring System
```javascript
// IDENTICAL TO V1
criticAvg * 0.9 + vivinoScore * 0.1
```

### Style Characteristics
- **Tone**: Technical, academic, vintage-focused
- **Length**: Medium
- **Format**: Structured with vintage context
- **Example**: "The 2018 vintage's cool spring preserved the delicate aromatics typical of Trousseau, while the warm summer allowed for complete flavor development..."

### Technical Details
- **Script**: `scripts/generate-reviews-v2.ts`
- **Reviewer Name**: "Wine Saint"
- **Created**: ~January 22, 2026
- **Total Reviews**: 556
- **Improvements over v1**:
  - Two-pass generation (keywords → prose)
  - François RAG integration
  - Template variation (5 options)
  - Few-shot learning examples

---

## 3️⃣ FRANÇOIS AI SYSTEM (v3)

### Data Sources
```
┌─────────────────────────────────────────────┐
│           FRANÇOIS AI PIPELINE              │
└─────────────────────────────────────────────┘

INPUT DATA:
├── Wine metadata from Sanity
│   ├── Name, vintage, producer
│   ├── Region, country
│   ├── Vineyard/Climat (if exists)
│   └── NO pre-existing scores

REFERENCE SOURCES:
└── François RAG API (primary)
    ├── Endpoint: http://localhost:8000/search
    ├── Query: producer + wine + vintage + region + vineyard
    ├── n_results: 10
    ├── rerank: true
    └── Returns: Up to 5000 chars of context

    RAG DATABASE CONTAINS:
    ├── K&L Wine Merchants notes
    ├── Vineyard profiles (113 vineyards)
    ├── Vintage charts (78 PDFs, 2,739 docs)
    │   ├── France regions
    │   ├── Italy regions
    │   ├── Germany/Austria
    │   ├── Spain/Portugal
    │   └── US/Australia/NZ
    └── Training materials

GENERATION:
├── Single-pass Claude API call
├── Model: claude-sonnet-4-5-20250929
├── Comprehensive structured output
└── JSON format response
```

### Scoring System
```javascript
// INDEPENDENT SCORING
// No weighted calculation
// Claude generates score based on:
// - Quality indicators from RAG context
// - Vintage reputation
// - Producer prestige
// - Regional characteristics

// Scale: 85-100
// - 95-100: Extraordinary
// - 90-94: Outstanding
// - 85-89: Very good
```

### Style Characteristics
- **Tone**: Professional wine critic, balanced
- **Length**: Comprehensive
- **Format**: Structured JSON with 7 components:
  1. Score (85-100)
  2. Short summary (1-2 sentences)
  3. Tasting notes (3-4 sentences)
  4. Flavor profile (5-8 specific flavors)
  5. "Drink this if" (1 sentence)
  6. Food pairings (3-5 dishes)
  7. Drinking window (start year - end year)

### Technical Details
- **Scripts**:
  - `scripts/generate-test-review.ts`
  - `scripts/generate-5-random-reviews.ts`
  - `scripts/generate-5-random-red-reviews.ts`
  - `scripts/generate-5-jura-reviews.ts`
- **Reviewer Name**: "François AI"
- **Created**: January 27, 2026 (today)
- **Total Reviews**: 20 (testing phase)

---

## KEY DIFFERENCES

### Data Sources

| System | K&L Notes | Wine.com | François RAG | Flavor Wheel | Vintage Charts |
|--------|-----------|----------|--------------|--------------|----------------|
| Vitaly | ✅ | ✅ | ❌ | ❌ | ❌ |
| Wine Saint | ✅ | ❌ | ✅ | ✅ | ❌ (RAG not populated) |
| François AI | ❌ | ❌ | ✅ | ❌ | ✅ (2,739 docs) |

### Scoring Method

| System | Method | Input Sources |
|--------|--------|---------------|
| Vitaly | Weighted calculation | Critic Avg (90%) + Vivino (10%) |
| Wine Saint | Weighted calculation | Critic Avg (90%) + Vivino (10%) |
| François AI | **AI-generated** | RAG context + wine characteristics |

### Generation Approach

| System | Method | Passes | Templates |
|--------|--------|--------|-----------|
| Vitaly | Direct generation | 1 | None |
| Wine Saint | Keyword extraction → prose | 2 | 5 random |
| François AI | Structured JSON output | 1 | None |

### Review Components

| Component | Vitaly | Wine Saint | François AI |
|-----------|--------|------------|-------------|
| Score | ✅ | ✅ | ✅ |
| Short summary | ❌ | ✅ | ✅ |
| Tasting notes | ✅ | ✅ | ✅ |
| Flavor profile | ❌ | ❌ | ✅ (5-8 items) |
| Drink this if | ❌ | ❌ | ✅ |
| Food pairings | ❌ | ❌ | ✅ (3-5 dishes) |
| Drinking window | ❌ | ❌ | ✅ (year range) |

---

## FRANÇOIS RAG DATABASE

The François AI system has the most comprehensive knowledge base:

```
TOTAL DOCUMENTS: 2,739

CONTENT BREAKDOWN:
├── Vintage Charts: 78 PDFs
│   ├── France: Burgundy, Bordeaux, Rhône, Loire, Champagne, etc.
│   ├── Italy: Barolo, Barbaresco, Tuscany, Piedmont, etc.
│   ├── Germany/Austria: Mosel, Rheingau, Wachau, etc.
│   ├── Spain/Portugal: Rioja, Priorat, Port, etc.
│   └── New World: Napa, Sonoma, Australia, NZ, etc.
│
├── Vineyard Profiles: 113 vineyards
│   ├── Location, soil, elevation
│   ├── Grape varieties
│   ├── Notable producers
│   └── Significance
│
└── K&L Wine Merchants Notes
    └── Imported from training materials
```

### RAG Query Example
```javascript
// Query for 2007 Rousseau Gevrey-Chambertin
Query: "Domaine Armand Rousseau Gevrey-Chambertin 2007 Burgundy Chambertin tasting notes review vintage"

// RAG searches 2,739 documents and returns:
// - Vintage chart for Burgundy 2007
// - Chambertin vineyard profile
// - Rousseau producer information
// - Regional characteristics
// - Historical context
```

---

## RECOMMENDATIONS

### For Consistency
- **Standardize on François AI system** (v3)
  - Most comprehensive knowledge base
  - Best structured output
  - Independent scoring (not dependent on external scores)
  - Includes food pairings, drinking windows, etc.

### For Existing Reviews
Three options:

1. **Keep as-is**: Maintain reviewer diversity
   - Vitaly = editorial style
   - Wine Saint = academic/technical
   - François = comprehensive professional

2. **Re-generate all with François AI**
   - Consistent format across all wines
   - Leverages full RAG database
   - ~1,158 wines would need regeneration

3. **Hybrid approach**
   - Keep existing reviews
   - Use François AI for all new wines
   - Gradually replace old reviews on request

### For Production
If generating reviews at scale (thousands of wines):

```javascript
// Recommended: François AI system with batch processing
// - Query François RAG once per wine
// - Generate comprehensive review
// - Store all 7 components
// - Rate limit: 2-3 seconds between reviews
// - Cost: ~$0.01-0.02 per review (Claude API)
```

---

## FILES REFERENCE

### Scripts
- `scripts/generate-reviews.ts` - Vitaly system
- `scripts/generate-reviews-v2.ts` - Wine Saint system
- `scripts/generate-test-review.ts` - François test
- `scripts/generate-5-random-reviews.ts` - François batch
- `scripts/generate-5-random-red-reviews.ts` - François batch (filtered)
- `scripts/generate-5-jura-reviews.ts` - François batch (filtered)

### Libraries (Wine Saint only)
- `scripts/lib/reference-sources.ts` - François RAG queries
- `scripts/lib/flavor-descriptors.ts` - Flavor wheel vocabulary
- `scripts/lib/prompt-templates.ts` - Template variations
- `scripts/lib/few-shot-examples.ts` - Example reviews for training

### Data Ingestion
- `/Users/jordanabraham/wine-rag/ingest_vineyards.py` - Vineyard data
- `/Users/jordanabraham/wine-rag/ingest_vintage_charts.py` - Vintage PDFs
- `/Users/jordanabraham/wine-rag/ingest_additional_vintage_charts.py` - Additional PDFs
