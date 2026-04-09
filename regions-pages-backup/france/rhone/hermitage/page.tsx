import RegionLayout from '@/components/RegionLayout';

const HERMITAGE_CLIMATS = [
  {
    "name": "Chante Alouette",
    "slug": "chante-alouette",
    "classification": "climat"
  },
  {
    "name": "Doignières et Torras",
    "slug": "doignieres-et-torras",
    "classification": "climat"
  },
  {
    "name": "L'Hermite",
    "slug": "l-hermite",
    "classification": "climat"
  },
  {
    "name": "L'Homme",
    "slug": "l-homme",
    "classification": "climat"
  },
  {
    "name": "La Chapelle",
    "slug": "la-chapelle",
    "classification": "climat"
  },
  {
    "name": "La Croix",
    "slug": "la-croix",
    "classification": "climat"
  },
  {
    "name": "La Pierelle",
    "slug": "la-pierelle",
    "classification": "climat"
  },
  {
    "name": "Le Méal",
    "slug": "le-meal",
    "classification": "climat"
  },
  {
    "name": "Les Beaumes",
    "slug": "les-beaumes",
    "classification": "climat"
  },
  {
    "name": "Les Bessards",
    "slug": "les-bessards",
    "classification": "climat"
  },
  {
    "name": "Les Doignières",
    "slug": "les-doignieres",
    "classification": "climat"
  },
  {
    "name": "Les Grandes Vignes",
    "slug": "les-grandes-vignes",
    "classification": "climat"
  },
  {
    "name": "Les Greffieux",
    "slug": "les-greffieux",
    "classification": "climat"
  },
  {
    "name": "Les Murets",
    "slug": "les-murets",
    "classification": "climat"
  },
  {
    "name": "Les Rocoules",
    "slug": "les-rocoules",
    "classification": "climat"
  },
  {
    "name": "Les Vercandières",
    "slug": "les-vercandieres",
    "classification": "climat"
  },
  {
    "name": "Maison Blanche",
    "slug": "maison-blanche",
    "classification": "climat"
  },
  {
    "name": "Péléat",
    "slug": "peleat",
    "classification": "climat"
  },
  {
    "name": "Plantières",
    "slug": "plantieres",
    "classification": "climat"
  },
  {
    "name": "Torras et les Garennes",
    "slug": "torras-et-les-garennes",
    "classification": "climat"
  },
  {
    "name": "Varogne",
    "slug": "varogne",
    "classification": "climat"
  }
] as const;

export default function HermitagePage() {
  return (
    <RegionLayout
      title="Hermitage"
      level="sub-region"
      parentRegion="france/rhone"
      sidebarLinks={HERMITAGE_CLIMATS}
      contentFile="hermitage-guide.md"
    />
  );
}
