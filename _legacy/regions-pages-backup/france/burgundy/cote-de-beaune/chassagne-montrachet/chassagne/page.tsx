import RegionLayout from '@/components/RegionLayout';

export default function ChassagnePage() {
  return (
    <RegionLayout
      title="Chassagne"
      level="vineyard"
      parentRegion="france/burgundy/cote-de-beaune/chassagne-montrachet"
      classification="premier-cru"
      contentFile="chassagne-guide.md"
    />
  );
}
