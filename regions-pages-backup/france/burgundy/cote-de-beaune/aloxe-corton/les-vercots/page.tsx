import RegionLayout from '@/components/RegionLayout';

export default function LesVercotsPage() {
  return (
    <RegionLayout
      title="Les Vercots"
      level="vineyard"
      parentRegion="france/burgundy/cote-de-beaune/aloxe-corton"
      classification="premier-cru"
      contentFile="les-vercots-guide.md"
    />
  );
}
