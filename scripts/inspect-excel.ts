/**
 * Inspect Excel wine list structure
 */

import * as XLSX from 'xlsx';

const filePath = '/Users/jordanabraham/Desktop/Master Drink Note Sheet.xlsx';

try {
  const workbook = XLSX.readFile(filePath);

  console.log('📊 Excel File Structure');
  console.log('='.repeat(60));
  console.log(`Sheets: ${workbook.SheetNames.join(', ')}\n`);

  // Read first sheet
  const sheetName = workbook.SheetNames[0];
  const worksheet = workbook.Sheets[sheetName];
  const data = XLSX.utils.sheet_to_json(worksheet, { header: 1 });

  console.log(`Active Sheet: ${sheetName}`);
  console.log(`Rows: ${data.length}\n`);

  console.log('First 10 rows:');
  console.log('='.repeat(60));
  data.slice(0, 10).forEach((row: any, i: number) => {
    console.log(`${i + 1}:`, row);
  });

} catch (error) {
  console.error('Error reading Excel file:', error);
}
