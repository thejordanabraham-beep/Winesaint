import RegionLayout from '@/components/RegionLayout';

export default function LesVercandiresPage() {
  return (
    <RegionLayout
      title="Les Vercandières"
      level="vineyard"
      parentRegion="france/rhone/hermitage"
      classification="climat"
      contentFile="les-vercandieres-guide.md"
    />
  );
}
