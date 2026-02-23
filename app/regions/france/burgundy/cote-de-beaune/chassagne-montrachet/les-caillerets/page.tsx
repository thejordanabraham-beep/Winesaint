import RegionLayout from '@/components/RegionLayout';

export default function LesCailleretsPage() {
  return (
    <RegionLayout
      title="Les Caillerets"
      level="vineyard"
      parentRegion="france/burgundy/cote-de-beaune/chassagne-montrachet"
      classification="premier-cru"
      contentFile="les-caillerets-guide.md"
    />
  );
}
