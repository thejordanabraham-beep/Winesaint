import RegionLayout from '@/components/RegionLayout';

export default function SurGamayPage() {
  return (
    <RegionLayout
      title="Sur Gamay"
      level="vineyard"
      parentRegion="france/burgundy/cote-de-beaune/saint-aubin"
      classification="premier-cru"
      contentFile="sur-gamay-vineyard-guide.md"
    />
  );
}
