import RegionLayout from '@/components/RegionLayout';

export default function LesPeuilletsPage() {
  return (
    <RegionLayout
      title="Les Peuillets"
      level="vineyard"
      parentRegion="france/burgundy/cote-de-beaune/savigny-les-beaune"
      classification="premier-cru"
      contentFile="les-peuillets-guide.md"
    />
  );
}
