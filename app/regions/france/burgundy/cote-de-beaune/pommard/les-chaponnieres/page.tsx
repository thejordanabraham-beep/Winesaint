import RegionLayout from '@/components/RegionLayout';

export default function LesChaponniresPage() {
  return (
    <RegionLayout
      title="Les Chaponnières"
      level="vineyard"
      parentRegion="france/burgundy/cote-de-beaune/pommard"
      classification="premier-cru"
      contentFile="les-chaponnieres-guide.md"
    />
  );
}
