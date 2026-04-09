import RegionLayout from '@/components/RegionLayout';

export default function LesBaudinesPage() {
  return (
    <RegionLayout
      title="Les Baudines"
      level="vineyard"
      parentRegion="france/burgundy/cote-de-beaune/chassagne-montrachet"
      classification="premier-cru"
      contentFile="les-baudines-guide.md"
    />
  );
}
