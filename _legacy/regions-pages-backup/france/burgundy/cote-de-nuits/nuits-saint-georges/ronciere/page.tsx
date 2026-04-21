import RegionLayout from '@/components/RegionLayout';

export default function RoncirePage() {
  return (
    <RegionLayout
      title="Roncière"
      level="vineyard"
      parentRegion="france/burgundy/cote-de-nuits/nuits-saint-georges"
      classification="premier-cru"
      contentFile="ronciere-guide.md"
    />
  );
}
