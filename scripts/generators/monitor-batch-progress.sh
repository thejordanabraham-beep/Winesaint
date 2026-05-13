#!/bin/bash

# Monitor batch guide generation progress

OUTPUT_FILE="/private/tmp/claude/-Users-jordanabraham/tasks/b353ae4.output"

if [ ! -f "$OUTPUT_FILE" ]; then
  echo "Output file not found: $OUTPUT_FILE"
  exit 1
fi

echo "==================================================================="
echo "BATCH GUIDE GENERATION PROGRESS MONITOR"
echo "==================================================================="
echo ""

# Get latest progress line
LATEST_PROGRESS=$(tail -500 "$OUTPUT_FILE" | grep "📊 PROGRESS:" | tail -1)
echo "Latest Progress: $LATEST_PROGRESS"
echo ""

# Get current region being generated
CURRENT_REGION=$(tail -200 "$OUTPUT_FILE" | grep "▶️  \[" | tail -1)
echo "Current Task: $CURRENT_REGION"
echo ""

# Count successes and failures
SUCCESS_COUNT=$(grep -c "✅ SUCCESS:" "$OUTPUT_FILE")
FAILURE_COUNT=$(grep -c "❌ FAILED:" "$OUTPUT_FILE")
echo "Completed: $SUCCESS_COUNT successful, $FAILURE_COUNT failed"
echo ""

# Get latest cost
LATEST_COST=$(tail -500 "$OUTPUT_FILE" | grep "Cost so far:" | tail -1 | sed 's/.*Cost so far: //')
echo "Total Cost So Far: $LATEST_COST"
echo ""

# Check if completed
if tail -100 "$OUTPUT_FILE" | grep -q "FINAL STATISTICS"; then
  echo "==================================================================="
  echo "BATCH GENERATION COMPLETE!"
  echo "==================================================================="
  tail -50 "$OUTPUT_FILE"
fi
