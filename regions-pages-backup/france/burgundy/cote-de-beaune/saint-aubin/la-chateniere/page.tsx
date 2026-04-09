import RegionLayout from '@/components/RegionLayout';

export default function LaChatenirePage() {
  return (
    <RegionLayout
      title="La Chatenière"
      level="vineyard"
      parentRegion="france/burgundy/cote-de-beaune/saint-aubin"
      classification="premier-cru"
      contentFile="la-chateniere-guide.md"
    />
  );
}
