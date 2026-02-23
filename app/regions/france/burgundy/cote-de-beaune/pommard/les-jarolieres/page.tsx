import RegionLayout from '@/components/RegionLayout';

export default function LesJaroliresPage() {
  return (
    <RegionLayout
      title="Les Jarolières"
      level="vineyard"
      parentRegion="france/burgundy/cote-de-beaune/pommard"
      classification="premier-cru"
      contentFile="les-jarolieres-guide.md"
    />
  );
}
