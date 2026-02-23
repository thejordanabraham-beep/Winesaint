import RegionLayout from '@/components/RegionLayout';

export default function LaPlatirePage() {
  return (
    <RegionLayout
      title="La Platière"
      level="vineyard"
      parentRegion="france/burgundy/cote-de-beaune/pommard"
      classification="premier-cru"
      contentFile="la-platiere-guide.md"
    />
  );
}
