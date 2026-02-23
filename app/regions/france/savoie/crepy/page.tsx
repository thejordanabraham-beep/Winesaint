import RegionLayout from '@/components/RegionLayout';

export default function CrepyPage() {
  return (
    <RegionLayout
      title="Crépy"
      level="sub-region"
      parentRegion="france/savoie"
      contentFile="crepy-guide.md"
    />
  );
}
