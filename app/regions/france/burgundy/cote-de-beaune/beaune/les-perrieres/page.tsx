import RegionLayout from '@/components/RegionLayout';

export default function LesPerriresPage() {
  return (
    <RegionLayout
      title="Les Perrières"
      level="vineyard"
      parentRegion="france/burgundy/cote-de-beaune/beaune"
      classification="premier-cru"
      contentFile="les-perrieres-guide.md"
    />
  );
}
