import RegionLayout from '@/components/RegionLayout';

export default function LesCorbaisonsPage() {
  return (
    <RegionLayout
      title="Les Corbaisons"
      level="vineyard"
      parentRegion="france/burgundy/cote-chalonnaise/montagny"
      classification="premier-cru"
      contentFile="les-corbaisons-guide.md"
    />
  );
}
