import RegionLayout from '@/components/RegionLayout';

export default function PomerolPage() {
  return (
    <RegionLayout
      title="Pomerol"
      level="sub-region"
      parentRegion="france/bordeaux/right-bank"
      contentFile="pomerol-guide.md"
    />
  );
}
