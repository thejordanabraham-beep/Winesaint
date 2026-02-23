import RegionLayout from '@/components/RegionLayout';

export default function HameaudeBlagnyPage() {
  return (
    <RegionLayout
      title="Hameau de Blagny"
      level="vineyard"
      parentRegion="france/burgundy/cote-de-beaune/puligny-montrachet"
      classification="premier-cru"
      contentFile="hameau-de-blagny-guide.md"
    />
  );
}
