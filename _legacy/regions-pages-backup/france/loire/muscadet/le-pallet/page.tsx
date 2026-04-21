import RegionLayout from '@/components/RegionLayout';

export default function LePalletPage() {
  return (
    <RegionLayout
      title="Le Pallet"
      level="vineyard"
      parentRegion="france/loire/muscadet"
      classification="cru-communal"
      contentFile="le-pallet-guide.md"
    />
  );
}
