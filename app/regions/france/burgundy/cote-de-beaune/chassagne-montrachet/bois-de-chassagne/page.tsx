import RegionLayout from '@/components/RegionLayout';

export default function BoisdeChassagnePage() {
  return (
    <RegionLayout
      title="Bois de Chassagne"
      level="vineyard"
      parentRegion="france/burgundy/cote-de-beaune/chassagne-montrachet"
      classification="premier-cru"
      contentFile="bois-de-chassagne-guide.md"
    />
  );
}
