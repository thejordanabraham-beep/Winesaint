import RegionLayout from '@/components/RegionLayout';

export default function StrombergPage() {
  return (
    <RegionLayout
      title="Stromberg"
      level="vineyard"
      parentRegion="germany/nahe"
      classification="grosses-gewachs"
      contentFile="stromberg-guide.md"
    />
  );
}
