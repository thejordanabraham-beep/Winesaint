import RegionLayout from '@/components/RegionLayout';

export default function LesPrsPage() {
  return (
    <RegionLayout
      title="Les Prés"
      level="vineyard"
      parentRegion="france/burgundy/cote-chalonnaise/montagny"
      classification="premier-cru"
      contentFile="les-pres-guide.md"
    />
  );
}
