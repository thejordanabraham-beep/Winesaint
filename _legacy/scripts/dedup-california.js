const XLSX = require('xlsx');
const workbook = XLSX.readFile('/Users/jordanabraham/Desktop/WINESAINT_MSTR_RVW.xlsx');
const sheet = workbook.Sheets['California'];
const rows = XLSX.utils.sheet_to_json(sheet);

// Find exact duplicates based on Producer + Wine Name + Vintage
const seen = new Map();
const duplicateIndices = new Set();

rows.forEach((row, index) => {
  const key = [row.Producer, row['Wine Name'], row.Vintage].join('|');
  if (seen.has(key)) {
    duplicateIndices.add(index);
  } else {
    seen.set(key, index);
  }
});

// Filter out duplicates (keep first occurrence)
const uniqueRows = rows.filter((_, index) => !duplicateIndices.has(index));

console.log('Original rows:', rows.length);
console.log('Duplicates removed:', duplicateIndices.size);
console.log('Unique rows remaining:', uniqueRows.length);

// Create new worksheet and replace
const newSheet = XLSX.utils.json_to_sheet(uniqueRows);
workbook.Sheets['California'] = newSheet;

// Save
XLSX.writeFile(workbook, '/Users/jordanabraham/Desktop/WINESAINT_MSTR_RVW.xlsx');
console.log('\nFile saved with duplicates removed.');
