# Phase 2: Pattern Recognition - Teaching François to Recognize Climats

## ✅ What We've Built

Phase 2 creates a **pattern recognition system** that allows François to automatically identify and categorize Burgundy climats from wine names.

### Tools Created:

1. **Wine Name Parser** (`scripts/parse-burgundy-wine.ts`)
   - Extracts vintage, producer, village, climat, and classification
   - Matches against Sanity climat database
   - Returns confidence scores

2. **Training Dataset** (`data/burgundy-training-examples.json`)
   - 25+ real Burgundy wine examples
   - Shows input → expected output mappings
   - Covers Grand Cru, Premier Cru, monopoles, etc.

3. **Auto-Categorization Script** (`scripts/auto-categorize-wines.ts`)
   - Scans existing wines in Sanity
   - Automatically links them to climats
   - Dry-run mode to preview changes

---

## 🎯 How It Works

### The Pattern Recognition Flow:

```
Wine Name Input
    ↓
"2020 Domaine Leroy Chambolle-Musigny Les Amoureuses Premier Cru"
    ↓
[PARSER EXTRACTS]
    ↓
Vintage: 2020
Producer: Domaine Leroy
Village: Chambolle-Musigny
Climat: Les Amoureuses
Classification: Premier Cru
    ↓
[MATCH AGAINST SANITY DATABASE]
    ↓
Found: Les Amoureuses (climat_id: abc123)
Confidence: High
    ↓
[AUTO-LINK WINE → CLIMAT]
```

---

## 🚀 Using the Tools

### 1. Test the Parser

See how well the parser extracts information from wine names:

```bash
npm run test-parser
```

**What it does:**
- Tests 7 sample Burgundy wines
- Shows what the parser extracts
- Displays confidence levels
- Shows which climats it matches

### 2. Auto-Categorize Existing Wines

**Preview Mode (Dry Run):**
```bash
npm run auto-categorize
```

This shows what *would* be updated without making changes.

**Apply Changes:**
```bash
npm run auto-categorize:apply
```

This actually updates your wines in Sanity.

**What it does:**
- Scans all wines without climats
- Matches wine names to imported climats
- Links wines to climats automatically
- Shows confidence scores (high/medium/low)

---

## 📚 Training François with Examples

The training dataset (`burgundy-training-examples.json`) teaches François the patterns.

### Example Training Entry:

```json
{
  "input": "2020 Domaine Leroy Chambolle-Musigny Les Amoureuses Premier Cru",
  "expected": {
    "vintage": 2020,
    "producer": "Domaine Leroy",
    "appellation": "Chambolle-Musigny",
    "climat": "Les Amoureuses",
    "classification": "premier_cru"
  }
}
```

### How to Use Training Data:

#### Option A: Feed to wine-rag (François Backend)

1. Create a training document:
```bash
cd ~/wine-rag
```

2. Ingest the training examples:
```python
# In wine-rag/src/batch_ingest.py
# Add training examples as documents
# François will learn the pattern: wine name → structured data
```

#### Option B: Use with Claude API Directly

```typescript
// In your wine import script
import examples from './data/burgundy-training-examples.json';

const prompt = `
Learn to extract wine components from Burgundy wine names.

Examples:
${examples.map(ex => `
Input: ${ex.input}
Output: ${JSON.stringify(ex.expected)}
`).join('\n')}

Now extract from this wine:
"${newWineName}"
`;

// Send to Claude API
const result = await anthropic.messages.create({
  model: "claude-sonnet-4-5",
  messages: [{ role: "user", content: prompt }]
});
```

---

## 🎓 Pattern Recognition Rules

François learns these patterns from the training data:

### 1. **Vintage Extraction**
- 4-digit year at start: `2020` → vintage: 2020
- Usually first element in wine name

### 2. **Producer Extraction**
- After vintage, before village
- Strip prefixes: "Domaine", "Domaine de", "Château"
- Example: "Domaine Leroy" → producer: "Domaine Leroy"

### 3. **Village/Appellation Extraction**
- Known Burgundy villages (Vosne-Romanée, Chambolle-Musigny, etc.)
- Usually appears after producer
- Example: "Chambolle-Musigny" → appellation: "Chambolle-Musigny"

### 4. **Climat Extraction**
- After village, before classification markers
- Match against known climats in database
- Example: "Les Amoureuses" → climat: "Les Amoureuses"

### 5. **Classification Detection**
- Keywords: "Grand Cru", "Premier Cru", "1er Cru"
- Maps to: grand_cru, premier_cru
- Example: "Grand Cru" → classification: "grand_cru"

---

## 🧪 Testing Pattern Recognition

### Test Cases Included:

✅ **Grand Crus:**
- Romanée-Conti
- La Tâche
- Montrachet
- Chambertin
- Clos de Vougeot
- Bonnes-Mares
- Corton

✅ **Premier Crus:**
- Les Amoureuses (Chambolle-Musigny)
- Clos Saint-Jacques (Gevrey-Chambertin)
- Les Perrières (Meursault)

