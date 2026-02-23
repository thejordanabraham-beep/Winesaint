import RegionLayout from '@/components/RegionLayout';

export default function CailleretPage() {
  return (
    <RegionLayout
      title="Cailleret"
      level="vineyard"
      parentRegion="france/burgundy/cote-de-beaune/chassagne-montrachet"
      classification="premier-cru"
      contentFile="cailleret-guide.md"
    />
  );
}
