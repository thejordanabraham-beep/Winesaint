import RegionLayout from '@/components/RegionLayout';

export default function HalenbergPage() {
  return (
    <RegionLayout
      title="Halenberg"
      level="vineyard"
      parentRegion="germany/nahe"
      classification="grosses-gewachs"
      contentFile="halenberg-guide.md"
    />
  );
}
