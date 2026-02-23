import RegionLayout from '@/components/RegionLayout';

export default function LesBlanchardsPage() {
  return (
    <RegionLayout
      title="Les Blanchards"
      level="vineyard"
      parentRegion="france/burgundy/cote-de-nuits/morey-saint-denis"
      classification="premier-cru"
      contentFile="les-blanchards-guide.md"
    />
  );
}
