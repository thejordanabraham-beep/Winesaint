import RegionLayout from '@/components/RegionLayout';

export default function VarognePage() {
  return (
    <RegionLayout
      title="Varogne"
      level="vineyard"
      parentRegion="france/rhone/hermitage"
      classification="climat"
      contentFile="varogne-guide.md"
    />
  );
}
