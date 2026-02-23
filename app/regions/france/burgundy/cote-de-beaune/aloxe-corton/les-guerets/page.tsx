import RegionLayout from '@/components/RegionLayout';

export default function LesGuretsPage() {
  return (
    <RegionLayout
      title="Les Guérets"
      level="vineyard"
      parentRegion="france/burgundy/cote-de-beaune/aloxe-corton"
      classification="premier-cru"
      contentFile="les-guerets-guide.md"
    />
  );
}
