import RegionLayout from '@/components/RegionLayout';

export default function HerrenbergPage() {
  return (
    <RegionLayout
      title="Herrenberg"
      level="vineyard"
      parentRegion="germany/rheinhessen"
      classification="grosses-gewachs"
      contentFile="herrenberg-guide.md"
    />
  );
}
