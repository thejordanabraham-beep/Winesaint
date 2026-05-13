import XLSX from 'xlsx';

const EXCEL_FILE = '/Users/jordanabraham/Desktop/WINESAINT_MSTR_RVW.xlsx';
const SHEET_NAME = process.argv[2] || 'France - Rhone';
const PRODUCER_SEARCH = process.argv[3] || '';

const workbook = XLSX.readFile(EXCEL_FILE);
const sheet = workbook.Sheets[SHEET_NAME];
const data = XLSX.utils.sheet_to_json(sheet) as Record<string, any>[];

// Normalize strings for comparison
function normalize(s: string): string {
  return s.normalize('NFD').replace(/[\u0300-\u036f]/g, '').toLowerCase();
}

if (!PRODUCER_SEARCH) {
  // List producers
  const producers = [...new Set(data.map(r => r.Producer))].sort();
  console.log(`Producers in ${SHEET_NAME} (${producers.length}):\n`);
  producers.forEach((p, i) => {
    const count = data.filter(r => r.Producer === p).length;
    console.log(`${i + 1}. ${p} (${count} wines)`);
  });
} else {
  // Find producer (fuzzy match)
  const searchNorm = normalize(PRODUCER_SEARCH);
  const matchedProducer = [...new Set(data.map(r => r.Producer))].find(
    p => normalize(p).includes(searchNorm) || searchNorm.includes(normalize(p))
  );

  if (!matchedProducer) {
    console.log(`Producer "${PRODUCER_SEARCH}" not found.`);
    process.exit(1);
  }

  const wines = data.filter(r => r.Producer === matchedProducer);

  // Get unique wine names with count
  const nameMap = new Map<string, number>();
  wines.forEach(w => {
    const name = w["Wine Name"] || "(empty)";
    nameMap.set(name, (nameMap.get(name) || 0) + 1);
  });

  console.log(`\n${matchedProducer} - ${wines.length} wines, ${nameMap.size} unique names:\n`);
  console.log("Current Wine Name → What should it be?\n");

  [...nameMap.entries()]
    .sort((a, b) => a[0].localeCompare(b[0]))
    .forEach(([name, count], i) => {
      console.log(`${i + 1}. "${name}" (${count}x)`);
    });
}
