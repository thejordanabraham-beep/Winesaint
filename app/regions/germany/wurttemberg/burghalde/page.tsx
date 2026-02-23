import RegionLayout from '@/components/RegionLayout';

export default function BurghaldePage() {
  return (
    <RegionLayout
      title="Burghalde"
      level="vineyard"
      parentRegion="germany/wurttemberg"
      classification="grosses-gewachs"
      contentFile="burghalde-guide.md"
    />
  );
}
