#!/bin/bash

# GUIDE GENERATION PROGRESS CHECKER
# Shows current status of all guide generation tasks

echo ""
echo "🏔️  PIEDMONT GUIDE GENERATION PROGRESS"
echo "========================================================================"
echo ""

# Check what's currently running
echo "📊 Current Status:"
echo ""

# Count generated guides
COMMUNE_COUNT=$(ls -1 guides/*-guide.md 2>/dev/null | grep -E "(barolo|castiglione|la-morra|serralunga|verduno|novello|roddi|monforte|diano|grinzane|barbaresco|neive|treiso|san-rocco)-guide.md" | wc -l | tr -d ' ')
BAROLO_MGA_COUNT=$(ls -1 guides/*-vineyard-guide.md 2>/dev/null | wc -l | tr -d ' ')
TOTAL_GUIDES=$(ls -1 guides/*.md 2>/dev/null | wc -l | tr -d ' ')

echo "  Commune guides: $COMMUNE_COUNT / 14"
echo "  MGA guides: $BAROLO_MGA_COUNT / 242"
echo "  Total guides: $TOTAL_GUIDES"
echo ""

# Show latest generated files
echo "📝 Latest generated guides:"
ls -lt guides/*.md 2>/dev/null | head -5 | awk '{print "  " $9}' | sed 's|guides/||'
echo ""

# Check running processes
echo "🔄 Running processes:"
if ps aux | grep -q "[g]enerate-piedmont-guides.ts"; then
  echo "  ✅ Guide generation is running"
  echo ""
  echo "  Current activity:"
  tail -5 /tmp/commune-guides.log 2>/dev/null || tail -5 /tmp/mga-guides-generation.log 2>/dev/null || echo "  (No recent activity)"
else
  echo "  ⏸️  No guide generation currently running"
fi
echo ""

# Show log file locations
echo "📋 Log files:"
echo "  Commune guides: /tmp/commune-guides.log"
echo "  MGA guides: /tmp/mga-guides-generation.log"
echo "  Auto-pipeline: /tmp/auto-pipeline.log"
echo ""

# Monitoring commands
echo "💡 Monitoring commands:"
echo "  Watch commune progress:  tail -f /tmp/commune-guides.log"
echo "  Watch MGA progress:      tail -f /tmp/mga-guides-generation.log"
echo "  Watch auto-pipeline:     tail -f /tmp/auto-pipeline.log"
echo "  Re-run this status:      bash scripts/check-guide-progress.sh"
echo ""

# Estimated completion
if [ "$COMMUNE_COUNT" -lt 14 ]; then
  REMAINING_COMMUNES=$((14 - COMMUNE_COUNT))
  echo "⏱️  Estimated time remaining for communes: ~$((REMAINING_COMMUNES * 2)) minutes"
fi

if [ "$BAROLO_MGA_COUNT" -lt 242 ]; then
  REMAINING_MGAS=$((242 - BAROLO_MGA_COUNT))
  echo "⏱️  Estimated time remaining for MGAs: ~$((REMAINING_MGAS * 2 / 60)) hours"
fi

echo ""
echo "========================================================================"
