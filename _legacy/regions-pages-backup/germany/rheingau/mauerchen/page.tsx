import RegionLayout from '@/components/RegionLayout';

export default function MuerchenPage() {
  return (
    <RegionLayout
      title="Mäuerchen"
      level="vineyard"
      parentRegion="germany/rheingau"
      classification="grosses-gewachs"
      contentFile="mauerchen-guide.md"
    />
  );
}
