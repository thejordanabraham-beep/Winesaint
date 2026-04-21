import RegionLayout from '@/components/RegionLayout';

export default function LesLaviresPage() {
  return (
    <RegionLayout
      title="Les Lavières"
      level="vineyard"
      parentRegion="france/burgundy/cote-de-beaune/savigny-les-beaune"
      classification="premier-cru"
      contentFile="les-lavieres-guide.md"
    />
  );
}
