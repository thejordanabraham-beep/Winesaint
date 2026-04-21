import RegionLayout from '@/components/RegionLayout';

export default function TrentinoPage() {
  return (
    <RegionLayout
      title="Trentino"
      level="sub-region"
      parentRegion="italy/trentino-alto-adige"
      contentFile="trentino-guide.md"
    />
  );
}
