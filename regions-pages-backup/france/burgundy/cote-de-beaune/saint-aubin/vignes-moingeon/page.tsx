import RegionLayout from '@/components/RegionLayout';

export default function VignesMoingeonPage() {
  return (
    <RegionLayout
      title="Vignes Moingeon"
      level="vineyard"
      parentRegion="france/burgundy/cote-de-beaune/saint-aubin"
      classification="premier-cru"
      contentFile="vignes-moingeon-vineyard-guide.md"
    />
  );
}
