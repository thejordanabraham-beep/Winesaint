import RegionLayout from '@/components/RegionLayout';

const BAROLO_MGAS = [
  {
    "name": "Albarella",
    "slug": "albarella",
    "classification": "mga"
  },
  {
    "name": "Bablino",
    "slug": "bablino",
    "classification": "mga"
  },
  {
    "name": "Bergeisa",
    "slug": "bergeisa",
    "classification": "mga"
  },
  {
    "name": "Boiolo",
    "slug": "boiolo",
    "classification": "mga"
  },
  {
    "name": "Boschetti",
    "slug": "boschetti",
    "classification": "mga"
  },
  {
    "name": "Bricco delle Viole",
    "slug": "bricco-delle-viole",
    "classification": "mga"
  },
  {
    "name": "Bricco San Giovanni",
    "slug": "bricco-san-giovanni",
    "classification": "mga"
  },
  {
    "name": "Cannubi",
    "slug": "cannubi",
    "classification": "mga"
  },
  {
    "name": "Cannubi Boschis",
    "slug": "cannubi-boschis",
    "classification": "mga"
  },
  {
    "name": "Cannubi Muscatel",
    "slug": "cannubi-muscatel",
    "classification": "mga"
  },
  {
    "name": "Cannubi San Lorenzo",
    "slug": "cannubi-san-lorenzo",
    "classification": "mga"
  },
  {
    "name": "Cannubi Valletta",
    "slug": "cannubi-valletta",
    "classification": "mga"
  },
  {
    "name": "Castellero",
    "slug": "castellero",
    "classification": "mga"
  },
  {
    "name": "Castello",
    "slug": "castello",
    "classification": "mga"
  },
  {
    "name": "Coste di Vergne",
    "slug": "coste-di-vergne",
    "classification": "mga"
  },
  {
    "name": "La Vigna",
    "slug": "la-vigna",
    "classification": "mga"
  },
  {
    "name": "La Volta",
    "slug": "la-volta",
    "classification": "mga"
  },
  {
    "name": "Le Turne",
    "slug": "le-turne",
    "classification": "mga"
  },
  {
    "name": "Lirano",
    "slug": "lirano",
    "classification": "mga"
  },
  {
    "name": "Liste",
    "slug": "liste",
    "classification": "mga"
  },
  {
    "name": "Riva Rocca",
    "slug": "riva-rocca",
    "classification": "mga"
  },
  {
    "name": "Rivassi",
    "slug": "rivassi",
    "classification": "mga"
  },
  {
    "name": "Rive",
    "slug": "rive",
    "classification": "mga"
  },
  {
    "name": "Roggeri",
    "slug": "roggeri",
    "classification": "mga"
  },
  {
    "name": "Ruè",
    "slug": "rue",
    "classification": "mga"
  },
  {
    "name": "San Lorenzo",
    "slug": "san-lorenzo",
    "classification": "mga"
  },
  {
    "name": "San Ponzio",
    "slug": "san-ponzio",
    "classification": "mga"
  },
  {
    "name": "Sarmassa",
    "slug": "sarmassa",
    "classification": "mga"
  },
  {
    "name": "Solanotto",
    "slug": "solanotto",
    "classification": "mga"
  },
  {
    "name": "Terlo",
    "slug": "terlo",
    "classification": "mga"
  },
  {
    "name": "Vignolo",
    "slug": "vignolo",
    "classification": "mga"
  },
  {
    "name": "Zuncai",
    "slug": "zuncai",
    "classification": "mga"
  }
] as const;

export default function BaroloPage() {
  return (
    <RegionLayout
      title="Barolo"
      level="village"
      parentRegion="italy/piedmont/barolo"
      sidebarLinks={BAROLO_MGAS}
      contentFile="barolo-guide.md"
    />
  );
}
