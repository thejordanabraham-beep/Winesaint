import RegionLayout from '@/components/RegionLayout';

export default function LesEpenotesPage() {
  return (
    <RegionLayout
      title="Les Epenotes"
      level="vineyard"
      parentRegion="france/burgundy/cote-de-beaune/beaune"
      classification="premier-cru"
      contentFile="les-epenotes-guide.md"
    />
  );
}
