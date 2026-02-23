import RegionLayout from '@/components/RegionLayout';

export default function LaBrlePage() {
  return (
    <RegionLayout
      title="La Brûlée"
      level="vineyard"
      parentRegion="france/burgundy/cote-chalonnaise/givry"
      classification="premier-cru"
      contentFile="la-brulee-guide.md"
    />
  );
}
