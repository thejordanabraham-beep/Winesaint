import RegionLayout from '@/components/RegionLayout';

export default function PreusesPage() {
  return (
    <RegionLayout
      title="Preuses"
      level="vineyard"
      parentRegion="france/burgundy/chablis"
      classification="grand-cru"
      contentFile="preuses-guide.md"
    />
  );
}
