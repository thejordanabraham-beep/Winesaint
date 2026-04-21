import RegionLayout from '@/components/RegionLayout';

const CORNAS_CLIMATS = [
  {
    "name": "Chaillot",
    "slug": "chaillot",
    "classification": "climat"
  },
  {
    "name": "Champelrose",
    "slug": "champelrose",
    "classification": "climat"
  },
  {
    "name": "Combe",
    "slug": "combe",
    "classification": "climat"
  },
  {
    "name": "Grande Côte",
    "slug": "grande-cote",
    "classification": "climat"
  },
  {
    "name": "Jouvet",
    "slug": "jouvet",
    "classification": "climat"
  },
  {
    "name": "La Côte",
    "slug": "la-cote",
    "classification": "climat"
  },
  {
    "name": "La Geynale",
    "slug": "la-geynale",
    "classification": "climat"
  },
  {
    "name": "La Lègre",
    "slug": "la-legre",
    "classification": "climat"
  },
  {
    "name": "Le Coulet",
    "slug": "le-coulet",
    "classification": "climat"
  },
  {
    "name": "Les Arlettes",
    "slug": "les-arlettes",
    "classification": "climat"
  },
  {
    "name": "Les Côtes",
    "slug": "les-cotes",
    "classification": "climat"
  },
  {
    "name": "Les Eygas",
    "slug": "les-eygas",
    "classification": "climat"
  },
  {
    "name": "Les Mazards",
    "slug": "les-mazards",
    "classification": "climat"
  },
  {
    "name": "Les Saveaux",
    "slug": "les-saveaux",
    "classification": "climat"
  },
  {
    "name": "Patou",
    "slug": "patou",
    "classification": "climat"
  },
  {
    "name": "Petite Côte",
    "slug": "petite-cote",
    "classification": "climat"
  },
  {
    "name": "Peupliers",
    "slug": "peupliers",
    "classification": "climat"
  },
  {
    "name": "Pied la Vigne",
    "slug": "pied-la-vigne",
    "classification": "climat"
  },
  {
    "name": "Reynard",
    "slug": "reynard",
    "classification": "climat"
  },
  {
    "name": "Ruchets",
    "slug": "ruchets",
    "classification": "climat"
  },
  {
    "name": "Sabarotte",
    "slug": "sabarotte",
    "classification": "climat"
  },
  {
    "name": "Sauman",
    "slug": "sauman",
    "classification": "climat"
  },
  {
    "name": "St. Pierre",
    "slug": "st-pierre",
    "classification": "climat"
  },
  {
    "name": "Tézier",
    "slug": "tezier",
    "classification": "climat"
  }
] as const;

export default function CornasPage() {
  return (
    <RegionLayout
      title="Cornas"
      level="sub-region"
      parentRegion="france/rhone"
      sidebarLinks={CORNAS_CLIMATS}
      contentFile="cornas-guide.md"
    />
  );
}
