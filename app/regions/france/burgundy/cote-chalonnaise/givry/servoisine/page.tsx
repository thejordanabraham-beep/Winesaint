import RegionLayout from '@/components/RegionLayout';

export default function ServoisinePage() {
  return (
    <RegionLayout
      title="Servoisine"
      level="vineyard"
      parentRegion="france/burgundy/cote-chalonnaise/givry"
      classification="premier-cru"
      contentFile="servoisine-guide.md"
    />
  );
}
