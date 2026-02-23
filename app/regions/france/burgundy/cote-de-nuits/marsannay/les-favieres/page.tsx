import RegionLayout from '@/components/RegionLayout';

export default function LesFaviresPage() {
  return (
    <RegionLayout
      title="Les Favières"
      level="vineyard"
      parentRegion="france/burgundy/cote-de-nuits/marsannay"
      classification="premier-cru"
      contentFile="les-favieres-guide.md"
    />
  );
}
