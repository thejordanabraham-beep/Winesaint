import RegionLayout from '@/components/RegionLayout';

export default function LesVergersPage() {
  return (
    <RegionLayout
      title="Les Vergers"
      level="vineyard"
      parentRegion="france/burgundy/cote-de-beaune/chassagne-montrachet"
      classification="premier-cru"
      contentFile="les-vergers-guide.md"
    />
  );
}
