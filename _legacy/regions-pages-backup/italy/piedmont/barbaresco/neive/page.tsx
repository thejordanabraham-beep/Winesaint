import RegionLayout from '@/components/RegionLayout';

const NEIVE_MGAS = [
  {
    "name": "Albesani",
    "slug": "albesani",
    "classification": "mga"
  },
  {
    "name": "Basarin",
    "slug": "basarin",
    "classification": "mga"
  },
  {
    "name": "Bordini",
    "slug": "bordini",
    "classification": "mga"
  },
  {
    "name": "Bric Micca",
    "slug": "bric-micca",
    "classification": "mga"
  },
  {
    "name": "Bricco di Neive",
    "slug": "bricco-di-neive",
    "classification": "mga"
  },
  {
    "name": "Cottà",
    "slug": "cotta",
    "classification": "mga"
  },
  {
    "name": "Currà",
    "slug": "curra",
    "classification": "mga"
  },
  {
    "name": "Fausoni",
    "slug": "fausoni",
    "classification": "mga"
  },
  {
    "name": "Gallina",
    "slug": "gallina",
    "classification": "mga"
  },
  {
    "name": "Manzola",
    "slug": "manzola",
    "classification": "mga"
  },
  {
    "name": "San Giuliano",
    "slug": "san-giuliano",
    "classification": "mga"
  },
  {
    "name": "San Stunet",
    "slug": "san-stunet",
    "classification": "mga"
  },
  {
    "name": "Serraboella",
    "slug": "serraboella",
    "classification": "mga"
  },
  {
    "name": "Starderi",
    "slug": "starderi",
    "classification": "mga"
  }
] as const;

export default function NeivePage() {
  return (
    <RegionLayout
      title="Neive"
      level="village"
      parentRegion="italy/piedmont/barbaresco"
      sidebarLinks={NEIVE_MGAS}
      contentFile="neive-guide.md"
    />
  );
}
