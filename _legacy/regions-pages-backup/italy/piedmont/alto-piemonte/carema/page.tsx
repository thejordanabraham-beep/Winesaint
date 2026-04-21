import RegionLayout from '@/components/RegionLayout';

export default function CaremaPage() {
  return (
    <RegionLayout
      title="Carema"
      level="sub-region"
      parentRegion="italy/piedmont/alto-piemonte"
      contentFile="carema-guide.md"
    />
  );
}
