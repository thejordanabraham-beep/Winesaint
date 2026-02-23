import RegionLayout from '@/components/RegionLayout';

export default function LesFourneauxPage() {
  return (
    <RegionLayout
      title="Les Fourneaux"
      level="vineyard"
      parentRegion="france/burgundy/chablis"
      classification="premier-cru"
      contentFile="les-fourneaux-guide.md"
    />
  );
}
