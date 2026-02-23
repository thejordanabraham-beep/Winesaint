import RegionLayout from '@/components/RegionLayout';

const SERRALUNGA_D_ALBA_MGAS = [
  {
    "name": "Arione",
    "slug": "arione",
    "classification": "mga"
  },
  {
    "name": "Badarina",
    "slug": "badarina",
    "classification": "mga"
  },
  {
    "name": "Baudana",
    "slug": "baudana",
    "classification": "mga"
  },
  {
    "name": "Boscareto",
    "slug": "boscareto",
    "classification": "mga"
  },
  {
    "name": "Cappallotto",
    "slug": "cappallotto",
    "classification": "mga"
  },
  {
    "name": "Cerretta",
    "slug": "cerretta",
    "classification": "mga"
  },
  {
    "name": "Falletto",
    "slug": "falletto",
    "classification": "mga"
  },
  {
    "name": "Fontanafredda",
    "slug": "fontanafredda",
    "classification": "mga"
  },
  {
    "name": "Francia",
    "slug": "francia",
    "classification": "mga"
  },
  {
    "name": "Gabutti",
    "slug": "gabutti",
    "classification": "mga"
  },
  {
    "name": "Lazzarito",
    "slug": "lazzarito",
    "classification": "mga"
  },
  {
    "name": "Marenca",
    "slug": "marenca",
    "classification": "mga"
  },
  {
    "name": "Margheria",
    "slug": "margheria",
    "classification": "mga"
  },
  {
    "name": "Montanello",
    "slug": "montanello",
    "classification": "mga"
  },
  {
    "name": "Neirane",
    "slug": "neirane",
    "classification": "mga"
  },
  {
    "name": "Ornato",
    "slug": "ornato",
    "classification": "mga"
  },
  {
    "name": "Parafada",
    "slug": "parafada",
    "classification": "mga"
  },
  {
    "name": "Piantà",
    "slug": "pianta",
    "classification": "mga"
  },
  {
    "name": "Prapò",
    "slug": "prapo",
    "classification": "mga"
  },
  {
    "name": "Serra dei Turchi",
    "slug": "serra-dei-turchi",
    "classification": "mga"
  },
  {
    "name": "Teodoro",
    "slug": "teodoro",
    "classification": "mga"
  },
  {
    "name": "Treturne",
    "slug": "treturne",
    "classification": "mga"
  },
  {
    "name": "Vignarionda",
    "slug": "vignarionda",
    "classification": "mga"
  }
] as const;

export default function SerralungadAlbaPage() {
  return (
    <RegionLayout
      title="Serralunga d'Alba"
      level="village"
      parentRegion="italy/piedmont/barolo"
      sidebarLinks={SERRALUNGA_D_ALBA_MGAS}
      contentFile="serralunga-d-alba-guide.md"
    />
  );
}
