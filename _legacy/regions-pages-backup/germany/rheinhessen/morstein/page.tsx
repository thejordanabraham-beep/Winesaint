import RegionLayout from '@/components/RegionLayout';

export default function MorsteinPage() {
  return (
    <RegionLayout
      title="Morstein"
      level="vineyard"
      parentRegion="germany/rheinhessen"
      classification="grosses-gewachs"
      contentFile="morstein-guide.md"
    />
  );
}
