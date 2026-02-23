import RegionLayout from '@/components/RegionLayout';

export default function GorgesPage() {
  return (
    <RegionLayout
      title="Gorges"
      level="vineyard"
      parentRegion="france/loire/muscadet"
      classification="cru-communal"
      contentFile="gorges-guide.md"
    />
  );
}
