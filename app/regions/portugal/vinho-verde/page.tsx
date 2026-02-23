import RegionLayout from '@/components/RegionLayout';

export default function VinhoVerdePage() {
  return (
    <RegionLayout
      title="Vinho Verde"
      level="region"
      parentRegion="portugal"
      contentFile="vinho-verde-guide.md"
    />
  );
}
