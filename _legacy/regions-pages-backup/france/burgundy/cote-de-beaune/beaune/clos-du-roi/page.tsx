import RegionLayout from '@/components/RegionLayout';

export default function ClosduRoiPage() {
  return (
    <RegionLayout
      title="Clos du Roi"
      level="vineyard"
      parentRegion="france/burgundy/cote-de-beaune/beaune"
      classification="premier-cru"
      contentFile="clos-du-roi-guide.md"
    />
  );
}
