import RegionLayout from '@/components/RegionLayout';

export default function LesBoisGautiersPage() {
  return (
    <RegionLayout
      title="Les Bois Gautiers"
      level="vineyard"
      parentRegion="france/burgundy/cote-chalonnaise/givry"
      classification="premier-cru"
      contentFile="les-bois-gautiers-guide.md"
    />
  );
}
