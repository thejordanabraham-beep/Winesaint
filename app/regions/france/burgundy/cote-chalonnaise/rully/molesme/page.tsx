import RegionLayout from '@/components/RegionLayout';

export default function MolesmePage() {
  return (
    <RegionLayout
      title="Molesme"
      level="vineyard"
      parentRegion="france/burgundy/cote-chalonnaise/rully"
      classification="premier-cru"
      contentFile="molesme-guide.md"
    />
  );
}
