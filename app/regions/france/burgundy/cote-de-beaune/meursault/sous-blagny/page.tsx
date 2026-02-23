import RegionLayout from '@/components/RegionLayout';

export default function SousBlagnyPage() {
  return (
    <RegionLayout
      title="Sous Blagny"
      level="vineyard"
      parentRegion="france/burgundy/cote-de-beaune/meursault"
      classification="premier-cru"
      contentFile="sous-blagny-vineyard-guide.md"
    />
  );
}
