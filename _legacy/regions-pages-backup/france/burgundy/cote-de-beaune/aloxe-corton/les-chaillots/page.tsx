import RegionLayout from '@/components/RegionLayout';

export default function LesChaillotsPage() {
  return (
    <RegionLayout
      title="Les Chaillots"
      level="vineyard"
      parentRegion="france/burgundy/cote-de-beaune/aloxe-corton"
      classification="premier-cru"
      contentFile="les-chaillots-guide.md"
    />
  );
}
