import RegionLayout from '@/components/RegionLayout';

export default function BataillrePage() {
  return (
    <RegionLayout
      title="Bataillère"
      level="vineyard"
      parentRegion="france/burgundy/cote-de-beaune/savigny-les-beaune"
      classification="premier-cru"
      contentFile="bataillere-guide.md"
    />
  );
}
