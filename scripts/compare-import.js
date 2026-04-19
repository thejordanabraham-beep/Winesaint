const XLSX = require('xlsx');
const http = require('http');

const workbook = XLSX.readFile('/Users/jordanabraham/Desktop/WINESAINT_MSTR_RVW.xlsx');
const sheet = workbook.Sheets['Australia'];
const data = XLSX.utils.sheet_to_json(sheet);

const excelProducers = [...new Set(data.map(r => r.Producer || r.producer || r.PRODUCER).filter(Boolean))];

// Fetch from Payload
http.get('http://localhost:3000/api/producers?limit=100', (res) => {
  let body = '';
  res.on('data', chunk => body += chunk);
  res.on('end', () => {
    const d = JSON.parse(body);
    const payloadProducers = d.docs.map(p => p.name);

    console.log('=== PRODUCER COMPARISON ===\n');
    console.log('In Excel:', excelProducers.length);
    console.log('In Payload:', payloadProducers.length);

    const missing = excelProducers.filter(p => payloadProducers.indexOf(p) === -1);
    console.log('\nMissing from Payload (' + missing.length + '):');
    missing.forEach(p => console.log('  -', p));

    // Count wines per missing producer
    console.log('\nWines per missing producer:');
    let totalMissing = 0;
    missing.forEach(p => {
      const count = data.filter(r => (r.Producer || r.producer || r.PRODUCER) === p).length;
      totalMissing += count;
      console.log('  -', p + ':', count, 'wines');
    });
    console.log('\nTotal missing wines:', totalMissing);
  });
});
