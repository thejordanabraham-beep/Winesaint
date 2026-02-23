import RegionLayout from '@/components/RegionLayout';

export default function SanLorenzoPage() {
  return (
    <RegionLayout
      title="San Lorenzo"
      level="vineyard"
      parentRegion="italy/piedmont/barolo/barolo"
      classification="mga"
      contentFile="san-lorenzo-guide.md"
    />
  );
}
