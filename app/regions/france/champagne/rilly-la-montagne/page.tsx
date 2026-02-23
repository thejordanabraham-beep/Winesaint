import RegionLayout from '@/components/RegionLayout';

export default function RillylaMontagnePage() {
  return (
    <RegionLayout
      title="Rilly-la-Montagne"
      level="vineyard"
      parentRegion="france/champagne"
      classification="premier-cru"
      contentFile="rilly-la-montagne-guide.md"
    />
  );
}
