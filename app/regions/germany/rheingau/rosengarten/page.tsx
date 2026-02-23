import RegionLayout from '@/components/RegionLayout';

export default function RosengartenPage() {
  return (
    <RegionLayout
      title="Rosengarten"
      level="vineyard"
      parentRegion="germany/rheingau"
      classification="grosses-gewachs"
      contentFile="rosengarten-guide.md"
    />
  );
}
