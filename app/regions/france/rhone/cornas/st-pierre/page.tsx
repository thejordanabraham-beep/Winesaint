import RegionLayout from '@/components/RegionLayout';

export default function StPierrePage() {
  return (
    <RegionLayout
      title="St. Pierre"
      level="vineyard"
      parentRegion="france/rhone/cornas"
      classification="climat"
      contentFile="st-pierre-guide.md"
    />
  );
}
