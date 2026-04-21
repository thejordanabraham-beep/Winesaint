import RegionLayout from '@/components/RegionLayout';

export default function MauryPage() {
  return (
    <RegionLayout
      title="Maury"
      level="sub-region"
      parentRegion="france/roussillon"
      contentFile="maury-guide.md"
    />
  );
}
