import RegionLayout from '@/components/RegionLayout';

export default function MuscadetPage() {
  return (
    <RegionLayout
      title="Muscadet"
      level="village"
      parentRegion="france/loire-valley/pays-nantais"
      contentFile="muscadet-guide.md"
    />
  );
}
