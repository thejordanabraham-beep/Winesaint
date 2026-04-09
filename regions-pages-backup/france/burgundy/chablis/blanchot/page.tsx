import RegionLayout from '@/components/RegionLayout';

export default function BlanchotPage() {
  return (
    <RegionLayout
      title="Blanchot"
      level="vineyard"
      parentRegion="france/burgundy/chablis"
      classification="grand-cru"
      contentFile="blanchot-guide.md"
    />
  );
}
