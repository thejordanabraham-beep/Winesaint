import RegionLayout from '@/components/RegionLayout';

export default function LesProcsPage() {
  return (
    <RegionLayout
      title="Les Procès"
      level="vineyard"
      parentRegion="france/burgundy/cote-de-nuits/nuits-saint-georges"
      classification="premier-cru"
      contentFile="les-proces-guide.md"
    />
  );
}
