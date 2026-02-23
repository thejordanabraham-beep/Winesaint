import RegionLayout from '@/components/RegionLayout';

export default function LesFolatiresPage() {
  return (
    <RegionLayout
      title="Les Folatières"
      level="vineyard"
      parentRegion="france/burgundy/cote-de-beaune/puligny-montrachet"
      classification="premier-cru"
      contentFile="les-folatieres-guide.md"
    />
  );
}
