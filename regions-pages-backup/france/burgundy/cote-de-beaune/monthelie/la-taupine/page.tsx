import RegionLayout from '@/components/RegionLayout';

export default function LaTaupinePage() {
  return (
    <RegionLayout
      title="La Taupine"
      level="vineyard"
      parentRegion="france/burgundy/cote-de-beaune/monthelie"
      classification="premier-cru"
      contentFile="la-taupine-guide.md"
    />
  );
}
