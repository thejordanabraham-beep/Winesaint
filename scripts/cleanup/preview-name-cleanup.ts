import * as XLSX from 'xlsx';

const EXCEL_FILE = '/Users/jordanabraham/Desktop/WINESAINT_MSTR_RVW.xlsx';
const SHEET_NAME = process.argv[2] || 'France - Rhone';

const workbook = XLSX.readFile(EXCEL_FILE);
const sheet = workbook.Sheets[SHEET_NAME];
const data = XLSX.utils.sheet_to_json(sheet) as Record<string, any>[];

// Appellations to strip (case-insensitive)
const appellations = [
  "châteauneuf-du-pape",
  "chateauneuf-du-pape",
  "châteauneuf du pape",
  "chateauneuf du pape",
  "côtes du rhône",
  "cotes du rhone",
  "côtes-du-rhône",
  "cotes-du-rhone",
  "côte-rôtie",
  "cote-rotie",
  "côte rôtie",
  "cote rotie",
  "hermitage",
  "crozes-hermitage",
  "saint-joseph",
  "st-joseph",
  "cornas",
  "condrieu",
  "château-grillet",
  "chateau-grillet",
  "château grillet",
  "chateau grillet",
  "saint-péray",
  "saint-peray",
  "st-péray",
  "st-peray",
  "vacqueyras",
  "gigondas",
  "lirac",
  "tavel",
  "rasteau",
  "vinsobres",
  "beaumes-de-venise",
  "beaumes de venise",
  "muscat de beaumes-de-venise",
];

// Words to strip
const stripWords = [
  "réservé",
  "réserve",
  "reserve",
  "reserved",
];

function cleanWineName(name: string): string {
  if (!name) return "";
  let cleaned = name;

  // Strip appellations
  for (const app of appellations) {
    const regex = new RegExp(app, "gi");
    cleaned = cleaned.replace(regex, "");
  }

  // Strip reserve words
  for (const word of stripWords) {
    const regex = new RegExp(`\\b${word}\\b`, "gi");
    cleaned = cleaned.replace(regex, "");
  }

  // Clean up whitespace and dashes
  cleaned = cleaned.replace(/\s+/g, " ").trim();
  cleaned = cleaned.replace(/^[-–—]+|[-–—]+$/g, "").trim();

  return cleaned;
}

// Show unique transformations grouped by producer
const transformations = new Map<string, { original: string; cleaned: string; producer: string; count: number }>();

for (const r of data) {
  const original = r["Wine Name"] || "";
  const cleaned = cleanWineName(original);
  const key = `${r.Producer}|||${original}|||${cleaned}`;

  if (!transformations.has(key)) {
    transformations.set(key, {
      original,
      cleaned,
      producer: r.Producer,
      count: 0
    });
  }
  transformations.get(key)!.count++;
}

console.log(`=== WINE NAME TRANSFORMATIONS for ${SHEET_NAME} ===\n`);

// Sort by producer
const sorted = [...transformations.values()].sort((a, b) =>
  a.producer.localeCompare(b.producer) || a.original.localeCompare(b.original)
);

let currentProducer = "";
for (const t of sorted) {
  if (t.producer !== currentProducer) {
    console.log(`\n${t.producer}:`);
    currentProducer = t.producer;
  }
  const cleanedDisplay = t.cleaned || "(blank)";
  console.log(`  "${t.original}" → "${cleanedDisplay}" (${t.count})`);
}

// Summary
const blanks = sorted.filter(t => !t.cleaned).length;
console.log(`\n=== SUMMARY ===`);
console.log(`Total unique wine names: ${sorted.length}`);
console.log(`Will become blank: ${blanks}`);
console.log(`Will have a name: ${sorted.length - blanks}`);
