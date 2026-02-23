import RegionLayout from '@/components/RegionLayout';

export default function LesGrandsChampsPage() {
  return (
    <RegionLayout
      title="Les Grands Champs"
      level="vineyard"
      parentRegion="france/burgundy/cote-de-beaune/auxey-duresses"
      classification="premier-cru"
      contentFile="les-grands-champs-guide.md"
    />
  );
}
