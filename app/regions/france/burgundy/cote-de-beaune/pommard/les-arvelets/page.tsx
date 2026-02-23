import RegionLayout from '@/components/RegionLayout';

export default function LesArveletsPage() {
  return (
    <RegionLayout
      title="Les Arvelets"
      level="vineyard"
      parentRegion="france/burgundy/cote-de-beaune/pommard"
      classification="premier-cru"
      contentFile="les-arvelets-guide.md"
    />
  );
}
