import RegionLayout from '@/components/RegionLayout';

export default function PerriresPage() {
  return (
    <RegionLayout
      title="Perrières"
      level="vineyard"
      parentRegion="france/burgundy/cote-de-beaune/meursault"
      classification="premier-cru"
      contentFile="perrieres-guide.md"
    />
  );
}
