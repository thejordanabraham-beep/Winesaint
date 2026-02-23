import RegionLayout from '@/components/RegionLayout';

export default function LaBonduePage() {
  return (
    <RegionLayout
      title="La Bondue"
      level="vineyard"
      parentRegion="france/burgundy/cote-chalonnaise/mercurey"
      classification="premier-cru"
      contentFile="la-bondue-guide.md"
    />
  );
}
