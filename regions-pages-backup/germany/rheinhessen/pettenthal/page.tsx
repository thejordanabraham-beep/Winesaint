import RegionLayout from '@/components/RegionLayout';

export default function PettenthalPage() {
  return (
    <RegionLayout
      title="Pettenthal"
      level="vineyard"
      parentRegion="germany/rheinhessen"
      classification="grosses-gewachs"
      contentFile="pettenthal-guide.md"
    />
  );
}
