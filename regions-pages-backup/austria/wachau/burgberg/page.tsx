import RegionLayout from '@/components/RegionLayout';

export default function BurgbergPage() {
  return (
    <RegionLayout
      title="Burgberg"
      level="vineyard"
      parentRegion="austria/wachau"
      contentFile="burgberg-guide.md"
    />
  );
}
