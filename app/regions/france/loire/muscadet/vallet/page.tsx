import RegionLayout from '@/components/RegionLayout';

export default function ValletPage() {
  return (
    <RegionLayout
      title="Vallet"
      level="vineyard"
      parentRegion="france/loire/muscadet"
      classification="cru-communal"
      contentFile="vallet-guide.md"
    />
  );
}
