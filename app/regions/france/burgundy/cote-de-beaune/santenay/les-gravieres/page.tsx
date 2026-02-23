import RegionLayout from '@/components/RegionLayout';

export default function LesGraviresPage() {
  return (
    <RegionLayout
      title="Les Gravières"
      level="vineyard"
      parentRegion="france/burgundy/cote-de-beaune/santenay"
      classification="premier-cru"
      contentFile="les-gravieres-guide.md"
    />
  );
}
