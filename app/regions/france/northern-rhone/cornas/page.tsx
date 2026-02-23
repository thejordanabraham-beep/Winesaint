import RegionLayout from '@/components/RegionLayout';

export default async function CornasPage() {
  return (
    <RegionLayout
      title="Cornas"
      level="sub-region"
      parentRegion="france/northern-rhone"
      contentFile="cornas-guide.md"
    />
  );
}
