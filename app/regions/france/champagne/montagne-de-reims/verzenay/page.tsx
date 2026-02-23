import RegionLayout from '@/components/RegionLayout';

export default async function VerzenayPage() {
  return (
    <RegionLayout
      title="Verzenay"
      level="village"
      parentRegion="france/champagne/montagne-de-reims"
      contentFile="verzenay-guide.md"
    />
  );
}
