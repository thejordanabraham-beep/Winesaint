#!/bin/bash

# AUTOMATIC MGA GUIDE GENERATION CONTINUATION
# This script runs AFTER commune guides are complete
# Generates all MGA guides in sequence

set -e

LOG_FILE="/tmp/mga-guides-generation.log"

echo "" | tee -a "$LOG_FILE"
echo "🍷 CONTINUING WITH MGA GUIDE GENERATION" | tee -a "$LOG_FILE"
echo "======================================================================" | tee -a "$LOG_FILE"
echo "Start time: $(date)" | tee -a "$LOG_FILE"
echo "" | tee -a "$LOG_FILE"

# Wait a moment to ensure commune task is fully complete
sleep 5

# TIER 2: Barolo MGA Guides (177 guides)
echo "📚 TIER 2: Generating Barolo MGA guides (177 total)..." | tee -a "$LOG_FILE"
echo "======================================================================" | tee -a "$LOG_FILE"
echo "⚠️  Estimated time: 4-5 hours" | tee -a "$LOG_FILE"
echo "⚠️  Estimated cost: $25-30" | tee -a "$LOG_FILE"
echo "Start time: $(date)" | tee -a "$LOG_FILE"
echo "" | tee -a "$LOG_FILE"

cd /Users/jordanabraham/wine-reviews
npx tsx scripts/generate-piedmont-guides.ts --tier barolo-mgas 2>&1 | tee -a "$LOG_FILE"

echo "" | tee -a "$LOG_FILE"
echo "✅ Barolo MGAs complete: $(date)" | tee -a "$LOG_FILE"
echo "" | tee -a "$LOG_FILE"

# TIER 3: Barbaresco MGA Guides (65 guides)
echo "📚 TIER 3: Generating Barbaresco MGA guides (65 total)..." | tee -a "$LOG_FILE"
echo "======================================================================" | tee -a "$LOG_FILE"
echo "⚠️  Estimated time: 1.5-2 hours" | tee -a "$LOG_FILE"
echo "⚠️  Estimated cost: $10-15" | tee -a "$LOG_FILE"
echo "Start time: $(date)" | tee -a "$LOG_FILE"
echo "" | tee -a "$LOG_FILE"

npx tsx scripts/generate-piedmont-guides.ts --tier barbaresco-mgas 2>&1 | tee -a "$LOG_FILE"

echo "" | tee -a "$LOG_FILE"
echo "✅ Barbaresco MGAs complete: $(date)" | tee -a "$LOG_FILE"
echo "" | tee -a "$LOG_FILE"

# Final summary
echo "🎉 ALL MGA GUIDES GENERATED!" | tee -a "$LOG_FILE"
echo "======================================================================" | tee -a "$LOG_FILE"
echo "End time: $(date)" | tee -a "$LOG_FILE"
echo "" | tee -a "$LOG_FILE"
echo "📊 Total MGA guides generated:" | tee -a "$LOG_FILE"
echo "  - Barolo: 177" | tee -a "$LOG_FILE"
echo "  - Barbaresco: 65" | tee -a "$LOG_FILE"
echo "  - Total: 242" | tee -a "$LOG_FILE"
echo "" | tee -a "$LOG_FILE"
echo "📁 All guides saved to: guides/" | tee -a "$LOG_FILE"
echo "📋 Full log: $LOG_FILE" | tee -a "$LOG_FILE"
echo "" | tee -a "$LOG_FILE"
echo "💡 To monitor progress: tail -f $LOG_FILE" | tee -a "$LOG_FILE"
