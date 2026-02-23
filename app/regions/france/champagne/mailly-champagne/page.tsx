import RegionLayout from '@/components/RegionLayout';

export default function MaillyChampagnePage() {
  return (
    <RegionLayout
      title="Mailly-Champagne"
      level="vineyard"
      parentRegion="france/champagne"
      classification="grand-cru"
      contentFile="mailly-champagne-guide.md"
    />
  );
}
