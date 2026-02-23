import RegionLayout from '@/components/RegionLayout';

export default function FrancemontPage() {
  return (
    <RegionLayout
      title="Francemont"
      level="vineyard"
      parentRegion="france/burgundy/cote-de-beaune/chassagne-montrachet"
      classification="premier-cru"
      contentFile="francemont-vineyard-guide.md"
    />
  );
}
