import RegionLayout from '@/components/RegionLayout';

const DIANO_D_ALBA_MGAS = [
  {
    "name": "Coste di Rose",
    "slug": "coste-di-rose",
    "classification": "mga"
  },
  {
    "name": "Drucà",
    "slug": "druca",
    "classification": "mga"
  },
  {
    "name": "Gallaretto",
    "slug": "gallaretto",
    "classification": "mga"
  },
  {
    "name": "Sorano",
    "slug": "sorano",
    "classification": "mga"
  }
] as const;

export default function DianodAlbaPage() {
  return (
    <RegionLayout
      title="Diano d'Alba"
      level="village"
      parentRegion="italy/piedmont/barolo"
      sidebarLinks={DIANO_D_ALBA_MGAS}
      contentFile="diano-d-alba-guide.md"
    />
  );
}
