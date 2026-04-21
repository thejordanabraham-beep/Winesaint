import RegionLayout from '@/components/RegionLayout';

export default function SanPietroPage() {
  return (
    <RegionLayout
      title="San Pietro"
      level="vineyard"
      parentRegion="italy/piedmont/barolo/la-morra"
      classification="mga"
      contentFile="san-pietro-guide.md"
    />
  );
}
