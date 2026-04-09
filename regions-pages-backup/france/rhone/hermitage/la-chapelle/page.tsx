import RegionLayout from '@/components/RegionLayout';

export default function LaChapellePage() {
  return (
    <RegionLayout
      title="La Chapelle"
      level="vineyard"
      parentRegion="france/rhone/hermitage"
      classification="climat"
      contentFile="la-chapelle-guide.md"
    />
  );
}
