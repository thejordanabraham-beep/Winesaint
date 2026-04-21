import RegionLayout from '@/components/RegionLayout';

export default function ChampsPerdrixPage() {
  return (
    <RegionLayout
      title="Champs Perdrix"
      level="vineyard"
      parentRegion="france/burgundy/cote-de-nuits/marsannay"
      classification="premier-cru"
      contentFile="champs-perdrix-guide.md"
    />
  );
}
