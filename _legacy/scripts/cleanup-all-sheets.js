const XLSX = require('xlsx');
const workbook = XLSX.readFile('/Users/jordanabraham/Desktop/WINESAINT_MSTR_RVW.xlsx');

const standardOrder = [
  'Producer', 'Wine Name', 'Vintage', 'Score', 'Color/Type', 'Release Price',
  'Drinking Window', 'Reviewer', 'Review Date', 'Tasting Notes', 'Grape Varieties',
  'Region', 'Payload_Wine_ID', 'Payload_Review_ID', 'Import_Date'
];

const colWidths = [
  { wch: 25 }, { wch: 40 }, { wch: 10 }, { wch: 8 }, { wch: 12 }, { wch: 12 },
  { wch: 15 }, { wch: 15 }, { wch: 15 }, { wch: 80 }, { wch: 20 },
  { wch: 20 }, { wch: 15 }, { wch: 15 }, { wch: 12 }
];

console.log('=== CLEANUP ALL SHEETS ===\n');

let totalOriginal = 0;
let totalDuplicates = 0;
let totalBadScores = 0;
let totalClean = 0;

workbook.SheetNames.forEach(sheetName => {
  const sheet = workbook.Sheets[sheetName];
  const rows = XLSX.utils.sheet_to_json(sheet);

  if (rows.length === 0) return;

  const seen = new Map();
  const duplicateIndices = new Set();
  const badScoreIndices = new Set();

  rows.forEach((row, index) => {
    // Check for missing or invalid score (empty, null, or contains letters)
    const score = row.Score;
    const scoreStr = String(score || '').trim();
    const isInvalidScore = score === undefined || score === null || scoreStr === '' ||
                           isNaN(Number(scoreStr)) || /[a-zA-Z]/.test(scoreStr);

    if (isInvalidScore) {
      badScoreIndices.add(index);
      return;
    }

    // Check for duplicates
    const key = [row.Producer, row['Wine Name'], row.Vintage].join('|');
    if (seen.has(key)) {
      duplicateIndices.add(index);
    } else {
      seen.set(key, index);
    }
  });

  // Filter out bad rows
  const cleanRows = rows.filter((_, index) => !duplicateIndices.has(index) && !badScoreIndices.has(index));

  // Reorder columns to standard
  const reorderedRows = cleanRows.map(row => {
    const newRow = {};
    standardOrder.forEach(col => {
      newRow[col] = row[col] !== undefined ? row[col] : '';
    });
    return newRow;
  });

  // Create new sheet
  const newSheet = XLSX.utils.json_to_sheet(reorderedRows, { header: standardOrder });
  newSheet['!cols'] = colWidths;
  workbook.Sheets[sheetName] = newSheet;

  // Stats
  const dupes = duplicateIndices.size;
  const badScores = badScoreIndices.size;
  const removed = dupes + badScores;

  totalOriginal += rows.length;
  totalDuplicates += dupes;
  totalBadScores += badScores;
  totalClean += cleanRows.length;

  if (removed > 0) {
    console.log(sheetName + ':');
    console.log('  Original: ' + rows.length + ' | Duplicates: ' + dupes + ' | Bad scores: ' + badScores + ' | Clean: ' + cleanRows.length);
  } else {
    console.log(sheetName + ': ' + rows.length + ' rows (no issues)');
  }
});

console.log('\n=== TOTALS ===');
console.log('Original rows:', totalOriginal);
console.log('Duplicates removed:', totalDuplicates);
console.log('Bad scores removed:', totalBadScores);
console.log('Clean rows:', totalClean);

XLSX.writeFile(workbook, '/Users/jordanabraham/Desktop/WINESAINT_MSTR_RVW.xlsx');
console.log('\nFile saved.');
