import RegionLayout from '@/components/RegionLayout';

export default function LandskronePage() {
  return (
    <RegionLayout
      title="Landskrone"
      level="vineyard"
      parentRegion="germany/ahr"
      classification="grosses-gewachs"
      contentFile="landskrone-guide.md"
    />
  );
}
