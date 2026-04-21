import RegionLayout from '@/components/RegionLayout';

export default function EdelackerPage() {
  return (
    <RegionLayout
      title="Edelacker"
      level="vineyard"
      parentRegion="germany/saale-unstrut"
      classification="grosses-gewachs"
      contentFile="edelacker-guide.md"
    />
  );
}
