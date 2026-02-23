import RegionLayout from '@/components/RegionLayout';

export default function BlagnyPage() {
  return (
    <RegionLayout
      title="Blagny"
      level="vineyard"
      parentRegion="france/burgundy/cote-de-beaune/meursault"
      classification="premier-cru"
      contentFile="blagny-guide.md"
    />
  );
}
