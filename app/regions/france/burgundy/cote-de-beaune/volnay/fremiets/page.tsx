import RegionLayout from '@/components/RegionLayout';

export default function FrmietsPage() {
  return (
    <RegionLayout
      title="Frémiets"
      level="vineyard"
      parentRegion="france/burgundy/cote-de-beaune/volnay"
      classification="premier-cru"
      contentFile="fremiets-guide.md"
    />
  );
}
