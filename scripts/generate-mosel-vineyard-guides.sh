#!/bin/bash
# Generate vineyard guides for key Mosel VDP Grosse Lage sites

echo "Generating VDP Grosse Lage vineyard guides..."
echo ""

# Track costs
TOTAL_COST=0

# Mittelmosel - Top tier sites
echo "=== MITTELMOSEL ==="

npx tsx scripts/wine-region-guide-generator.ts "Wehlener Sonnenuhr" vineyard "Mittelmosel, Mosel" "wehlener-sonnenuhr-guide.md"
npx tsx scripts/wine-region-guide-generator.ts "Erdener Prälat" vineyard "Mittelmosel, Mosel" "erdener-pralat-guide.md"
npx tsx scripts/wine-region-guide-generator.ts "Ürziger Würzgarten" vineyard "Mittelmosel, Mosel" "urziger-wurzgarten-guide.md"
npx tsx scripts/wine-region-guide-generator.ts "Bernkasteler Doctor" vineyard "Mittelmosel, Mosel" "bernkasteler-doctor-guide.md"
npx tsx scripts/wine-region-guide-generator.ts "Brauneberger Juffer-Sonnenuhr" vineyard "Mittelmosel, Mosel" "brauneberger-juffer-sonnenuhr-guide.md"
npx tsx scripts/wine-region-guide-generator.ts "Piesporter Goldtröpfchen" vineyard "Mittelmosel, Mosel" "piesporter-goldtropfchen-guide.md"

echo ""
echo "=== SAAR ==="

npx tsx scripts/wine-region-guide-generator.ts "Scharzhofberg" vineyard "Saar, Mosel" "scharzhofberg-guide.md"
npx tsx scripts/wine-region-guide-generator.ts "Wiltinger Gottesfuß" vineyard "Saar, Mosel" "wiltinger-gottesfuss-guide.md"
npx tsx scripts/wine-region-guide-generator.ts "Ayler Kupp" vineyard "Saar, Mosel" "ayler-kupp-guide.md"

echo ""
echo "=== RUWER ==="

npx tsx scripts/wine-region-guide-generator.ts "Karthäuserhofberg" vineyard "Ruwer, Mosel" "karthauserhofberg-guide.md"
npx tsx scripts/wine-region-guide-generator.ts "Maximin Grünhäuser Abtsberg" vineyard "Ruwer, Mosel" "maximin-grunhauser-abtsberg-guide.md"

echo ""
echo "=== TERRASSENMOSEL ==="

npx tsx scripts/wine-region-guide-generator.ts "Winninger Uhlen" vineyard "Terrassenmosel, Mosel" "winninger-uhlen-guide.md"
npx tsx scripts/wine-region-guide-generator.ts "Pündericher Marienburg" vineyard "Terrassenmosel, Mosel" "pundericher-marienburg-guide.md"

echo ""
echo "==================================================================="
echo "VINEYARD GUIDE GENERATION COMPLETE"
echo "==================================================================="
