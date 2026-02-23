# Wine Saint & François Review Scripts - Full Comparison

## 📁 THREE MAIN SCRIPTS

### **1. wine-saint-unified-system-fixed.ts** (208 lines) ✅ RECOMMENDED
**Status:** Latest, has duplicate prevention
**Reviewer Name:** "Wine Saint"
**Style:** Technical + witty

**Scoring:**
```typescript
If criticAvg exists: score = criticAvg + 2
Else if vivinoScore: score = (vivinoScore × 20) + 2
Else: score = 90

Min: 87, Max: 100
```

**Features:**
- ✅ Checks for existing reviews (prevents duplicates)
- ✅ Updates wine document with review reference
- ✅ Simple, straightforward prompt
- ❌ No François RAG integration
- ❌ No K&L notes

**Prompt Style:**
- "Technical precision with casual confidence"
- "Direct, punchy language (no flowery BS)"
- "Self-aware wit (no pretension)"
- Avoids pH mentions (only 1 in 10)

---

### **2. wine-saint-unified-system.ts** (304 lines)
**Status:** Older version, more features
**Reviewer Name:** "Wine Saint"
**Style:** Academic, technical

**Scoring:**
```typescript
critic = criticAvg || 88
vivino = (vivinoScore × 20 + 10) || 88

weighted = (critic × 0.85) + (vivino × 0.15)
boosted = weighted + 2
final = max(round(boosted), 87)
```

**Features:**
- ✅ François RAG integration (calls http://localhost:8000/search)
- ✅ K&L Wine notes database (Opus One, etc.)
- ✅ More sophisticated prompt (academic style)
- ❌ No duplicate checking
- ❌ Doesn't update wine document

**Prompt Style:**
- "Academic and technical"
- "Use precise wine terminology"
- "Educational tone, not flowery"
- Strategic pH usage (only 10% of reviews)
- Natural vintage context integration

---

### **3. generate-reviews-v2.ts** (277 lines)
**Status:** Most sophisticated
**Reviewer Name:** "Wine Saint" (but different style)
**Style:** Academic, concise

**Scoring:**
```typescript
vivinoAs100 = (vivinoScore × 20) + 10
final = (criticAvg × 0.9) + (vivinoAs100 × 0.1)
```

**Features:**
- ✅ Two-pass generation (keywords first, then prose)
- ✅ François RAG via library (getReferenceNotes)
- ✅ K&L notes via library
- ✅ Flavor Wheel vocabulary
- ✅ Template variation (5 different templates)
- ✅ Few-shot learning
- ❌ No duplicate checking
- ❌ Requires library files (lib/reference-sources.ts, lib/prompt-templates.ts, etc.)

**Process:**
1. Get reference (K&L → François RAG waterfall)
2. Build flavor palette
3. Pass 1: Extract keywords
4. Pass 2: Generate review with template

---

## 🔍 KEY DIFFERENCES

| Feature | Fixed | Unified | V2 |
|---------|-------|---------|-----|
| **Duplicate checking** | ✅ | ❌ | ❌ |
| **François RAG** | ❌ | ✅ | ✅ |
| **K&L Notes** | ❌ | ✅ (inline) | ✅ (library) |
| **Scoring** | Simple +2 | Weighted +2 | Weighted only |
| **Style** | Witty | Academic | Academic |
| **Complexity** | Low | Medium | High |
| **Dependencies** | None | None | Multiple libs |
| **Updates wine doc** | ✅ | ❌ | ✅ (hasAiReview) |

---

## 📊 SCORING COMPARISON

### Input: criticAvg = 95, vivinoScore = 4.5

**Fixed:**
```
score = 95 + 2 = 97
```

**Unified:**
```
critic = 95
vivino = (4.5 × 20 + 10) = 100
weighted = (95 × 0.85) + (100 × 0.15) = 95.75
boosted = 95.75 + 2 = 97.75
final = 98
```

**V2:**
```
vivinoAs100 = (4.5 × 20 + 10) = 100
final = (95 × 0.9) + (100 × 0.1) = 95.5
```

---

## ✍️ REVIEW STYLE EXAMPLES

### **Fixed (Witty)**
Prompt says: "Technical precision with casual confidence, direct punchy language, self-aware wit"

Example output might be:
> "This Riesling slaps. Laser-focused acidity, wet stone minerality, and citrus pith that doesn't quit. The 2021 vintage gave us concentrated fruit without the flabbiness—all tension, no filler. Drink it now for electric freshness or cellar 10 years for petrol complexity."

### **Unified (Academic)**
Prompt says: "Academic and technical, precise wine terminology, natural vintage integration"

Example output might be:
> "Medium-bodied with pronounced mineral tension characteristic of Wachau gneiss soils. Bright acidity around pH 3.2 balances ripe stone fruit from the warm 2021 season. Fine texture, persistent finish with notes of white peach and limestone."

### **V2 (Academic + Templates)**
Uses template variation with few-shot examples

Example output might be:
> "Stone fruit concentration with vibrant acidity. Chalky mineral undertones from decomposed granite. The 2021 growing season delivered balanced ripeness with tension intact. Flavors evolve toward citrus peel and almond on the finish."

---

## 🎯 WHICH TO USE FOR EXCEL IMPORT?

### **Option A: Use Fixed (Simplest)**
**Pros:**
- ✅ Duplicate checking built-in
- ✅ Simple, proven
- ✅ Fast (single-pass)
- ✅ No external dependencies

**Cons:**
- ❌ No François RAG (less contextual)
- ❌ No K&L notes reference

**Best for:** Quick import, don't need extensive context

---

### **Option B: Use Unified (Balanced)**
**Pros:**
- ✅ François RAG integration
- ✅ K&L notes for specific wines
- ✅ More sophisticated scoring
- ✅ Academic style

**Cons:**
- ❌ No duplicate checking (would need to add)
- ❌ Doesn't update wine doc (would need to add)

**Best for:** Want François context + academic style

---

### **Option C: Use V2 (Most Sophisticated)**
**Pros:**
- ✅ Two-pass generation (most accurate)
- ✅ Template variation
- ✅ Few-shot learning
- ✅ Comprehensive libraries

**Cons:**
- ❌ No duplicate checking
- ❌ Requires multiple library files
- ❌ Slower (two passes)

**Best for:** Maximum quality, have time for processing

---

### **Option D: Hybrid (Create New)**
Combine best features:
- Duplicate checking from Fixed
- François RAG from Unified
- Scoring of your choice
- Style of your choice

**This is what I recommend we build together.**

---

## 💡 RECOMMENDATION

**For your Excel import, let's create a NEW script that combines:**

1. **Scoring:** Use Excel scores as-is (no boost, no formulas) - they're already professional scores
2. **Review Text:** Keep original Excel text OR generate Wine Saint style (your choice)
3. **François:** Optionally query François for additional context
4. **Duplicate checking:** Built-in
5. **Reviewer:** Your choice (original, Wine Saint, or François AI)

**Should we:**
- Keep the original review text from Excel (Antonio Galloni, etc.)?
- OR generate new Wine Saint reviews using François context?
- OR hybrid: Import original + generate second AI review for comparison?

Let me know what you want to edit/change!
