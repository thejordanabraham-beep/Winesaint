import RegionLayout from '@/components/RegionLayout';

export default function LesSceauxPage() {
  return (
    <RegionLayout
      title="Les Sceaux"
      level="vineyard"
      parentRegion="france/burgundy/cote-de-beaune/beaune"
      classification="premier-cru"
      contentFile="les-sceaux-guide.md"
    />
  );
}
