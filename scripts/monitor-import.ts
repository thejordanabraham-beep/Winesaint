import fs from 'fs';

const PROGRESS_FILE = '/tmp/geranium-vineyard-import-progress.json';

function monitor() {
  if (!fs.existsSync(PROGRESS_FILE)) {
    console.log('❌ Progress file not found');
    return;
  }

  const progress = JSON.parse(fs.readFileSync(PROGRESS_FILE, 'utf-8'));
  const total = 6382;
  const remaining = total - progress.successCount;
  const percentComplete = ((progress.successCount / total) * 100).toFixed(2);

  // Estimate time remaining (2 seconds per wine)
  const secondsRemaining = remaining * 2;
  const hoursRemaining = (secondsRemaining / 3600).toFixed(1);

  console.log('🍷 GERANIUM WINE IMPORT PROGRESS');
  console.log('='.repeat(70));
  console.log(`✅ Imported: ${progress.successCount}/${total} wines (${percentComplete}%)`);
  console.log(`🍇 Vineyards detected: ${progress.vineyardsFound}`);
  console.log(`❌ Errors: ${progress.errorCount}`);
  console.log(`📍 Last row: ${progress.lastProcessedRow}`);
  console.log(`⏱️  Est. time remaining: ~${hoursRemaining} hours`);

  if (progress.errors && progress.errors.length > 0) {
    console.log('\n⚠️  Recent errors:');
    progress.errors.slice(-5).forEach((err: string) => {
      console.log(`   - ${err}`);
    });
  }
}

monitor();
