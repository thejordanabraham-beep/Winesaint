import RegionLayout from '@/components/RegionLayout';

export default function GrumelloPage() {
  return (
    <RegionLayout
      title="Grumello"
      level="sub-region"
      parentRegion="italy/lombardy/valtellina"
      contentFile="grumello-guide.md"
    />
  );
}
