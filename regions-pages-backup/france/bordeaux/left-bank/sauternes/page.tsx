import RegionLayout from '@/components/RegionLayout';

export default function SauternesPage() {
  return (
    <RegionLayout
      title="Sauternes"
      level="sub-region"
      parentRegion="france/bordeaux/left-bank"
      contentFile="sauternes-guide.md"
    />
  );
}
