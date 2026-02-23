#!/bin/bash

# AUTOMATIC PIEDMONT GUIDE GENERATION PIPELINE
# Generates all Barolo and Barbaresco guides in sequence:
# 1. Commune guides (14 total)
# 2. Barolo MGA guides (177 total)
# 3. Barbaresco MGA guides (65 total)

set -e  # Exit on error

LOG_FILE="/tmp/piedmont-guides-full.log"

echo "🏔️  AUTOMATIC PIEDMONT GUIDE GENERATION PIPELINE" | tee -a "$LOG_FILE"
echo "======================================================================" | tee -a "$LOG_FILE"
echo "Start time: $(date)" | tee -a "$LOG_FILE"
echo "" | tee -a "$LOG_FILE"

# TIER 1: Commune Guides
echo "📚 TIER 1: Generating commune guides (14 total)..." | tee -a "$LOG_FILE"
echo "======================================================================" | tee -a "$LOG_FILE"
npx tsx scripts/generate-piedmont-guides.ts --tier communes 2>&1 | tee -a "$LOG_FILE"
echo "" | tee -a "$LOG_FILE"
echo "✅ Tier 1 complete: $(date)" | tee -a "$LOG_FILE"
echo "" | tee -a "$LOG_FILE"

# TIER 2: Barolo MGA Guides
echo "📚 TIER 2: Generating Barolo MGA guides (177 total)..." | tee -a "$LOG_FILE"
echo "======================================================================" | tee -a "$LOG_FILE"
echo "⚠️  This will take approximately 4-5 hours and cost ~$25-30" | tee -a "$LOG_FILE"
echo "Start time: $(date)" | tee -a "$LOG_FILE"
echo "" | tee -a "$LOG_FILE"
npx tsx scripts/generate-piedmont-guides.ts --tier barolo-mgas 2>&1 | tee -a "$LOG_FILE"
echo "" | tee -a "$LOG_FILE"
echo "✅ Tier 2 complete: $(date)" | tee -a "$LOG_FILE"
echo "" | tee -a "$LOG_FILE"

# TIER 3: Barbaresco MGA Guides
echo "📚 TIER 3: Generating Barbaresco MGA guides (65 total)..." | tee -a "$LOG_FILE"
echo "======================================================================" | tee -a "$LOG_FILE"
echo "⚠️  This will take approximately 1.5-2 hours and cost ~$10-15" | tee -a "$LOG_FILE"
echo "Start time: $(date)" | tee -a "$LOG_FILE"
echo "" | tee -a "$LOG_FILE"
npx tsx scripts/generate-piedmont-guides.ts --tier barbaresco-mgas 2>&1 | tee -a "$LOG_FILE"
echo "" | tee -a "$LOG_FILE"
echo "✅ Tier 3 complete: $(date)" | tee -a "$LOG_FILE"
echo "" | tee -a "$LOG_FILE"

# Final summary
echo "🎉 ALL PIEDMONT GUIDES GENERATED!" | tee -a "$LOG_FILE"
echo "======================================================================" | tee -a "$LOG_FILE"
echo "End time: $(date)" | tee -a "$LOG_FILE"
echo "" | tee -a "$LOG_FILE"
echo "📊 Summary:" | tee -a "$LOG_FILE"
echo "  - Commune guides: 14" | tee -a "$LOG_FILE"
echo "  - Barolo MGA guides: 177" | tee -a "$LOG_FILE"
echo "  - Barbaresco MGA guides: 65" | tee -a "$LOG_FILE"
echo "  - Total guides: 256" | tee -a "$LOG_FILE"
echo "" | tee -a "$LOG_FILE"
echo "📁 Guides saved to: guides/" | tee -a "$LOG_FILE"
echo "📋 Full log: $LOG_FILE" | tee -a "$LOG_FILE"
