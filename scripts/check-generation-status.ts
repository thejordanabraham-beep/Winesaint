/**
 * Check batch guide generation status
 * Displays current progress, cost, and estimated completion time
 */

import fs from 'fs';
import path from 'path';

const OUTPUT_FILE = '/private/tmp/claude/-Users-jordanabraham/tasks/b353ae4.output';
const GUIDES_DIR = path.join(process.cwd(), 'guides');

function checkStatus() {
  console.log('='.repeat(70));
  console.log('BATCH GUIDE GENERATION STATUS');
  console.log('='.repeat(70));
  console.log('');

  // Check if output file exists
  if (!fs.existsSync(OUTPUT_FILE)) {
    console.log('❌ Output file not found. Process may not have started.');
    return;
  }

  const output = fs.readFileSync(OUTPUT_FILE, 'utf-8');
  const lines = output.split('\n');

  // Find latest progress
  const progressLines = lines.filter(l => l.includes('📊 PROGRESS:'));
  const latestProgress = progressLines[progressLines.length - 1];

  if (latestProgress) {
    const match = latestProgress.match(/(\d+)\/(\d+) complete.*\$([0-9.]+)/);
    if (match) {
      const completed = parseInt(match[1]);
      const total = parseInt(match[2]);
      const cost = parseFloat(match[3]);
      const percentComplete = ((completed / total) * 100).toFixed(1);

      console.log(`📊 Progress: ${completed}/${total} (${percentComplete}%)`);
      console.log(`💰 Cost so far: $${cost.toFixed(2)}`);
      console.log('');

      // Estimate remaining time
      if (completed > 0) {
        const avgTimePerRegion = 180; // 3 minutes average
        const remainingRegions = total - completed;
        const estimatedMinutes = Math.ceil((remainingRegions * avgTimePerRegion) / 60);
        console.log(`⏱️  Estimated time remaining: ${estimatedMinutes} minutes`);
        console.log('');
      }
    }
  }

  // Find current task
  const currentTaskLines = lines.filter(l => l.includes('▶️  ['));
  const currentTask = currentTaskLines[currentTaskLines.length - 1];
  if (currentTask) {
    console.log(`🔄 Current task: ${currentTask.replace('▶️  ', '').trim()}`);
    console.log('');
  }

  // Count successes and failures
  const successCount = (output.match(/✅ SUCCESS:/g) || []).length;
  const failureCount = (output.match(/❌ FAILED:/g) || []).length;
  console.log(`✅ Successful: ${successCount}`);
  console.log(`❌ Failed: ${failureCount}`);
  console.log('');

  // Check if completed
  if (output.includes('FINAL STATISTICS')) {
    console.log('='.repeat(70));
    console.log('✅ BATCH GENERATION COMPLETE!');
    console.log('='.repeat(70));
    console.log('');

    // Extract final stats
    const finalStatsStart = output.lastIndexOf('FINAL STATISTICS');
    const finalStats = output.substring(finalStatsStart);
    console.log(finalStats.substring(0, 1000));
  } else {
    console.log('Status: 🔄 Running...');
  }

  console.log('');
  console.log('='.repeat(70));

  // List recently generated guides
  if (fs.existsSync(GUIDES_DIR)) {
    const guides = fs.readdirSync(GUIDES_DIR)
      .filter(f => f.endsWith('.md') && !f.startsWith('_'))
      .map(f => ({
        name: f,
        mtime: fs.statSync(path.join(GUIDES_DIR, f)).mtime
      }))
      .sort((a, b) => b.mtime.getTime() - a.mtime.getTime())
      .slice(0, 10);

    console.log(`\n📝 Recently generated guides (last 10):`);
    guides.forEach((g, i) => {
      const timeAgo = Math.floor((Date.now() - g.mtime.getTime()) / 60000);
      console.log(`   ${i + 1}. ${g.name.replace('-guide.md', '')} (${timeAgo}m ago)`);
    });
  }
}

checkStatus();
