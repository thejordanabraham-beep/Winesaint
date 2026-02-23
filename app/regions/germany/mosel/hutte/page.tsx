import RegionLayout from '@/components/RegionLayout';

export default function HttePage() {
  return (
    <RegionLayout
      title="Hütte"
      level="vineyard"
      parentRegion="germany/mosel"
      classification="grosses-gewachs"
      contentFile="hutte-guide.md"
    />
  );
}
