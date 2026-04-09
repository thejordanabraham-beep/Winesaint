import RegionLayout from '@/components/RegionLayout';

const VERDUNO_MGAS = [
  {
    "name": "Ascheri",
    "slug": "ascheri",
    "classification": "mga"
  },
  {
    "name": "Boscatto",
    "slug": "boscatto",
    "classification": "mga"
  },
  {
    "name": "Massara",
    "slug": "massara",
    "classification": "mga"
  },
  {
    "name": "Monvigliero",
    "slug": "monvigliero",
    "classification": "mga"
  },
  {
    "name": "San Lorenzo di Verduno",
    "slug": "san-lorenzo-di-verduno",
    "classification": "mga"
  },
  {
    "name": "Serradenari",
    "slug": "serradenari",
    "classification": "mga"
  },
  {
    "name": "Silio",
    "slug": "silio",
    "classification": "mga"
  },
  {
    "name": "Valentino",
    "slug": "valentino",
    "classification": "mga"
  }
] as const;

export default function VerdunoPage() {
  return (
    <RegionLayout
      title="Verduno"
      level="village"
      parentRegion="italy/piedmont/barolo"
      sidebarLinks={VERDUNO_MGAS}
      contentFile="verduno-guide.md"
    />
  );
}
