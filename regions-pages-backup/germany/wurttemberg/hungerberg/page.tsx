import RegionLayout from '@/components/RegionLayout';

export default function HungerbergPage() {
  return (
    <RegionLayout
      title="Hungerberg"
      level="vineyard"
      parentRegion="germany/wurttemberg"
      classification="grosses-gewachs"
      contentFile="hungerberg-guide.md"
    />
  );
}
