import RegionLayout from '@/components/RegionLayout';

export default function LeChampLalotPage() {
  return (
    <RegionLayout
      title="Le Champ Lalot"
      level="vineyard"
      parentRegion="france/burgundy/cote-chalonnaise/givry"
      classification="premier-cru"
      contentFile="le-champ-lalot-guide.md"
    />
  );
}
