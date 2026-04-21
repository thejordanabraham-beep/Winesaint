import RegionLayout from '@/components/RegionLayout';

export default function LesBarbiresPage() {
  return (
    <RegionLayout
      title="Les Barbières"
      level="vineyard"
      parentRegion="france/burgundy/cote-de-beaune/monthelie"
      classification="premier-cru"
      contentFile="les-barbieres-guide.md"
    />
  );
}
