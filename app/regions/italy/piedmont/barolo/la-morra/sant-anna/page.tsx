import RegionLayout from '@/components/RegionLayout';

export default function SantAnnaPage() {
  return (
    <RegionLayout
      title="Sant'Anna"
      level="vineyard"
      parentRegion="italy/piedmont/barolo/la-morra"
      classification="mga"
      contentFile="sant-anna-guide.md"
    />
  );
}
