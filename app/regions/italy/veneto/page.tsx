import RegionLayout from '@/components/RegionLayout';

export default function VenetoPage() {
  return (
    <RegionLayout
      title="Veneto"
      level="region"
      parentRegion="italy"
      contentFile="veneto-guide.md"
    />
  );
}
