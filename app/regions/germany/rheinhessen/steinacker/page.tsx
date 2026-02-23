import RegionLayout from '@/components/RegionLayout';

export default function SteinackerPage() {
  return (
    <RegionLayout
      title="Steinacker"
      level="vineyard"
      parentRegion="germany/rheinhessen"
      classification="grosses-gewachs"
      contentFile="steinacker-guide.md"
    />
  );
}
