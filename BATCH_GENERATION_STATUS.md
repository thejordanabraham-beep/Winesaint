# Batch Wine Region Guide Generation - Status

**Started:** 2026-02-11 11:02 PM
**Status:** 🔄 Running
**Progress:** 3/66 regions complete (4.5%)

## Overview

Generating markdown guide content for 66 missing region pages using the wine-region-guide-generator.ts script with François RAG.

## Priority Order

### Priority 1 - Greece (15 guides)
- ✅ greece (country level)
- ✅ santorini
- ✅ crete
- 🔄 cephalonia
- ⏳ samos
- ⏳ rapsani
- ⏳ attica
- ⏳ northern-greece (sub-region level)
- ⏳ naoussa
- ⏳ amyndeon
- ⏳ drama
- ⏳ peloponnese (sub-region level)
- ⏳ nemea
- ⏳ mantinia
- ⏳ patras

### Priority 2 - Spain Rioja Sub-regions (3 guides)
- ⏳ rioja-alta
- ⏳ rioja-alavesa
- ⏳ rioja-oriental

### Priority 3 - Italian Regional Overviews (12 guides)
- ⏳ abruzzo
- ⏳ basilicata
- ⏳ calabria
- ⏳ emilia-romagna
- ⏳ friuli-venezia-giulia
- ⏳ liguria
- ⏳ molise
- ⏳ sardinia
- ⏳ lombardy
- ⏳ marche
- ⏳ puglia
- ⏳ umbria

### Priority 4 - Italian Sub-regions (28 guides)
**Sicily:** etna, marsala, cerasuolo-di-vittoria, pantelleria
**Campania:** taurasi, fiano-di-avellino, greco-di-tufo, aglianico-del-taburno, falerno-del-massico, lacryma-christi-del-vesuvio
**Lombardy:** franciacorta, valtellina, oltrepo-pavese, lugana
**Marche:** verdicchio-dei-castelli-di-jesi, verdicchio-di-matelica, conero, lacrima-di-morro-d-alba, rosso-piceno
**Puglia:** primitivo-di-manduria, salice-salentino, castel-del-monte, gioia-del-colle, locorotondo, copertino
**Umbria:** montefalco, orvieto, torgiano

### Priority 5 - German Regions (8 guides)
- ⏳ nahe
- ⏳ baden
- ⏳ franken
- ⏳ ahr
- ⏳ mittelrhein
- ⏳ saale-unstrut
- ⏳ sachsen
- ⏳ wurttemberg

## Current Metrics

- **Completed:** 3 guides
- **Failed:** 0 guides
- **Total Cost:** $0.42
- **Estimated Completion:** ~3 hours (189 minutes remaining)

## Generated Guides

1. ✅ **Greece** (3,161 words, $0.09) - Country-level overview
2. ✅ **Santorini** (5,670 words, $0.16) - Region-level deep dive
3. ✅ **Crete** (6,368 words, $0.17) - Region-level deep dive

## How to Monitor Progress

Run the status checker script:

```bash
npx tsx scripts/check-generation-status.ts
```

Or check the raw output:

```bash
tail -f /private/tmp/claude/-Users-jordanabraham/tasks/b353ae4.output
```

## Notes

- **Excluding:** Burgundy and Bordeaux (waiting for François data)
- **Output Directory:** `/Users/jordanabraham/wine-reviews/guides/`
- **Average Generation Time:** ~3 minutes per region
- **Average Cost:** ~$0.10-0.17 per region
- **Quality Checks:** Each guide is validated for structure, word count, and content quality

## What Happens Next

Once generation completes:
1. A detailed JSON report will be saved to `guides/_batch-generation-report.json`
2. Final statistics will show:
   - Total cost
   - Total words generated
   - Success/failure counts
   - Average metrics per guide
3. Each guide will be ready for integration into the WineSaint website

## If Issues Occur

The batch script handles:
- Automatic retries for François RAG failures
- Validation of each guide
- Duplicate content checking
- Skip existing guides to avoid overwrites

Failed guides will be reported in the final statistics with error details.
