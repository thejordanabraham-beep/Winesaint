import RegionLayout from '@/components/RegionLayout';

export default function BeaurepairePage() {
  return (
    <RegionLayout
      title="Beaurepaire"
      level="vineyard"
      parentRegion="france/burgundy/cote-de-beaune/santenay"
      classification="premier-cru"
      contentFile="beaurepaire-guide.md"
    />
  );
}
