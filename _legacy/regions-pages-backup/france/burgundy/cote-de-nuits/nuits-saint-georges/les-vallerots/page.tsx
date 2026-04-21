import RegionLayout from '@/components/RegionLayout';

export default function LesVallerotsPage() {
  return (
    <RegionLayout
      title="Les Vallerots"
      level="vineyard"
      parentRegion="france/burgundy/cote-de-nuits/nuits-saint-georges"
      classification="premier-cru"
      contentFile="les-vallerots-guide.md"
    />
  );
}
