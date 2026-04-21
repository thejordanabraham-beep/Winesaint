import RegionLayout from '@/components/RegionLayout';

export default async function LesMesneuxPage() {
  return (
    <RegionLayout
      title="les Mesneux"
      level="village"
      parentRegion="france/champagne/montagne-de-reims"
      contentFile="les-mesneux-guide.md"
    />
  );
}
