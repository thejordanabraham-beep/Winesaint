import RegionLayout from '@/components/RegionLayout';

export default function FerrerePage() {
  return (
    <RegionLayout
      title="Ferrere"
      level="vineyard"
      parentRegion="italy/piedmont/barbaresco/barbaresco"
      classification="mga"
      contentFile="ferrere-guide.md"
    />
  );
}
