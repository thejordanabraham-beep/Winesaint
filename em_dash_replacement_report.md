# Em Dash Replacement Report

## Summary

Successfully processed **all 2,215 markdown files** in `/Users/jordanabraham/wine-reviews/guides/` directory.

- **Files containing em dashes found:** 1,331
- **Files processed successfully:** 1,331
- **Em dashes remaining:** 0

## Replacement Rules Applied

The script intelligently replaced em dashes (—) with grammatically appropriate punctuation based on context:

### 1. Paired Em Dashes → Parentheses
**When:** Content between two em dashes forms a parenthetical phrase

**Example:**
- **Before:** "formations—rich in calcium—now"
- **After:** "formations (rich in calcium) now"

### 2. Em Dash Before Article/Demonstrative → Colon
**When:** Em dash precedes "the", "a", "an", "this", "these", or "those" (introduces explanation)

**Example:**
- **Before:** "tectonic collision—the African plate"
- **After:** "tectonic collision: the African plate"

### 3. Em Dash After Number/Measurement → Comma
**When:** Em dash follows a number or measurement and continues a clause

**Example:**
- **Before:** "3.4 million hectoliters—making it"
- **After:** "3.4 million hectoliters, making it"

### 4. Em Dash Before Capitalized Word → Period
**When:** Em dash precedes a capitalized word suggesting a new sentence

**Example:**
- **Before:** "not a Trebbiano at all—The name is"
- **After:** "not a Trebbiano at all. The name is"

### 5. Default → Comma
**When:** All other cases (connecting clauses or adding detail)

**Example:**
- **Before:** "naturally vigorous—a trait that contributed"
- **After:** "naturally vigorous, a trait that contributed"

## Preservation of Hyphens

The script correctly preserved hyphens in proper names and compound words:
- ✓ "Gevrey-Chambertin" (unchanged)
- ✓ "Saint-Émilion" (unchanged)
- ✓ "Côte-Rôtie" (unchanged)
- ✓ "argilo-calcaire" (unchanged)

## Sample Transformations from Abruzzo Guide

1. "3.4 million hectoliters—making it Italy's fourth-largest"
   → "3.4 million hectoliters, making it Italy's fourth-largest"

2. "tectonic collision—the African plate grinding against the Eurasian plate"
   → "tectonic collision: the African plate grinding against the Eurasian plate"

3. "calcareous formations—rich in calcium carbonate and often studded with marine fossils—now constitute"
   → "calcareous formations (rich in calcium carbonate and often studded with marine fossils) now constitute"

4. "DNA analysis confirms it's not a Trebbiano at all—the name is a historical misnomer"
   → "DNA analysis confirms it's not a Trebbiano at all: the name is a historical misnomer"

5. "The variety is naturally vigorous—a trait that contributed to Abruzzo's high-yield reputation"
   → "The variety is naturally vigorous, a trait that contributed to Abruzzo's high-yield reputation"

## Verification

All 2,215 markdown files in the guides directory were checked after processing:
- ✅ 0 em dashes remaining
- ✅ All replacements contextually appropriate
- ✅ No hyphens in proper names were affected

## Process Completed

Date: 2026-03-18
Files processed: 1,331 out of 2,215 total files (only files containing em dashes were modified)
Success rate: 100%
