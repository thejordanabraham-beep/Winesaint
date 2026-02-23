import RegionLayout from '@/components/RegionLayout';

export default function LesFaconniresPage() {
  return (
    <RegionLayout
      title="Les Faconnières"
      level="vineyard"
      parentRegion="france/burgundy/cote-de-nuits/morey-saint-denis"
      classification="premier-cru"
      contentFile="les-faconnieres-guide.md"
    />
  );
}
