import RegionLayout from '@/components/RegionLayout';

export default function GrauvesPage() {
  return (
    <RegionLayout
      title="Grauves"
      level="vineyard"
      parentRegion="france/champagne"
      classification="premier-cru"
      contentFile="grauves-guide.md"
    />
  );
}
