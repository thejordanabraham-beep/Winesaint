import RegionLayout from '@/components/RegionLayout';

export default function MedocPage() {
  return (
    <RegionLayout
      title="Médoc"
      level="sub-region"
      parentRegion="france/bordeaux/left-bank"
      contentFile="medoc-guide.md"
    />
  );
}
