import RegionLayout from '@/components/RegionLayout';

export default function PierryPage() {
  return (
    <RegionLayout
      title="Pierry"
      level="vineyard"
      parentRegion="france/champagne"
      classification="premier-cru"
      contentFile="pierry-guide.md"
    />
  );
}
