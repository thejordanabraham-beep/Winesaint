import * as XLSX from 'xlsx';

const wb = XLSX.readFile('/Users/jordanabraham/Desktop/WINESAINT_MSTR_RVW_CLEANED.xlsx');
for (const sheetName of ['Italy', 'Germany', 'Australia', 'France - Loire']) {
  const ws = wb.Sheets[sheetName];
  if (!ws) continue;
  const rows: any[] = XLSX.utils.sheet_to_json(ws);
  console.log(`\n=== ${sheetName} (${rows.length} rows) ===`);
  for (let i = 0; i < Math.min(3, rows.length); i++) {
    const v = rows[i].Vintage;
    console.log(`  Row ${i+2}: Vintage = ${JSON.stringify(v)} (typeof ${typeof v})`);
  }
}
