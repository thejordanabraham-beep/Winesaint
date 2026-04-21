import RegionLayout from '@/components/RegionLayout';

export default function GrafenbergPage() {
  return (
    <RegionLayout
      title="Grafenberg"
      level="vineyard"
      parentRegion="germany/mosel"
      classification="grosses-gewachs"
      contentFile="grafenberg-guide.md"
    />
  );
}
