import RegionLayout from '@/components/RegionLayout';

export default function LesGouressesPage() {
  return (
    <RegionLayout
      title="Les Gouresses"
      level="vineyard"
      parentRegion="france/burgundy/cote-chalonnaise/montagny"
      classification="premier-cru"
      contentFile="les-gouresses-guide.md"
    />
  );
}
