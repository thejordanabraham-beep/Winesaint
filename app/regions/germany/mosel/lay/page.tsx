import RegionLayout from '@/components/RegionLayout';

export default function LayPage() {
  return (
    <RegionLayout
      title="Lay"
      level="vineyard"
      parentRegion="germany/mosel"
      classification="grosses-gewachs"
      contentFile="lay-guide.md"
    />
  );
}
