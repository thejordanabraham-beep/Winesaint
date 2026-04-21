import RegionLayout from '@/components/RegionLayout';

export default async function BergeresLesVertusPage() {
  return (
    <RegionLayout
      title="Bergeres les Vertus"
      level="village"
      parentRegion="france/champagne/cote-des-blancs"
      contentFile="bergères-les-vertus-guide.md"
    />
  );
}
