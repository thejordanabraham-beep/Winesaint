import RegionLayout from '@/components/RegionLayout';

export default function ChampsClouxPage() {
  return (
    <RegionLayout
      title="Champs Cloux"
      level="vineyard"
      parentRegion="france/burgundy/cote-chalonnaise/rully"
      classification="premier-cru"
      contentFile="champs-cloux-guide.md"
    />
  );
}
