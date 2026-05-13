#!/bin/bash

# MASTER SCRIPT: Generate all missing region guides by country
# Execute in priority order after Spain completes

set -e

echo "=========================================="
echo "WINE REGION GUIDE GENERATION - ALL COUNTRIES"
echo "=========================================="
echo ""

# Track total cost and time
START_TIME=$(date +%s)
TOTAL_COST=0

# Function to run script and capture cost
run_country() {
  COUNTRY=$1
  SCRIPT=$2

  echo ""
  echo "=========================================="
  echo "STARTING: $COUNTRY"
  echo "=========================================="

  npx tsx "$SCRIPT"

  echo ""
  echo "✅ $COUNTRY COMPLETE"
  echo ""
}

# Priority order based on missing guide counts and importance
run_country "South Africa (7 regions)" "scripts/generate-south-africa-guides.ts"
run_country "Argentina (4 regions)" "scripts/generate-argentina-guides.ts"
run_country "New Zealand (4 regions)" "scripts/generate-new-zealand-guides.ts"
run_country "Chile (9 regions)" "scripts/generate-chile-guides.ts"
run_country "Portugal (11 regions)" "scripts/generate-portugal-guides.ts"
run_country "USA Oregon/Washington (3 regions)" "scripts/generate-usa-guides.ts"
run_country "Australia (16 regions)" "scripts/generate-australia-guides.ts"

END_TIME=$(date +%s)
DURATION=$((END_TIME - START_TIME))
HOURS=$((DURATION / 3600))
MINUTES=$(((DURATION % 3600) / 60))

echo ""
echo "=========================================="
echo "🎉 ALL COUNTRIES COMPLETE!"
echo "=========================================="
echo "Total Duration: ${HOURS}h ${MINUTES}m"
echo "=========================================="
