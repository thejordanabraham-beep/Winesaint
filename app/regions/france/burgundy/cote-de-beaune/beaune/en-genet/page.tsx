import RegionLayout from '@/components/RegionLayout';

export default function EnGentPage() {
  return (
    <RegionLayout
      title="En Genêt"
      level="vineyard"
      parentRegion="france/burgundy/cote-de-beaune/beaune"
      classification="premier-cru"
      contentFile="en-genet-guide.md"
    />
  );
}
