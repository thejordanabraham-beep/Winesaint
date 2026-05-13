import XLSX from 'xlsx';

const EXCEL_FILE = '/Users/jordanabraham/Desktop/WINESAINT_MSTR_RVW.xlsx';
const OUTPUT_FILE = '/Users/jordanabraham/Desktop/WINESAINT_MSTR_RVW_CLEANED.xlsx';
const SHEET_NAME = 'France - Rhone';

// Read the workbook
const workbook = XLSX.readFile(EXCEL_FILE);
const sheet = workbook.Sheets[SHEET_NAME];
const data = XLSX.utils.sheet_to_json(sheet) as Record<string, any>[];

console.log(`Loaded ${data.length} rows from ${SHEET_NAME}\n`);

// Track changes
let changes: string[] = [];
let deletions: number[] = [];
let producerChanges: { index: number; from: string; to: string }[] = [];

// Helper: normalize for comparison
function normalize(s: string): string {
  if (!s) return '';
  return s.normalize('NFD').replace(/[\u0300-\u036f]/g, '').toLowerCase().trim();
}

// Helper: strip pattern from string (case-insensitive)
function stripPattern(str: string, pattern: string): string {
  const regex = new RegExp(pattern, 'gi');
  return str.replace(regex, '').replace(/\s+/g, ' ').trim();
}

// Helper: strip multiple patterns
function stripPatterns(str: string, patterns: string[]): string {
  let result = str;
  for (const pattern of patterns) {
    result = stripPattern(result, pattern);
  }
  // Clean up leading/trailing dashes
  result = result.replace(/^[-\u2013\u2014\s]+|[-\u2013\u2014\s]+$/g, '').trim();
  return result;
}

// CDP patterns to strip
const CDP_PATTERNS = [
  'ch[aâ]teauneuf[- ]?du[- ]?pape',
];

// Patterns for each producer that strips CDP
const STRIP_CDP_PRODUCERS = [
  'Château La Nerthe',
  'Château Mont-Redon',
  'Château Rayas',
  'Château de Beaucastel',
  'Château-Grillet',
  'Clos Saint-Jean',
  'Clos des Papes',
  'Clos du Mont-Olivet',
  'Domaine Charvin',
  'Domaine Henri Bonneau',
  'Domaine du Vieux Télégraphe',
  'Le Clos du Caillou',
  'Le Vieux Donjon',
];

// Producers that keep appellations (multi-appellation producers)
const KEEP_APPELLATION_PRODUCERS = [
  'Domaine Alain Voge',
  'Domaine Bernard Faurie',
  'Domaine Jamet',
  'Domaine de la Janasse', // CDP stripped, but CdR kept
  'Domaine du Coulet',
  'Franck Balthazar',
  'Guillaume Gilles',
  'Johann Michel',
  'M. Sorrel',
  'Maison Chapoutier',
];

