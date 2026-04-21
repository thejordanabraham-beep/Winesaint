import RegionLayout from '@/components/RegionLayout';

export default function LaMarchaudePage() {
  return (
    <RegionLayout
      title="La Maréchaude"
      level="vineyard"
      parentRegion="france/burgundy/cote-de-beaune/aloxe-corton"
      classification="premier-cru"
      contentFile="la-marechaude-guide.md"
    />
  );
}
