import RegionLayout from '@/components/RegionLayout';

export default function PoruzotPage() {
  return (
    <RegionLayout
      title="Poruzot"
      level="vineyard"
      parentRegion="france/burgundy/cote-de-beaune/meursault"
      classification="premier-cru"
      contentFile="poruzot-guide.md"
    />
  );
}
