import RegionLayout from '@/components/RegionLayout';

export default function LesGreffieuxPage() {
  return (
    <RegionLayout
      title="Les Greffieux"
      level="vineyard"
      parentRegion="france/rhone/hermitage"
      classification="climat"
      contentFile="les-greffieux-guide.md"
    />
  );
}
