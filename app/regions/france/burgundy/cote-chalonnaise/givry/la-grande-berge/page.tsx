import RegionLayout from '@/components/RegionLayout';

export default function LaGrandeBergePage() {
  return (
    <RegionLayout
      title="La Grande Berge"
      level="vineyard"
      parentRegion="france/burgundy/cote-chalonnaise/givry"
      classification="premier-cru"
      contentFile="la-grande-berge-guide.md"
    />
  );
}
