import RegionLayout from '@/components/RegionLayout';

export default function LaCommePage() {
  return (
    <RegionLayout
      title="La Comme"
      level="vineyard"
      parentRegion="france/burgundy/cote-de-beaune/santenay"
      classification="premier-cru"
      contentFile="la-comme-guide.md"
    />
  );
}
