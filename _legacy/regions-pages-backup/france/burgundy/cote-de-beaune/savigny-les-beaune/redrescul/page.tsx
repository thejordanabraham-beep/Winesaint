import RegionLayout from '@/components/RegionLayout';

export default function RedresculPage() {
  return (
    <RegionLayout
      title="Redrescul"
      level="vineyard"
      parentRegion="france/burgundy/cote-de-beaune/savigny-les-beaune"
      classification="premier-cru"
      contentFile="redrescul-guide.md"
    />
  );
}
