import RegionLayout from '@/components/RegionLayout';

export default function LesMesneuxPage() {
  return (
    <RegionLayout
      title="Les Mesneux"
      level="vineyard"
      parentRegion="france/champagne"
      classification="premier-cru"
      contentFile="les-mesneux-guide.md"
    />
  );
}
