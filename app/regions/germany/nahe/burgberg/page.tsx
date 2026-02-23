import RegionLayout from '@/components/RegionLayout';

export default function BurgbergPage() {
  return (
    <RegionLayout
      title="Burgberg"
      level="vineyard"
      parentRegion="germany/nahe"
      classification="grosses-gewachs"
      contentFile="burgberg-guide.md"
    />
  );
}
