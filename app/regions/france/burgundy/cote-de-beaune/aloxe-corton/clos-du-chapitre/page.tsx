import RegionLayout from '@/components/RegionLayout';

export default function ClosduChaptrePage() {
  return (
    <RegionLayout
      title="Clos du Chapître"
      level="vineyard"
      parentRegion="france/burgundy/cote-de-beaune/aloxe-corton"
      classification="premier-cru"
      contentFile="clos-du-chapitre-guide.md"
    />
  );
}
