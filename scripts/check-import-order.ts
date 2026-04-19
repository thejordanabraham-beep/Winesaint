import * as XLSX from 'xlsx';
import http from 'http';

const workbook = XLSX.readFile('/Users/jordanabraham/Desktop/WINESAINT_MSTR_RVW.xlsx');
const sheet = workbook.Sheets['Australia'];
const data = XLSX.utils.sheet_to_json(sheet) as any[];

// Check the order of producers in Excel
console.log('=== PRODUCER ORDER IN EXCEL ===\n');
const producerOrder: string[] = [];
const producerFirstRow: Record<string, number> = {};
const producerWineCount: Record<string, number> = {};

data.forEach((row, idx) => {
  const prod = row.Producer || row.producer || row.PRODUCER;
  if (prod) {
    if (!producerOrder.includes(prod)) {
      producerOrder.push(prod);
      producerFirstRow[prod] = idx + 2; // +2 for header row and 0-index
    }
    producerWineCount[prod] = (producerWineCount[prod] || 0) + 1;
  }
});

producerOrder.forEach((prod, idx) => {
  console.log(`${idx + 1}. ${prod} (starts row ${producerFirstRow[prod]}, ${producerWineCount[prod]} wines)`);
});

// Now check Payload
console.log('\n=== CHECKING PAYLOAD ===\n');

http.get('http://localhost:3000/api/producers?limit=100', (res) => {
  let body = '';
  res.on('data', chunk => body += chunk);
  res.on('end', () => {
    const d = JSON.parse(body);
    const payloadProducers = d.docs.map((p: any) => p.name);

    console.log('Imported producers:');
    producerOrder.forEach((prod, idx) => {
      const imported = payloadProducers.includes(prod);
      console.log(`${idx + 1}. ${prod}: ${imported ? '✓ IMPORTED' : '✗ MISSING'}`);
    });

    // Find the cutoff point
    console.log('\n=== ANALYSIS ===\n');
    let lastImported = '';
    let firstMissing = '';
    producerOrder.forEach((prod) => {
      if (payloadProducers.includes(prod)) {
        lastImported = prod;
      } else if (!firstMissing) {
        firstMissing = prod;
      }
    });

    console.log('Last imported producer:', lastImported);
    console.log('First missing producer:', firstMissing);

    // Check if it's a clean cutoff or scattered
    let importedCount = 0;
    let missingAfterImported = false;
    producerOrder.forEach((prod) => {
      const imported = payloadProducers.includes(prod);
      if (imported) {
        importedCount++;
        if (missingAfterImported) {
          console.log('WARNING: Non-sequential import detected - some producers imported after gaps');
        }
      } else {
        if (importedCount > 0) {
          missingAfterImported = true;
        }
      }
    });
  });
});
