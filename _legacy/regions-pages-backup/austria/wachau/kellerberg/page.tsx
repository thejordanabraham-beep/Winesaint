import RegionLayout from '@/components/RegionLayout';

export default function KellerbergPage() {
  return (
    <RegionLayout
      title="Kellerberg"
      level="vineyard"
      parentRegion="austria/wachau"
      contentFile="kellerberg-guide.md"
    />
  );
}
