import RegionLayout from '@/components/RegionLayout';

export default function LesCheneveryPage() {
  return (
    <RegionLayout
      title="Les Chenevery"
      level="vineyard"
      parentRegion="france/burgundy/cote-de-nuits/morey-saint-denis"
      classification="premier-cru"
      contentFile="les-chenevery-guide.md"
    />
  );
}
