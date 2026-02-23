import RegionLayout from '@/components/RegionLayout';

export default function PessacLeognanPage() {
  return (
    <RegionLayout
      title="Pessac-Léognan"
      level="sub-region"
      parentRegion="france/bordeaux"
      contentFile="pessac-leognan-guide.md"
    />
  );
}
