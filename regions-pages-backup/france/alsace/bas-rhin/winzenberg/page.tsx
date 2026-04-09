import RegionLayout from '@/components/RegionLayout';

export default function WinzenbergPage() {
  return (
    <RegionLayout
      title="Winzenberg"
      level="vineyard"
      parentRegion="france/alsace/bas-rhin"
      classification="grand-cru"
      contentFile="winzenberg-guide.md"
    />
  );
}
