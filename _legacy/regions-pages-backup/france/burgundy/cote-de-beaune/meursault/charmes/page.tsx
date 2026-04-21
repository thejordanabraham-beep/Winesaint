import RegionLayout from '@/components/RegionLayout';

export default function CharmesPage() {
  return (
    <RegionLayout
      title="Charmes"
      level="vineyard"
      parentRegion="france/burgundy/cote-de-beaune/meursault"
      classification="premier-cru"
      contentFile="charmes-guide.md"
    />
  );
}
