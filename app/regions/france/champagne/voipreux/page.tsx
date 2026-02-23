import RegionLayout from '@/components/RegionLayout';

export default function VoipreuxPage() {
  return (
    <RegionLayout
      title="Voipreux"
      level="vineyard"
      parentRegion="france/champagne"
      classification="premier-cru"
      contentFile="voipreux-guide.md"
    />
  );
}
