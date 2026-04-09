import RegionLayout from '@/components/RegionLayout';

export default function ClosNapolonPage() {
  return (
    <RegionLayout
      title="Clos Napoléon"
      level="vineyard"
      parentRegion="france/burgundy/cote-de-nuits/fixin"
      classification="premier-cru"
      contentFile="clos-napoleon-guide.md"
    />
  );
}
