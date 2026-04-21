import RegionLayout from '@/components/RegionLayout';

export default function PassetempsPage() {
  return (
    <RegionLayout
      title="Passetemps"
      level="vineyard"
      parentRegion="france/burgundy/cote-de-beaune/santenay"
      classification="premier-cru"
      contentFile="passetemps-guide.md"
    />
  );
}
