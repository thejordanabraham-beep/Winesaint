import RegionLayout from '@/components/RegionLayout';

export default function LesNarbantonsPage() {
  return (
    <RegionLayout
      title="Les Narbantons"
      level="vineyard"
      parentRegion="france/burgundy/cote-de-beaune/savigny-les-beaune"
      classification="premier-cru"
      contentFile="les-narbantons-guide.md"
    />
  );
}
