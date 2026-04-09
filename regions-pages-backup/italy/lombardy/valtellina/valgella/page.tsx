import RegionLayout from '@/components/RegionLayout';

export default function ValgellaPage() {
  return (
    <RegionLayout
      title="Valgella"
      level="sub-region"
      parentRegion="italy/lombardy/valtellina"
      contentFile="valgella-guide.md"
    />
  );
}
