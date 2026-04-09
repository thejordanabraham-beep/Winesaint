import RegionLayout from '@/components/RegionLayout';

export default function AbbayedeMorgeotPage() {
  return (
    <RegionLayout
      title="Abbaye de Morgeot"
      level="vineyard"
      parentRegion="france/burgundy/cote-de-beaune/chassagne-montrachet"
      classification="premier-cru"
      contentFile="abbaye-de-morgeot-guide.md"
    />
  );
}
