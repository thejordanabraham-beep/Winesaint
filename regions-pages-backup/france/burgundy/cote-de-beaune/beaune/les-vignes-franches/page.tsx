import RegionLayout from '@/components/RegionLayout';

export default function LesVignesFranchesPage() {
  return (
    <RegionLayout
      title="Les Vignes Franches"
      level="vineyard"
      parentRegion="france/burgundy/cote-de-beaune/beaune"
      classification="premier-cru"
      contentFile="les-vignes-franches-guide.md"
    />
  );
}
