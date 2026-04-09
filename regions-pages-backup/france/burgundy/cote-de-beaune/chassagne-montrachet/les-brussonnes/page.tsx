import RegionLayout from '@/components/RegionLayout';

export default function LesBrussonnesPage() {
  return (
    <RegionLayout
      title="Les Brussonnes"
      level="vineyard"
      parentRegion="france/burgundy/cote-de-beaune/chassagne-montrachet"
      classification="premier-cru"
      contentFile="les-brussonnes-vineyard-guide.md"
    />
  );
}
