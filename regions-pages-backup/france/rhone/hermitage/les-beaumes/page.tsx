import RegionLayout from '@/components/RegionLayout';

export default function LesBeaumesPage() {
  return (
    <RegionLayout
      title="Les Beaumes"
      level="vineyard"
      parentRegion="france/rhone/hermitage"
      classification="climat"
      contentFile="les-beaumes-guide.md"
    />
  );
}
