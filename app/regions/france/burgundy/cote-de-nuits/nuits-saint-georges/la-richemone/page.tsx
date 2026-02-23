import RegionLayout from '@/components/RegionLayout';

export default function LaRichemonePage() {
  return (
    <RegionLayout
      title="La Richemone"
      level="vineyard"
      parentRegion="france/burgundy/cote-de-nuits/nuits-saint-georges"
      classification="premier-cru"
      contentFile="la-richemone-guide.md"
    />
  );
}
