import RegionLayout from '@/components/RegionLayout';

export default function VillagedePernandPage() {
  return (
    <RegionLayout
      title="Village de Pernand"
      level="vineyard"
      parentRegion="france/burgundy/cote-de-beaune/pernand-vergelesses"
      classification="premier-cru"
      contentFile="village-de-pernand-guide.md"
    />
  );
}
