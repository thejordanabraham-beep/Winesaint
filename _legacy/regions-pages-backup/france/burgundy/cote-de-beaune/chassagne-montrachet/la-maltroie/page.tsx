import RegionLayout from '@/components/RegionLayout';

export default function LaMaltroiePage() {
  return (
    <RegionLayout
      title="La Maltroie"
      level="vineyard"
      parentRegion="france/burgundy/cote-de-beaune/chassagne-montrachet"
      classification="premier-cru"
      contentFile="la-maltroie-guide.md"
    />
  );
}
