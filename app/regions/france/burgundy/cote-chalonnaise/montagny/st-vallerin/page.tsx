import RegionLayout from '@/components/RegionLayout';

export default function StVallerinPage() {
  return (
    <RegionLayout
      title="St Vallerin"
      level="vineyard"
      parentRegion="france/burgundy/cote-chalonnaise/montagny"
      classification="premier-cru"
      contentFile="st-vallerin-guide.md"
    />
  );
}
