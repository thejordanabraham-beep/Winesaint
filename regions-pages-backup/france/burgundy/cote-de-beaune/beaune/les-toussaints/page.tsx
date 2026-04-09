import RegionLayout from '@/components/RegionLayout';

export default function LesToussaintsPage() {
  return (
    <RegionLayout
      title="Les Toussaints"
      level="vineyard"
      parentRegion="france/burgundy/cote-de-beaune/beaune"
      classification="premier-cru"
      contentFile="les-toussaints-guide.md"
    />
  );
}
