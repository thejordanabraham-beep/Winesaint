import RegionLayout from '@/components/RegionLayout';

export default function ClosFaubardPage() {
  return (
    <RegionLayout
      title="Clos Faubard"
      level="vineyard"
      parentRegion="france/burgundy/cote-de-beaune/santenay"
      classification="premier-cru"
      contentFile="clos-faubard-guide.md"
    />
  );
}
