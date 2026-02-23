import RegionLayout from '@/components/RegionLayout';

export default function LesRiottesPage() {
  return (
    <RegionLayout
      title="Les Riottes"
      level="vineyard"
      parentRegion="france/burgundy/cote-de-beaune/monthelie"
      classification="premier-cru"
      contentFile="les-riottes-guide.md"
    />
  );
}
