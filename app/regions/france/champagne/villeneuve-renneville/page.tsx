import RegionLayout from '@/components/RegionLayout';

export default function VilleneuveRennevillePage() {
  return (
    <RegionLayout
      title="Villeneuve-Renneville"
      level="vineyard"
      parentRegion="france/champagne"
      classification="premier-cru"
      contentFile="villeneuve-renneville-guide.md"
    />
  );
}
