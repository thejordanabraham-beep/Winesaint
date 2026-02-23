import RegionLayout from '@/components/RegionLayout';

export default function LesCortonsPage() {
  return (
    <RegionLayout
      title="Les Cortons"
      level="vineyard"
      parentRegion="france/burgundy/cote-de-beaune/saint-aubin"
      classification="premier-cru"
      contentFile="les-cortons-guide.md"
    />
  );
}
