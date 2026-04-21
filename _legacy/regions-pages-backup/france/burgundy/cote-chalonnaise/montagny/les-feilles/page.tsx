import RegionLayout from '@/components/RegionLayout';

export default function LesFeillesPage() {
  return (
    <RegionLayout
      title="Les Feilles"
      level="vineyard"
      parentRegion="france/burgundy/cote-chalonnaise/montagny"
      classification="premier-cru"
      contentFile="les-feilles-guide.md"
    />
  );
}
