import RegionLayout from '@/components/RegionLayout';

export default function DavenayPage() {
  return (
    <RegionLayout
      title="Davenay"
      level="vineyard"
      parentRegion="france/burgundy/cote-chalonnaise/montagny"
      classification="premier-cru"
      contentFile="davenay-guide.md"
    />
  );
}
