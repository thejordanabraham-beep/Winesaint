#!/bin/bash

# AUTOMATIC PIPELINE CONTINUATION
# Waits for commune guides to complete, then automatically starts MGA generation

echo "⏳ Waiting for commune guide generation to complete..."
echo "   (This may take 15-20 more minutes)"
echo ""

# Wait for the commune task to complete by monitoring the log file
COMMUNE_LOG="/tmp/commune-guides.log"

# Wait for completion message
while ! grep -q "GENERATION COMPLETE" "$COMMUNE_LOG" 2>/dev/null; do
  sleep 30
  echo "   Still generating commune guides... $(date)"
done

echo ""
echo "✅ Commune guides complete!"
echo ""
echo "🚀 Starting MGA guide generation automatically..."
echo ""

# Run the MGA generation script
bash /Users/jordanabraham/wine-reviews/scripts/continue-mga-generation.sh
