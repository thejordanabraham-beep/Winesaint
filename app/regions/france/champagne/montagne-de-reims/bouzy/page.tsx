import RegionLayout from '@/components/RegionLayout';

export default async function BouzyPage() {
  return (
    <RegionLayout
      title="Bouzy"
      level="village"
      parentRegion="france/champagne/montagne-de-reims"
      contentFile="bouzy-guide.md"
    />
  );
}
