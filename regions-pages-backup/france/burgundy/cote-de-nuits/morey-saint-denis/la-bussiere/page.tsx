import RegionLayout from '@/components/RegionLayout';

export default function LaBussirePage() {
  return (
    <RegionLayout
      title="La Bussière"
      level="vineyard"
      parentRegion="france/burgundy/cote-de-nuits/morey-saint-denis"
      classification="premier-cru"
      contentFile="la-bussiere-guide.md"
    />
  );
}
