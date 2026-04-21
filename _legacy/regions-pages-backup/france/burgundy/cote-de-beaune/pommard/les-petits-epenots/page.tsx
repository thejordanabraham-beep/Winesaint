import RegionLayout from '@/components/RegionLayout';

export default function LesPetitsEpenotsPage() {
  return (
    <RegionLayout
      title="Les Petits Epenots"
      level="vineyard"
      parentRegion="france/burgundy/cote-de-beaune/pommard"
      classification="premier-cru"
      contentFile="les-petits-epenots-guide.md"
    />
  );
}
