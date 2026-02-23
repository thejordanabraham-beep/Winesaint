import RegionLayout from '@/components/RegionLayout';

export default function GoulainePage() {
  return (
    <RegionLayout
      title="Goulaine"
      level="vineyard"
      parentRegion="france/loire/muscadet"
      classification="cru-communal"
      contentFile="goulaine-guide.md"
    />
  );
}
