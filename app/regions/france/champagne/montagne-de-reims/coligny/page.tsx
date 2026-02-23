import RegionLayout from '@/components/RegionLayout';

export default async function ColignyPage() {
  return (
    <RegionLayout
      title="Coligny"
      level="village"
      parentRegion="france/champagne/montagne-de-reims"
      contentFile="coligny-guide.md"
    />
  );
}
