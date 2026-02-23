import RegionLayout from '@/components/RegionLayout';

export default async function VoipreuxPage() {
  return (
    <RegionLayout
      title="Voipreux"
      level="village"
      parentRegion="france/champagne/cote-des-blancs"
      contentFile="voipreux-guide.md"
    />
  );
}
