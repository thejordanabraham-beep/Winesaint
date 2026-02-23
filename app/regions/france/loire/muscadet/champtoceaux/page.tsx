import RegionLayout from '@/components/RegionLayout';

export default function ChamptoceauxPage() {
  return (
    <RegionLayout
      title="Champtoceaux"
      level="vineyard"
      parentRegion="france/loire/muscadet"
      classification="cru-communal"
      contentFile="champtoceaux-guide.md"
    />
  );
}
