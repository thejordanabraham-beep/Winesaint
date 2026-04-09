import RegionLayout from '@/components/RegionLayout';

export default function RosenbergPage() {
  return (
    <RegionLayout
      title="Rosenberg"
      level="vineyard"
      parentRegion="germany/mosel"
      classification="grosses-gewachs"
      contentFile="rosenberg-guide.md"
    />
  );
}
