import RegionLayout from '@/components/RegionLayout';

export default function EnlOrmeauPage() {
  return (
    <RegionLayout
      title="En l'Ormeau"
      level="vineyard"
      parentRegion="france/burgundy/cote-de-beaune/volnay"
      classification="premier-cru"
      contentFile="en-l-ormeau-guide.md"
    />
  );
}
