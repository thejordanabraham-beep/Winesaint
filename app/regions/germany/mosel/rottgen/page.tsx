import RegionLayout from '@/components/RegionLayout';

export default function RttgenPage() {
  return (
    <RegionLayout
      title="Röttgen"
      level="vineyard"
      parentRegion="germany/mosel"
      classification="grosses-gewachs"
      contentFile="rottgen-guide.md"
    />
  );
}
