import RegionLayout from '@/components/RegionLayout';

export default function LiguriaPage() {
  return (
    <RegionLayout
      title="Liguria"
      level="region"
      parentRegion="italy"
      contentFile="liguria-guide.md"
    />
  );
}
