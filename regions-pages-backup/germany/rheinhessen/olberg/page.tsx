import RegionLayout from '@/components/RegionLayout';

export default function lbergPage() {
  return (
    <RegionLayout
      title="Ölberg"
      level="vineyard"
      parentRegion="germany/rheinhessen"
      classification="grosses-gewachs"
      contentFile="olberg-guide.md"
    />
  );
}
