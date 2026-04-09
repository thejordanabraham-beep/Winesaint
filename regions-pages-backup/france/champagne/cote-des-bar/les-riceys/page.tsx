import RegionLayout from '@/components/RegionLayout';

export default async function LesRiceysPage() {
  return (
    <RegionLayout
      title="les Riceys"
      level="village"
      parentRegion="france/champagne/cote-des-bar"
      contentFile="les-riceys-guide.md"
    />
  );
}
