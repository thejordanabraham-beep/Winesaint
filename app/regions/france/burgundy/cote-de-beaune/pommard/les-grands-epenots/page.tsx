import RegionLayout from '@/components/RegionLayout';

export default function LesGrandsEpenotsPage() {
  return (
    <RegionLayout
      title="Les Grands Epenots"
      level="vineyard"
      parentRegion="france/burgundy/cote-de-beaune/pommard"
      classification="premier-cru"
      contentFile="les-grands-epenots-guide.md"
    />
  );
}
