import RegionLayout from '@/components/RegionLayout';

export default function LesSeureyPage() {
  return (
    <RegionLayout
      title="Les Seurey"
      level="vineyard"
      parentRegion="france/burgundy/cote-de-beaune/beaune"
      classification="premier-cru"
      contentFile="les-seurey-guide.md"
    />
  );
}
