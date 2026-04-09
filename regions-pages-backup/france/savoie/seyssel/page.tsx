import RegionLayout from '@/components/RegionLayout';

export default function SeysselPage() {
  return (
    <RegionLayout
      title="Seyssel"
      level="sub-region"
      parentRegion="france/savoie"
      contentFile="seyssel-guide.md"
    />
  );
}
