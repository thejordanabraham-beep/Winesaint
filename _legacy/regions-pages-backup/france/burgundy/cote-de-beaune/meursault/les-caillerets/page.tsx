import RegionLayout from '@/components/RegionLayout';

export default function LesCailleretsPage() {
  return (
    <RegionLayout
      title="Les Caillerets"
      level="vineyard"
      parentRegion="france/burgundy/cote-de-beaune/meursault"
      classification="premier-cru"
      contentFile="les-caillerets-vineyard-guide.md"
    />
  );
}
