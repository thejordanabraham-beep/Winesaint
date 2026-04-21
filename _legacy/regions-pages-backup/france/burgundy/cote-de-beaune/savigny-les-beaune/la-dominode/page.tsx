import RegionLayout from '@/components/RegionLayout';

export default function LaDominodePage() {
  return (
    <RegionLayout
      title="La Dominode"
      level="vineyard"
      parentRegion="france/burgundy/cote-de-beaune/savigny-les-beaune"
      classification="premier-cru"
      contentFile="la-dominode-guide.md"
    />
  );
}
