import RegionLayout from '@/components/RegionLayout';

export default function ListracMedocPage() {
  return (
    <RegionLayout
      title="Listrac-Médoc"
      level="sub-region"
      parentRegion="france/bordeaux"
      contentFile="listrac-medoc-guide.md"
    />
  );
}
