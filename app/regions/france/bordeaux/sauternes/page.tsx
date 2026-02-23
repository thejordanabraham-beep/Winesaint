import RegionLayout from '@/components/RegionLayout';

export default function SauternesPage() {
  return (
    <RegionLayout
      title="Sauternes"
      level="sub-region"
      parentRegion="france/bordeaux"
      contentFile="sauternes-guide.md"
    />
  );
}
