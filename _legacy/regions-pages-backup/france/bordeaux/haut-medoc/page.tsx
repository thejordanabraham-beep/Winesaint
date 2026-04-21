import RegionLayout from '@/components/RegionLayout';

export default function HautMedocPage() {
  return (
    <RegionLayout
      title="Haut-Médoc"
      level="sub-region"
      parentRegion="france/bordeaux"
      contentFile="haut-medoc-guide.md"
    />
  );
}
