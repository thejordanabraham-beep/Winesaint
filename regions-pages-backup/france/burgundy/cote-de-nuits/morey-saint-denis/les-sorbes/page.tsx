import RegionLayout from '@/components/RegionLayout';

export default function LesSorbsPage() {
  return (
    <RegionLayout
      title="Les Sorbès"
      level="vineyard"
      parentRegion="france/burgundy/cote-de-nuits/morey-saint-denis"
      classification="premier-cru"
      contentFile="les-sorbes-guide.md"
    />
  );
}