✅ **Edge Cases:**
- Monopoles (DRC wines)
- Vieilles Vignes designations
- Complex producer names (Comte Liger-Belair)
- Hyphenated names (Pierre-Yves Colin-Morey)

---

## 📊 Confidence Scoring

The system assigns confidence levels:

### 🟢 High Confidence
- Exact climat name match in wine name
- Village/appellation match
- Classification markers present
- Climat exists in Sanity database

**Example:**
```
Wine: "2020 Domaine Leroy Chambolle-Musigny Les Amoureuses Premier Cru"
Match: Les Amoureuses (Chambolle-Musigny, Premier Cru)
Confidence: HIGH ✅
```

### 🟡 Medium Confidence
- Partial climat name match (without "Les"/"La"/"Le")
- Village match but no explicit climat markers
- Classification implied but not stated

**Example:**
```
Wine: "2020 Domaine Ramonet Montrachet"
Match: Montrachet (Grand Cru)
Confidence: MEDIUM ⚠️
```

### 🟠 Low Confidence
- Ambiguous wine name
- Multiple possible matches
- No clear village/climat separation

**Example:**
```
Wine: "2020 Burgundy Red Wine"
Match: (none)
Confidence: LOW ❌
```

---

## 🔄 Integration with François (wine-rag)

### Step 1: Export Training Data to François

```bash
# Copy training examples to wine-rag
cp data/burgundy-training-examples.json ~/wine-rag/data/
```

### Step 2: Create Ingest Script in wine-rag

```python
# ~/wine-rag/scripts/ingest_wine_patterns.py

import json
from src.batch_ingest import ingest_document

with open('data/burgundy-training-examples.json') as f:
    examples = json.load(f)

for example in examples:
    # Create training document
    text = f"""
Wine Name Pattern Training Example:

Input: {example['input']}

Expected Extraction:
- Vintage: {example['expected'].get('vintage')}
- Producer: {example['expected'].get('producer')}
- Appellation: {example['expected'].get('appellation')}
- Climat: {example['expected'].get('climat')}
- Classification: {example['expected'].get('classification')}
"""

    # Ingest into ChromaDB
    ingest_document(
        text=text,
        metadata={
            'type': 'wine_pattern_training',
            'source': 'burgundy_climats'
        }
    )
```

### Step 3: Query François with New Wines

Once trained, François can extract wine info:

```python
# Query François
response = rag_query(
    "Extract components from: 2020 Domaine Dujac Clos de la Roche Grand Cru",
    context_type="wine_pattern_training"
)

# François returns:
# {
#   "vintage": 2020,
#   "producer": "Domaine Dujac",
#   "appellation": "Morey-Saint-Denis",
#   "climat": "Clos de la Roche",
#   "classification": "grand_cru"
# }
```

---

## 📈 Expanding Beyond Burgundy

Once Burgundy patterns work, extend to other regions:

### Germany (VDP Classification)
- Pattern: "2021 Weingut Clemens Busch Marienburg Fahrlay Riesling GG"
- Extract: vineyard (Marienburg), parcel (Fahrlay), classification (GG)

### Barolo (MGA System)
- Pattern: "2018 Giuseppe Mascarello Barolo Monprivato"
- Extract: producer, region (Barolo), MGA (Monprivato)

### California (AVA + Vineyard)
- Pattern: "2019 Schrader Cellars Beckstoffer To Kalon Cabernet Sauvignon"
- Extract: producer, vineyard (To Kalon), grape

---

## ✅ Phase 2 Complete Checklist

- [x] Wine name parser built
- [x] Training dataset created (25+ examples)
- [x] Auto-categorization script ready
- [x] Test commands added to package.json
- [x] Documentation created
- [ ] Test with your real wines in Sanity
- [ ] Feed training data to François
- [ ] Validate François can extract patterns

---

## 🎯 Next Steps

**Immediate:**
1. Run `npm run auto-categorize` to see matches for your existing wines
2. Review the confidence scores
3. Run `npm run auto-categorize:apply` to link wines to climats

**Short-term:**
1. Add more training examples (target: 100+)
2. Improve parser for edge cases
3. Feed training data to François (wine-rag)

**Long-term (Phase 3):**
1. Expand to other regions (Germany, Italy, California)
2. Build automated wine ingestion pipeline
3. François auto-populates all wine metadata

---

## 💡 Tips for Best Results

1. **Start with high-confidence matches** - Apply only high-confidence auto-categorizations first
2. **Review medium-confidence** - Manually verify before applying
3. **Add more training examples** - The more examples, the better François learns
4. **Keep climat database updated** - Import more climats as needed
5. **Test incrementally** - Apply to 10 wines, validate, then scale up

---

**Phase 2 Status:** Complete ✅
**Tools Ready:** Parser, Training Data, Auto-Categorizer
**Next:** Test on your real wines!
