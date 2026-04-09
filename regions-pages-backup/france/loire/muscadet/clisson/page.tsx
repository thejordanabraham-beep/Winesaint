import RegionLayout from '@/components/RegionLayout';

export default function ClissonPage() {
  return (
    <RegionLayout
      title="Clisson"
      level="vineyard"
      parentRegion="france/loire/muscadet"
      classification="cru-communal"
      contentFile="clisson-guide.md"
    />
  );
}
