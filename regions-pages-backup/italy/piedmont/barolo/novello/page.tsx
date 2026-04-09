import RegionLayout from '@/components/RegionLayout';

const NOVELLO_MGAS = [
  {
    "name": "Brea",
    "slug": "brea",
    "classification": "mga"
  },
  {
    "name": "Breri",
    "slug": "breri",
    "classification": "mga"
  },
  {
    "name": "Bricco Cogni",
    "slug": "bricco-cogni",
    "classification": "mga"
  },
  {
    "name": "Cerviano-Merli",
    "slug": "cerviano-merli",
    "classification": "mga"
  },
  {
    "name": "Corini-Pallaretta",
    "slug": "corini-pallaretta",
    "classification": "mga"
  },
  {
    "name": "Panerole",
    "slug": "panerole",
    "classification": "mga"
  },
  {
    "name": "Ravera",
    "slug": "ravera",
    "classification": "mga"
  },
  {
    "name": "Raviole",
    "slug": "raviole",
    "classification": "mga"
  },
  {
    "name": "Sottocastello di Novello",
    "slug": "sottocastello-di-novello",
    "classification": "mga"
  }
] as const;

export default function NovelloPage() {
  return (
    <RegionLayout
      title="Novello"
      level="village"
      parentRegion="italy/piedmont/barolo"
      sidebarLinks={NOVELLO_MGAS}
      contentFile="novello-guide.md"
    />
  );
}
