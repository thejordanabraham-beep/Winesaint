import RegionLayout from '@/components/RegionLayout';

export default function GrsignyPage() {
  return (
    <RegionLayout
      title="Grésigny"
      level="vineyard"
      parentRegion="france/burgundy/cote-chalonnaise/rully"
      classification="premier-cru"
      contentFile="gresigny-guide.md"
    />
  );
}
