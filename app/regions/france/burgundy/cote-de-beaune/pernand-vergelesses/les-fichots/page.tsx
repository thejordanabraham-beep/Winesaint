import RegionLayout from '@/components/RegionLayout';

export default function LesFichotsPage() {
  return (
    <RegionLayout
      title="Les Fichots"
      level="vineyard"
      parentRegion="france/burgundy/cote-de-beaune/pernand-vergelesses"
      classification="premier-cru"
      contentFile="les-fichots-guide.md"
    />
  );
}
