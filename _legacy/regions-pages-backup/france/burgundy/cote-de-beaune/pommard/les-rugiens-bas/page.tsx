import RegionLayout from '@/components/RegionLayout';

export default function LesRugiensBasPage() {
  return (
    <RegionLayout
      title="Les Rugiens Bas"
      level="vineyard"
      parentRegion="france/burgundy/cote-de-beaune/pommard"
      classification="premier-cru"
      contentFile="les-rugiens-bas-guide.md"
    />
  );
}
