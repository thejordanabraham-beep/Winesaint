import RegionLayout from '@/components/RegionLayout';

export default function BonnezeauxPage() {
  return (
    <RegionLayout
      title="Bonnezeaux"
      level="village"
      parentRegion="france/loire-valley/anjou-saumur"
      contentFile="bonnezeaux-guide.md"
    />
  );
}
