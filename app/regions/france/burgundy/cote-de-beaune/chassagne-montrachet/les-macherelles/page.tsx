import RegionLayout from '@/components/RegionLayout';

export default function LesMacherellesPage() {
  return (
    <RegionLayout
      title="Les Macherelles"
      level="vineyard"
      parentRegion="france/burgundy/cote-de-beaune/chassagne-montrachet"
      classification="premier-cru"
      contentFile="les-macherelles-guide.md"
    />
  );
}
