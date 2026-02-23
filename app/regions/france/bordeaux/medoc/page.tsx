import RegionLayout from '@/components/RegionLayout';

export default function MedocPage() {
  return (
    <RegionLayout
      title="Médoc"
      level="sub-region"
      parentRegion="france/bordeaux"
      contentFile="medoc-guide.md"
    />
  );
}
