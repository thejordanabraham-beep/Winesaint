import RegionLayout from '@/components/RegionLayout';

export default function LesRugiensHautsPage() {
  return (
    <RegionLayout
      title="Les Rugiens Hauts"
      level="vineyard"
      parentRegion="france/burgundy/cote-de-beaune/pommard"
      classification="premier-cru"
      contentFile="les-rugiens-hauts-guide.md"
    />
  );
}
