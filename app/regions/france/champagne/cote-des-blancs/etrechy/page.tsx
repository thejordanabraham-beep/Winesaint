import RegionLayout from '@/components/RegionLayout';

export default async function EtrechyPage() {
  return (
    <RegionLayout
      title="Etrechy"
      level="village"
      parentRegion="france/champagne/cote-des-blancs"
      contentFile="etrechy-guide.md"
    />
  );
}
