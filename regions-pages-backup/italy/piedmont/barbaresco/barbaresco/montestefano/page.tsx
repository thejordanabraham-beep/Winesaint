import RegionLayout from '@/components/RegionLayout';

export default function MontestefanoPage() {
  return (
    <RegionLayout
      title="Montestefano"
      level="vineyard"
      parentRegion="italy/piedmont/barbaresco/barbaresco"
      classification="mga"
      contentFile="montestefano-guide.md"
    />
  );
}
