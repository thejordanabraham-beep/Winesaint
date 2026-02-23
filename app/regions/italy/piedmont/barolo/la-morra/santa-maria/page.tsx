import RegionLayout from '@/components/RegionLayout';

export default function SantaMariaPage() {
  return (
    <RegionLayout
      title="Santa Maria"
      level="vineyard"
      parentRegion="italy/piedmont/barolo/la-morra"
      classification="mga"
      contentFile="santa-maria-guide.md"
    />
  );
}
