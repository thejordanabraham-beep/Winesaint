import RegionLayout from '@/components/RegionLayout';

export default function LeReculleronPage() {
  return (
    <RegionLayout
      title="Le Reculleron"
      level="vineyard"
      parentRegion="france/burgundy/cote-chalonnaise/montagny"
      classification="premier-cru"
      contentFile="le-reculleron-guide.md"
    />
  );
}
