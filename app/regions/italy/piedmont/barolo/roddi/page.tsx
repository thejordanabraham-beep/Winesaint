import RegionLayout from '@/components/RegionLayout';

const RODDI_MGAS = [
  {
    "name": "Bricco Ambrogio",
    "slug": "bricco-ambrogio",
    "classification": "mga"
  },
  {
    "name": "Zoccolaio",
    "slug": "zoccolaio",
    "classification": "mga"
  }
] as const;

export default function RoddiPage() {
  return (
    <RegionLayout
      title="Roddi"
      level="village"
      parentRegion="italy/piedmont/barolo"
      sidebarLinks={RODDI_MGAS}
      contentFile="roddi-guide.md"
    />
  );
}
