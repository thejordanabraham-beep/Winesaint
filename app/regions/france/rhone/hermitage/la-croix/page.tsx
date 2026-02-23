import RegionLayout from '@/components/RegionLayout';

export default function LaCroixPage() {
  return (
    <RegionLayout
      title="La Croix"
      level="vineyard"
      parentRegion="france/rhone/hermitage"
      classification="climat"
      contentFile="la-croix-guide.md"
    />
  );
}
