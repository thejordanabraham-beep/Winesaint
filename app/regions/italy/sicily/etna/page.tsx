import RegionLayout from '@/components/RegionLayout';

export default function EtnaPage() {
  return (
    <RegionLayout
      title="Etna"
      level="sub-region"
      parentRegion="italy/sicily"
      contentFile="etna-guide.md"
    />
  );
}
