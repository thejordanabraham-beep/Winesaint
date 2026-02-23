import RegionLayout from '@/components/RegionLayout';

export default function LaChapellePage() {
  return (
    <RegionLayout
      title="La Chapelle"
      level="vineyard"
      parentRegion="france/burgundy/cote-de-beaune/auxey-duresses"
      classification="premier-cru"
      contentFile="la-chapelle-guide.md"
    />
  );
}
