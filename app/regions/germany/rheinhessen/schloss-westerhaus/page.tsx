import RegionLayout from '@/components/RegionLayout';

export default function SchlossWesterhausPage() {
  return (
    <RegionLayout
      title="Schloss Westerhaus"
      level="vineyard"
      parentRegion="germany/rheinhessen"
      classification="grosses-gewachs"
      contentFile="schloss-westerhaus-guide.md"
    />
  );
}
