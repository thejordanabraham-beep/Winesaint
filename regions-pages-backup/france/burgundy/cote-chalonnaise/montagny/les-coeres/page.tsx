import RegionLayout from '@/components/RegionLayout';

export default function LesCoresPage() {
  return (
    <RegionLayout
      title="Les Coères"
      level="vineyard"
      parentRegion="france/burgundy/cote-chalonnaise/montagny"
      classification="premier-cru"
      contentFile="les-coeres-guide.md"
    />
  );
}
