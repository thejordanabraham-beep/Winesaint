import RegionLayout from '@/components/RegionLayout';

export default async function LeMesnilSurOgerPage() {
  return (
    <RegionLayout
      title="le Mesnil sur Oger"
      level="village"
      parentRegion="france/champagne/cote-des-blancs"
      contentFile="le-mesnil-sur-oger-guide.md"
    />
  );
}
