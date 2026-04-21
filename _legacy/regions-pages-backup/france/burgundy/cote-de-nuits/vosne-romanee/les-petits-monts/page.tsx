import RegionLayout from '@/components/RegionLayout';

export default function LesPetitsMontsPage() {
  return (
    <RegionLayout
      title="Les Petits Monts"
      level="vineyard"
      parentRegion="france/burgundy/cote-de-nuits/vosne-romanee"
      classification="premier-cru"
      contentFile="les-petits-monts-guide.md"
    />
  );
}
