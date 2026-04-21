import RegionLayout from '@/components/RegionLayout';

export default function LaCailloutePage() {
  return (
    <RegionLayout
      title="La Cailloute"
      level="vineyard"
      parentRegion="france/burgundy/cote-chalonnaise/mercurey"
      classification="premier-cru"
      contentFile="la-cailloute-guide.md"
    />
  );
}
