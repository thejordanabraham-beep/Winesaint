import XLSX from 'xlsx';

const EXCEL_FILE = '/Users/jordanabraham/Desktop/WINESAINT_MSTR_RVW_CLEANED.xlsx';
const SHEET_NAME = 'France - Burgundy';

// Producers that KEEP "Domaine" exactly as-is
const KEEP_DOMAINE = [
  'Domaine Clos de Tart',
  'Domaine Comte Georges de Vogüé',
  'Domaine des Comtes Lafon',
  'Domaine du Comte Liger-Belair',
  'Domaine Leflaive',
];

// Special transformations
const SPECIAL_CASES: Record<string, string> = {
  'Domaine Guy Roulot': 'Domaine Roulot',
};

// Read workbook
const workbook = XLSX.readFile(EXCEL_FILE);
const sheet = workbook.Sheets[SHEET_NAME];
const data = XLSX.utils.sheet_to_json(sheet) as Record<string, any>[];

console.log(`Loaded ${data.length} rows from ${SHEET_NAME}\n`);

// Track changes
const changes: { from: string; to: string; count: number }[] = [];
const changeMap = new Map<string, string>();

// Process each row
for (const row of data) {
  const producer = row.Producer || '';

  // Skip if no Domaine
  if (!/domaine/i.test(producer)) continue;

  // Skip if in KEEP list
  if (KEEP_DOMAINE.includes(producer)) continue;

  let newProducer = producer;

  // Check special cases first
  if (SPECIAL_CASES[producer]) {
    newProducer = SPECIAL_CASES[producer];
  } else {
    // Remove "Domaine " from the beginning
    newProducer = producer.replace(/^Domaine\s+/i, '');
  }

  if (newProducer !== producer) {
    changeMap.set(producer, newProducer);
    row.Producer = newProducer;
  }
}

// Count changes
for (const [from, to] of changeMap) {
  const count = data.filter(r => r.Producer === to).length;
  changes.push({ from, to, count });
}

// Sort by original name
changes.sort((a, b) => a.from.localeCompare(b.from));

console.log('=== PRODUCER NAME CHANGES ===\n');
for (const c of changes) {
  console.log(`"${c.from}" → "${c.to}" (${c.count} wines)`);
}

console.log(`\n=== SUMMARY ===`);
console.log(`Producers changed: ${changes.length}`);
console.log(`Total wines affected: ${changes.reduce((sum, c) => sum + c.count, 0)}`);

// Write back
const newSheet = XLSX.utils.json_to_sheet(data);
workbook.Sheets[SHEET_NAME] = newSheet;
XLSX.writeFile(workbook, EXCEL_FILE);

console.log(`\nChanges written to: ${EXCEL_FILE}`);
