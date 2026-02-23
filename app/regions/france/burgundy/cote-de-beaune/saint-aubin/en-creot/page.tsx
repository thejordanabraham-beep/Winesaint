import RegionLayout from '@/components/RegionLayout';

export default function EnCrotPage() {
  return (
    <RegionLayout
      title="En Créot"
      level="vineyard"
      parentRegion="france/burgundy/cote-de-beaune/saint-aubin"
      classification="premier-cru"
      contentFile="en-creot-guide.md"
    />
  );
}
