import RegionLayout from '@/components/RegionLayout';

export default function LeCreuxdelaFeuillePage() {
  return (
    <RegionLayout
      title="Le Creux de la Feuille"
      level="vineyard"
      parentRegion="france/burgundy/cote-chalonnaise/montagny"
      classification="premier-cru"
      contentFile="le-creux-de-la-feuille-guide.md"
    />
  );
}
