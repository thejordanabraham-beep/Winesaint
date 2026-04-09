import RegionLayout from '@/components/RegionLayout';

export default function DerrirelaTourPage() {
  return (
    <RegionLayout
      title="Derrière la Tour"
      level="vineyard"
      parentRegion="france/burgundy/cote-de-beaune/saint-aubin"
      classification="premier-cru"
      contentFile="derriere-la-tour-guide.md"
    />
  );
}
