import RegionLayout from '@/components/RegionLayout';

export default function LesSaintsGeorgesPage() {
  return (
    <RegionLayout
      title="Les Saints-Georges"
      level="vineyard"
      parentRegion="france/burgundy/cote-de-nuits/nuits-saint-georges"
      classification="premier-cru"
      contentFile="les-saints-georges-guide.md"
    />
  );
}
