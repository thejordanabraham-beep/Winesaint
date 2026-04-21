import RegionLayout from '@/components/RegionLayout';

export default function LesPerrieresPage() {
  return (
    <RegionLayout
      title="Les Perrieres"
      level="vineyard"
      parentRegion="france/burgundy/cote-de-beaune/saint-aubin"
      classification="premier-cru"
      contentFile="les-perrieres-vineyard-guide.md"
    />
  );
}
