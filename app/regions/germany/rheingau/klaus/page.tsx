import RegionLayout from '@/components/RegionLayout';

export default function KlausPage() {
  return (
    <RegionLayout
      title="Klaus"
      level="vineyard"
      parentRegion="germany/rheingau"
      classification="grosses-gewachs"
      contentFile="klaus-guide.md"
    />
  );
}
