import RegionLayout from '@/components/RegionLayout';

export default async function CramantPage() {
  return (
    <RegionLayout
      title="Cramant"
      level="village"
      parentRegion="france/champagne/cote-des-blancs"
      contentFile="cramant-guide.md"
    />
  );
}
