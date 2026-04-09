import RegionLayout from '@/components/RegionLayout';

export default function ChapitrePage() {
  return (
    <RegionLayout
      title="Chapitre"
      level="vineyard"
      parentRegion="france/burgundy/cote-chalonnaise/rully"
      classification="premier-cru"
      contentFile="chapitre-guide.md"
    />
  );
}
