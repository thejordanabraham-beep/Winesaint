const XLSX = require('xlsx');
const workbook = XLSX.readFile('/Users/jordanabraham/Desktop/WINESAINT_MSTR_RVW.xlsx');
const sheet = workbook.Sheets['France - Burgundy'];
const rows = XLSX.utils.sheet_to_json(sheet);

// Find exact duplicates based on Producer + Wine Name + Vintage
const seen = new Map();
const duplicateIndices = new Set();
const missingScoreIndices = new Set();

rows.forEach((row, index) => {
  // Check for missing or invalid score
  const score = row.Score;
  if (score === undefined || score === null || score === '' || isNaN(Number(score))) {
    missingScoreIndices.add(index);
    return; // Don't add to seen map
  }

  // Check for duplicates
  const key = [row.Producer, row['Wine Name'], row.Vintage].join('|');
  if (seen.has(key)) {
    duplicateIndices.add(index);
  } else {
    seen.set(key, index);
  }
});

// Filter out duplicates AND missing scores
const cleanRows = rows.filter((_, index) => !duplicateIndices.has(index) && !missingScoreIndices.has(index));

console.log('=== BURGUNDY CLEANUP ===');
console.log('Original rows:', rows.length);
console.log('Missing/invalid scores removed:', missingScoreIndices.size);
console.log('Duplicates removed:', duplicateIndices.size);
console.log('Clean rows remaining:', cleanRows.length);

// Create new worksheet and replace
const newSheet = XLSX.utils.json_to_sheet(cleanRows);
workbook.Sheets['France - Burgundy'] = newSheet;

// Save
XLSX.writeFile(workbook, '/Users/jordanabraham/Desktop/WINESAINT_MSTR_RVW.xlsx');
console.log('\nFile saved.');
