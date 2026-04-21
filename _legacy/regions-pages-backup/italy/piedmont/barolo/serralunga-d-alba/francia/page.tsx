import RegionLayout from '@/components/RegionLayout';

export default function FranciaPage() {
  return (
    <RegionLayout
      title="Francia"
      level="vineyard"
      parentRegion="italy/piedmont/barolo/serralunga-d-alba"
      classification="mga"
      contentFile="francia-guide.md"
    />
  );
}
