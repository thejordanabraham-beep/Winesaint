import RegionLayout from '@/components/RegionLayout';

export default function LaRefnePage() {
  return (
    <RegionLayout
      title="La Refène"
      level="vineyard"
      parentRegion="france/burgundy/cote-de-beaune/pommard"
      classification="premier-cru"
      contentFile="la-refene-guide.md"
    />
  );
}
