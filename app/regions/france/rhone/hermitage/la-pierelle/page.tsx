import RegionLayout from '@/components/RegionLayout';

export default function LaPierellePage() {
  return (
    <RegionLayout
      title="La Pierelle"
      level="vineyard"
      parentRegion="france/rhone/hermitage"
      classification="climat"
      contentFile="la-pierelle-guide.md"
    />
  );
}
