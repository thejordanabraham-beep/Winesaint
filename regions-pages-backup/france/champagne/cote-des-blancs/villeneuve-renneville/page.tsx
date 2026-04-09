import RegionLayout from '@/components/RegionLayout';

export default async function VilleneuveRennevillePage() {
  return (
    <RegionLayout
      title="Villeneuve Renneville"
      level="village"
      parentRegion="france/champagne/cote-des-blancs"
      contentFile="villeneuve-renneville-guide.md"
    />
  );
}
