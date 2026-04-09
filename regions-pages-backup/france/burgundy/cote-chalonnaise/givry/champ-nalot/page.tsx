import RegionLayout from '@/components/RegionLayout';

export default function ChampNalotPage() {
  return (
    <RegionLayout
      title="Champ Nalot"
      level="vineyard"
      parentRegion="france/burgundy/cote-chalonnaise/givry"
      classification="premier-cru"
      contentFile="champ-nalot-guide.md"
    />
  );
}
