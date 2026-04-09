import RegionLayout from '@/components/RegionLayout';

export default function ChouillyPage() {
  return (
    <RegionLayout
      title="Chouilly"
      level="vineyard"
      parentRegion="france/champagne"
      classification="grand-cru"
      contentFile="chouilly-guide.md"
    />
  );
}
