import RegionLayout from '@/components/RegionLayout';

export default function ChampsJendreauPage() {
  return (
    <RegionLayout
      title="Champs Jendreau"
      level="vineyard"
      parentRegion="france/burgundy/cote-de-beaune/chassagne-montrachet"
      classification="premier-cru"
      contentFile="champs-jendreau-guide.md"
    />
  );
}
