import RegionLayout from '@/components/RegionLayout';

export default function LesGuignottesPage() {
  return (
    <RegionLayout
      title="Les Guignottes"
      level="vineyard"
      parentRegion="france/burgundy/cote-chalonnaise/montagny"
      classification="premier-cru"
      contentFile="les-guignottes-guide.md"
    />
  );
}
