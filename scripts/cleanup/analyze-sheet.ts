import * as XLSX from 'xlsx';

const EXCEL_FILE = '/Users/jordanabraham/Desktop/WINESAINT_MSTR_RVW.xlsx';
const SHEET_NAME = process.argv[2] || 'France - Rhone';

const workbook = XLSX.readFile(EXCEL_FILE);
const sheet = workbook.Sheets[SHEET_NAME];
const data = XLSX.utils.sheet_to_json(sheet) as Record<string, any>[];

console.log(`=== ${SHEET_NAME} ===`);
console.log(`Total rows: ${data.length}`);
console.log('');

// Check unique values
const producers = [...new Set(data.map(r => r.Producer))];
const regions = [...new Set(data.map(r => r.Region).filter(Boolean))];
const colors = [...new Set(data.map(r => r['Color/Type']).filter(Boolean))];
const grapes = data.filter(r => r['Grape Varieties']).map(r => r['Grape Varieties']);

console.log('=== UNIQUE VALUES ===');
console.log(`Producers (${producers.length}):`, producers.slice(0, 15).join(', ') + (producers.length > 15 ? '...' : ''));
console.log('');
console.log(`Regions (${regions.length}):`, regions.join(', '));
console.log('');
console.log('Colors:', colors.join(', '));
console.log('');
console.log(`Grape Varieties filled: ${grapes.length} / ${data.length} rows`);
if (grapes.length > 0) {
  console.log('  Examples:', [...new Set(grapes)].slice(0, 5).join(' | '));
}

// Check for empty fields
const emptyGrapes = data.filter(r => !r['Grape Varieties']).length;
const emptyPrice = data.filter(r => !r['Release Price']).length;
const emptyRegion = data.filter(r => !r.Region).length;

console.log('');
console.log('=== EMPTY FIELDS ===');
console.log(`Empty Grape Varieties: ${emptyGrapes} / ${data.length}`);
console.log(`Empty Release Price: ${emptyPrice} / ${data.length}`);
console.log(`Empty Region: ${emptyRegion} / ${data.length}`);

// Check for text issues in tasting notes
console.log('');
console.log('=== TASTING NOTES ISSUES ===');
const notesWithIssues = data.filter(r => {
  const notes = r['Tasting Notes'] || '';
  // Check for words running together (lowercase followed by uppercase)
  return /[a-z][A-Z]/.test(notes) || /\d[A-Za-z]/.test(notes);
});
console.log(`Notes with possible formatting issues: ${notesWithIssues.length} / ${data.length}`);
if (notesWithIssues.length > 0) {
  console.log('Examples:');
  notesWithIssues.slice(0, 3).forEach((r, i) => {
    const notes = r['Tasting Notes'] || '';
    const match = notes.match(/[a-z][A-Z]|(\d)[A-Za-z]/);
    if (match) {
      const idx = notes.indexOf(match[0]);
      console.log(`  ${i + 1}. "...${notes.substring(Math.max(0, idx - 20), idx + 30)}..."`);
    }
  });
}
