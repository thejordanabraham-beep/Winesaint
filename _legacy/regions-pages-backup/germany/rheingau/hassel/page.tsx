import RegionLayout from '@/components/RegionLayout';

export default function HasselPage() {
  return (
    <RegionLayout
      title="Hassel"
      level="vineyard"
      parentRegion="germany/rheingau"
      classification="grosses-gewachs"
      contentFile="hassel-guide.md"
    />
  );
}
