import RegionLayout from '@/components/RegionLayout';

export default function EnVeauPage() {
  return (
    <RegionLayout
      title="En Veau"
      level="vineyard"
      parentRegion="france/burgundy/cote-chalonnaise/givry"
      classification="premier-cru"
      contentFile="en-veau-guide.md"
    />
  );
}
