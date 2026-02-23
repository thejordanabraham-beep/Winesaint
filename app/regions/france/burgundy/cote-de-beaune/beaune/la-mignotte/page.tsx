import RegionLayout from '@/components/RegionLayout';

export default function LaMignottePage() {
  return (
    <RegionLayout
      title="La Mignotte"
      level="vineyard"
      parentRegion="france/burgundy/cote-de-beaune/beaune"
      classification="premier-cru"
      contentFile="la-mignotte-guide.md"
    />
  );
}
