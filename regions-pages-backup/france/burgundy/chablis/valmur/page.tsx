import RegionLayout from '@/components/RegionLayout';

export default function ValmurPage() {
  return (
    <RegionLayout
      title="Valmur"
      level="vineyard"
      parentRegion="france/burgundy/chablis"
      classification="grand-cru"
      contentFile="valmur-guide.md"
    />
  );
}
