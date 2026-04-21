import RegionLayout from '@/components/RegionLayout';

export default function CastelloPage() {
  return (
    <RegionLayout
      title="Castello"
      level="vineyard"
      parentRegion="italy/piedmont/barolo/barolo"
      classification="mga"
      contentFile="castello-guide.md"
    />
  );
}
