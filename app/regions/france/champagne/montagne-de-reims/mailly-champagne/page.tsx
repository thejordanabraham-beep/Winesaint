import RegionLayout from '@/components/RegionLayout';

export default async function MaillyChampagnePage() {
  return (
    <RegionLayout
      title="Mailly Champagne"
      level="village"
      parentRegion="france/champagne/montagne-de-reims"
      contentFile="mailly-champagne-guide.md"
    />
  );
}
