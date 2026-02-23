import RegionLayout from '@/components/RegionLayout';

export default async function ChouillyPage() {
  return (
    <RegionLayout
      title="Chouilly"
      level="village"
      parentRegion="france/champagne/cote-des-blancs"
      contentFile="chouilly-guide.md"
    />
  );
}