// Process each row
for (let i = 0; i < data.length; i++) {
  const row = data[i];
  const producer = row.Producer || '';
  const wineName = row['Wine Name'] || '';
  const normalizedProducer = normalize(producer);

  // ============================================
  // GARBAGE DATA DETECTION - Mark for deletion
  // ============================================

  // Copy/paste error patterns (contain URLs, dates in wrong format, etc.)
  if (wineName.includes('Prefer the old site?') ||
      wineName.includes('Launch →') ||
      /\d+\/\d+\/\d+,\s*\d+:\d+\s*(AM|PM)/.test(wineName)) {
    deletions.push(i);
    changes.push(`DELETE row ${i + 2}: "${producer}" - "${wineName}" (garbage data)`);
    continue;
  }

  // ============================================
  // PRODUCER CHANGES
  // ============================================

  // Château Rayas: Split Fonsalette wines to separate producer
  if (normalizedProducer.includes('rayas') &&
      normalize(wineName).includes('fonsalette')) {
    producerChanges.push({ index: i, from: producer, to: 'Fonsalette' });

    // Also clean the wine name
    let newName = wineName;
    newName = stripPatterns(newName, CDP_PATTERNS);
    newName = stripPattern(newName, 'r[eé]serve');

    // Simplify Fonsalette wine names
    if (normalize(newName).includes('fonsalette syrah')) {
      newName = 'Syrah';
    } else if (normalize(newName).includes('fonsalette blanc')) {
      newName = 'Blanc';
    } else if (normalize(newName) === 'fonsalette' || normalize(newName).includes('cuvee')) {
      newName = '';
    }

    if (newName !== wineName) {
      changes.push(`Row ${i + 2}: "${producer}" → "Fonsalette" | "${wineName}" → "${newName || '(blank)'}"`);
      row['Wine Name'] = newName;
    } else {
      changes.push(`Row ${i + 2}: Producer change only: "${producer}" → "Fonsalette"`);
    }
    row.Producer = 'Fonsalette';
    continue;
  }

  // Domaine du Coulet: Fix underscore in producer name
  if (producer.includes('_')) {
    const fixedProducer = producer.replace(/_/g, ' ');
    producerChanges.push({ index: i, from: producer, to: fixedProducer });
    row.Producer = fixedProducer;
    changes.push(`Row ${i + 2}: Producer fix: "${producer}" → "${fixedProducer}"`);
  }

  // ============================================
  // CHÂTEAU DES TOURS - Delete Brouilly wines
  // ============================================
  if (normalizedProducer.includes('chateau des tours') &&
      normalize(wineName).includes('brouilly')) {
    deletions.push(i);
    changes.push(`DELETE row ${i + 2}: "${producer}" - "${wineName}" (Brouilly - wrong region)`);
    continue;
  }

  // ============================================
  // WINE NAME CLEANUP BY PRODUCER
  // ============================================

  let newWineName = wineName;

  // --- Château La Nerthe ---
  if (normalizedProducer.includes('la nerthe')) {
    newWineName = stripPatterns(wineName, CDP_PATTERNS);
  }

  // --- Château Mont-Redon ---
  else if (normalizedProducer.includes('mont-redon') || normalizedProducer.includes('mont redon')) {
    // Strip CDP only, NOT CdR
    newWineName = stripPatterns(wineName, CDP_PATTERNS);
  }

  // --- Château Rayas (non-Fonsalette) ---
  else if (normalizedProducer.includes('rayas')) {
    newWineName = stripPatterns(wineName, CDP_PATTERNS);
    newWineName = stripPattern(newWineName, 'r[eé]serve');
    // La Pialade stays as cuvée name
  }

  // --- Château de Beaucastel ---
  else if (normalizedProducer.includes('beaucastel')) {
    newWineName = stripPatterns(wineName, CDP_PATTERNS);
    // Coudoulet stays, Hommage à Jacques Perrin stays
  }

  // --- Château-Grillet ---
  else if (normalizedProducer.includes('grillet')) {
    newWineName = stripPatterns(wineName, [
      ...CDP_PATTERNS,
      'ch[aâ]teau[- ]?grillet',
      'c[oô]tes[- ]?du[- ]?rh[oô]ne',
    ]);
    // Keep Pontcin
  }

  // --- Clos Saint-Jean ---
  else if (normalizedProducer.includes('clos saint-jean') || normalizedProducer.includes('clos st-jean')) {
    newWineName = stripPatterns(wineName, CDP_PATTERNS);
    // Fix typo: Santorum → Sanctorum
    newWineName = newWineName.replace(/Santorum/gi, 'Sanctorum');
  }

  // --- Clos des Papes ---
  else if (normalizedProducer.includes('clos des papes')) {
    newWineName = stripPatterns(wineName, CDP_PATTERNS);
  }

  // --- Clos du Mont-Olivet ---
  else if (normalizedProducer.includes('mont-olivet') || normalizedProducer.includes('mont olivet')) {
    newWineName = stripPatterns(wineName, CDP_PATTERNS);
  }

  // --- Domaine Charvin ---
  else if (normalizedProducer.includes('charvin')) {
    // Strip CDP, keep CdR
    newWineName = stripPatterns(wineName, CDP_PATTERNS);
  }

  // --- Domaine Henri Bonneau ---
  else if (normalizedProducer.includes('bonneau')) {
    newWineName = stripPatterns(wineName, CDP_PATTERNS);
    // Réserve des Célestins is a cuvée name, keep it
  }

  // --- Domaine du Vieux Télégraphe ---
  else if (normalizedProducer.includes('telegraphe') || normalizedProducer.includes('télégraphe')) {
    newWineName = stripPatterns(wineName, CDP_PATTERNS);
  }

  // --- Le Clos du Caillou ---
  else if (normalizedProducer.includes('clos du caillou')) {
    // Strip CDP, keep CdR
    newWineName = stripPatterns(wineName, CDP_PATTERNS);
  }

  // --- Le Vieux Donjon ---
  else if (normalizedProducer.includes('vieux donjon')) {
    newWineName = stripPatterns(wineName, CDP_PATTERNS);
  }

  // --- Domaine Bernard Faurie ---
  else if (normalizedProducer.includes('faurie')) {
    // Keep appellations, fix Meal → Méal
    newWineName = wineName.replace(/\bMeal\b/g, 'Méal');
  }

  // --- Domaine de la Janasse ---
  else if (normalizedProducer.includes('janasse')) {
    // Strip CDP, keep CdR
    newWineName = stripPatterns(wineName, CDP_PATTERNS);
    // Fix typo: Meditarranee → Méditerranée
    newWineName = newWineName.replace(/Meditarranee/gi, 'Méditerranée');
  }

  // --- M. Sorrel ---
  else if (normalizedProducer.includes('sorrel')) {
    // Keep appellations, fix Le Greal → Le Gréal
    newWineName = wineName.replace(/Le Greal\b/g, 'Le Gréal');
  }

  // --- Multi-appellation producers: Keep appellations, no changes ---
  // Domaine Alain Voge, Domaine Jamet, Domaine du Coulet,
  // Franck Balthazar, Guillaume Gilles, Johann Michel, Maison Chapoutier
  // (no changes needed)

  // ============================================
  // Apply wine name change if different
  // ============================================
  if (newWineName !== wineName) {
    changes.push(`Row ${i + 2}: "${wineName}" → "${newWineName || '(blank)'}"`);
    row['Wine Name'] = newWineName;
  }
}

// ============================================
// Remove deleted rows (in reverse order to preserve indices)
// ============================================
deletions.sort((a, b) => b - a);
for (const idx of deletions) {
  data.splice(idx, 1);
}

// ============================================
// Output summary
// ============================================
console.log('=== CLEANUP SUMMARY ===\n');
console.log(`Total rows processed: ${data.length + deletions.length}`);
console.log(`Rows deleted: ${deletions.length}`);
console.log(`Wine name changes: ${changes.filter(c => !c.startsWith('DELETE')).length}`);
console.log(`Producer changes: ${producerChanges.length}`);
console.log(`Final row count: ${data.length}\n`);

console.log('=== CHANGES ===\n');
changes.forEach(c => console.log(c));

// ============================================
// Write output file
// ============================================
const newSheet = XLSX.utils.json_to_sheet(data);
workbook.Sheets[SHEET_NAME] = newSheet;

XLSX.writeFile(workbook, OUTPUT_FILE);
console.log(`\n=== OUTPUT ===`);
console.log(`Cleaned file written to: ${OUTPUT_FILE}`);
