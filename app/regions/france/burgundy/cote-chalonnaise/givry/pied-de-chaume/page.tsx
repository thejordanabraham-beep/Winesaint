import RegionLayout from '@/components/RegionLayout';

export default function PieddeChaumePage() {
  return (
    <RegionLayout
      title="Pied de Chaume"
      level="vineyard"
      parentRegion="france/burgundy/cote-chalonnaise/givry"
      classification="premier-cru"
      contentFile="pied-de-chaume-guide.md"
    />
  );
}
