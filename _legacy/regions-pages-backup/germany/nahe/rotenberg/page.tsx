import RegionLayout from '@/components/RegionLayout';

export default function RotenbergPage() {
  return (
    <RegionLayout
      title="Rotenberg"
      level="vineyard"
      parentRegion="germany/nahe"
      classification="grosses-gewachs"
      contentFile="rotenberg-guide.md"
    />
  );
}
