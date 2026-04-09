import RegionLayout from '@/components/RegionLayout';

export default function LesMaraisPage() {
  return (
    <RegionLayout
      title="Les Marais"
      level="vineyard"
      parentRegion="france/burgundy/cote-chalonnaise/montagny"
      classification="premier-cru"
      contentFile="les-marais-guide.md"
    />
  );
}
