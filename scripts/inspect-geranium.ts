/**
 * Inspect Geranium wine list structure
 */

import * as XLSX from 'xlsx';

const filePath = '/Users/jordanabraham/Desktop/Geranium_Wine_List.xlsx';

try {
  const workbook = XLSX.readFile(filePath);

  console.log('📊 Geranium Wine List Structure');
  console.log('='.repeat(60));
  console.log(`Sheets: ${workbook.SheetNames.join(', ')}\n`);

  // Read first sheet
  const sheetName = workbook.SheetNames[0];
  const worksheet = workbook.Sheets[sheetName];
  const data = XLSX.utils.sheet_to_json(worksheet, { header: 1 });

  console.log(`Active Sheet: ${sheetName}`);
  console.log(`Total Rows: ${data.length}\n`);

  console.log('First 10 rows:');
  console.log('='.repeat(60));
  data.slice(0, 10).forEach((row: any, i: number) => {
    console.log(`Row ${i + 1}:`, row);
  });

  console.log('\n');
  console.log('Column headers (Row 1):');
  console.log(data[0]);

} catch (error) {
  console.error('Error reading Excel file:', error);
}
