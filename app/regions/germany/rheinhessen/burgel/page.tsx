import RegionLayout from '@/components/RegionLayout';

export default function BrgelPage() {
  return (
    <RegionLayout
      title="Bürgel"
      level="vineyard"
      parentRegion="germany/rheinhessen"
      classification="grosses-gewachs"
      contentFile="burgel-guide.md"
    />
  );
}
