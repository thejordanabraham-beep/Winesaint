import RegionLayout from '@/components/RegionLayout';

export default function LesMoutottesPage() {
  return (
    <RegionLayout
      title="Les Moutottes"
      level="vineyard"
      parentRegion="france/burgundy/cote-de-beaune/aloxe-corton"
      classification="premier-cru"
      contentFile="les-moutottes-guide.md"
    />
  );
}
