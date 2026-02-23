import RegionLayout from '@/components/RegionLayout';

export default function LeMdenchotPage() {
  return (
    <RegionLayout
      title="Le Médenchot"
      level="vineyard"
      parentRegion="france/burgundy/cote-chalonnaise/givry"
      classification="premier-cru"
      contentFile="le-medenchot-guide.md"
    />
  );
}
