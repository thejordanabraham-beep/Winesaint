import RegionLayout from '@/components/RegionLayout';

export default function EnCaradeuxPage() {
  return (
    <RegionLayout
      title="En Caradeux"
      level="vineyard"
      parentRegion="france/burgundy/cote-de-beaune/pernand-vergelesses"
      classification="premier-cru"
      contentFile="en-caradeux-guide.md"
    />
  );
}
