import RegionLayout from '@/components/RegionLayout';

export default function BocaPage() {
  return (
    <RegionLayout
      title="Boca"
      level="sub-region"
      parentRegion="italy/piedmont/alto-piemonte"
      contentFile="boca-guide.md"
    />
  );
}
