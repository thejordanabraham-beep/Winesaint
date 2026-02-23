import RegionLayout from '@/components/RegionLayout';

export default function LeMayPage() {
  return (
    <RegionLayout
      title="Le May"
      level="vineyard"
      parentRegion="france/burgundy/cote-chalonnaise/montagny"
      classification="premier-cru"
      contentFile="le-may-guide.md"
    />
  );
}
