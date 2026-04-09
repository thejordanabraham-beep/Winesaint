import RegionLayout from '@/components/RegionLayout';

export default function LeMalPage() {
  return (
    <RegionLayout
      title="Le Méal"
      level="vineyard"
      parentRegion="france/rhone/hermitage"
      classification="climat"
      contentFile="le-meal-guide.md"
    />
  );
}
