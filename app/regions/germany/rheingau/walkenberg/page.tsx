import RegionLayout from '@/components/RegionLayout';

export default function WalkenbergPage() {
  return (
    <RegionLayout
      title="Walkenberg"
      level="vineyard"
      parentRegion="germany/rheingau"
      classification="grosses-gewachs"
      contentFile="walkenberg-guide.md"
    />
  );
}
