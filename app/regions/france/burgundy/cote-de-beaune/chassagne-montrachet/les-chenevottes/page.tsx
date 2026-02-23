import RegionLayout from '@/components/RegionLayout';

export default function LesChenevottesPage() {
  return (
    <RegionLayout
      title="Les Chenevottes"
      level="vineyard"
      parentRegion="france/burgundy/cote-de-beaune/chassagne-montrachet"
      classification="premier-cru"
      contentFile="les-chenevottes-guide.md"
    />
  );
}
