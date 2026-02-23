import RegionLayout from '@/components/RegionLayout';

export default function LaChassirePage() {
  return (
    <RegionLayout
      title="La Chassière"
      level="vineyard"
      parentRegion="france/burgundy/cote-chalonnaise/mercurey"
      classification="premier-cru"
      contentFile="la-chassiere-guide.md"
    />
  );
}
