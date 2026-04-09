import RegionLayout from '@/components/RegionLayout';

export default function LesDemoisellesPage() {
  return (
    <RegionLayout
      title="Les Demoiselles"
      level="vineyard"
      parentRegion="france/burgundy/cote-de-beaune/puligny-montrachet"
      classification="premier-cru"
      contentFile="les-demoiselles-guide.md"
    />
  );
}
