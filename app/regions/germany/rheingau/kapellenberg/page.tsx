import RegionLayout from '@/components/RegionLayout';

export default function KapellenbergPage() {
  return (
    <RegionLayout
      title="Kapellenberg"
      level="vineyard"
      parentRegion="germany/rheingau"
      classification="grosses-gewachs"
      contentFile="kapellenberg-guide.md"
    />
  );
}
