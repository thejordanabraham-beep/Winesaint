import RegionLayout from '@/components/RegionLayout';

export default function LesBoisChevauxPage() {
  return (
    <RegionLayout
      title="Les Bois Chevaux"
      level="vineyard"
      parentRegion="france/burgundy/cote-chalonnaise/givry"
      classification="premier-cru"
      contentFile="les-bois-chevaux-guide.md"
    />
  );
}
