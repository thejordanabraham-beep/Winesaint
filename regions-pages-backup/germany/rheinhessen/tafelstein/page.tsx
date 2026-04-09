import RegionLayout from '@/components/RegionLayout';

export default function TafelsteinPage() {
  return (
    <RegionLayout
      title="Tafelstein"
      level="vineyard"
      parentRegion="germany/rheinhessen"
      classification="grosses-gewachs"
      contentFile="tafelstein-guide.md"
    />
  );
}
