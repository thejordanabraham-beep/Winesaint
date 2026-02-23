import RegionLayout from '@/components/RegionLayout';

const GRINZANE_CAVOUR_MGAS = [
  {
    "name": "Gustava",
    "slug": "gustava",
    "classification": "mga"
  }
] as const;

export default function GrinzaneCavourPage() {
  return (
    <RegionLayout
      title="Grinzane Cavour"
      level="village"
      parentRegion="italy/piedmont/barolo"
      sidebarLinks={GRINZANE_CAVOUR_MGAS}
      contentFile="grinzane-cavour-guide.md"
    />
  );
}
