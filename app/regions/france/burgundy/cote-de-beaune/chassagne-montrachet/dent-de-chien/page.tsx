import RegionLayout from '@/components/RegionLayout';

export default function DentdeChienPage() {
  return (
    <RegionLayout
      title="Dent de Chien"
      level="vineyard"
      parentRegion="france/burgundy/cote-de-beaune/chassagne-montrachet"
      classification="premier-cru"
      contentFile="dent-de-chien-vineyard-guide.md"
    />
  );
}
