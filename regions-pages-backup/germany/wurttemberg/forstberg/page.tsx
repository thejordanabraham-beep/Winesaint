import RegionLayout from '@/components/RegionLayout';

export default function ForstbergPage() {
  return (
    <RegionLayout
      title="Forstberg"
      level="vineyard"
      parentRegion="germany/wurttemberg"
      classification="grosses-gewachs"
      contentFile="forstberg-guide.md"
    />
  );
}
