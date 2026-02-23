import RegionLayout from '@/components/RegionLayout';

export default function LeClosdeJeuPage() {
  return (
    <RegionLayout
      title="Le Clos de Jeu"
      level="vineyard"
      parentRegion="france/burgundy/cote-de-nuits/marsannay"
      classification="premier-cru"
      contentFile="le-clos-de-jeu-guide.md"
    />
  );
}
