import RegionLayout from '@/components/RegionLayout';

export default function ChteauThbaudPage() {
  return (
    <RegionLayout
      title="Château-Thébaud"
      level="vineyard"
      parentRegion="france/loire/muscadet"
      classification="cru-communal"
      contentFile="chateau-thebaud-guide.md"
    />
  );
}
