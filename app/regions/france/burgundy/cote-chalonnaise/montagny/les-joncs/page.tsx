import RegionLayout from '@/components/RegionLayout';

export default function LesJoncsPage() {
  return (
    <RegionLayout
      title="Les Joncs"
      level="vineyard"
      parentRegion="france/burgundy/cote-chalonnaise/montagny"
      classification="premier-cru"
      contentFile="les-joncs-guide.md"
    />
  );
}
