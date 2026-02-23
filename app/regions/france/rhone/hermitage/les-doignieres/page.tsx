import RegionLayout from '@/components/RegionLayout';

export default function LesDoigniresPage() {
  return (
    <RegionLayout
      title="Les Doignières"
      level="vineyard"
      parentRegion="france/rhone/hermitage"
      classification="climat"
      contentFile="les-doignieres-guide.md"
    />
  );
}
