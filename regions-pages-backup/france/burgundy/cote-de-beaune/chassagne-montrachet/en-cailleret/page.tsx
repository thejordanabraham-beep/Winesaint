import RegionLayout from '@/components/RegionLayout';

export default function EnCailleretPage() {
  return (
    <RegionLayout
      title="En Cailleret"
      level="vineyard"
      parentRegion="france/burgundy/cote-de-beaune/chassagne-montrachet"
      classification="premier-cru"
      contentFile="en-cailleret-vineyard-guide.md"
    />
  );
}
