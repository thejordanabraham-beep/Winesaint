import RegionLayout from '@/components/RegionLayout';

export default function GravesPage() {
  return (
    <RegionLayout
      title="Graves"
      level="sub-region"
      parentRegion="france/bordeaux/left-bank"
      contentFile="graves-guide.md"
    />
  );
}
