import RegionLayout from '@/components/RegionLayout';

export default async function PolisotPage() {
  return (
    <RegionLayout
      title="Polisot"
      level="village"
      parentRegion="france/champagne/cote-des-bar"
      contentFile="polisot-guide.md"
    />
  );
}
