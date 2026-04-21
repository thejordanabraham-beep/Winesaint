import RegionLayout from '@/components/RegionLayout';

export default function ClosduChapitrePage() {
  return (
    <RegionLayout
      title="Clos du Chapitre"
      level="vineyard"
      parentRegion="france/burgundy/cote-de-nuits/gevrey-chambertin"
      classification="premier-cru"
      contentFile="clos-du-chapitre-guide.md"
    />
  );
}
