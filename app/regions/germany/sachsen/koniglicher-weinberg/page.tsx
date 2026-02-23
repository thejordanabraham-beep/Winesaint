import RegionLayout from '@/components/RegionLayout';

export default function KniglicherWeinbergPage() {
  return (
    <RegionLayout
      title="Königlicher Weinberg"
      level="vineyard"
      parentRegion="germany/sachsen"
      classification="grosses-gewachs"
      contentFile="koniglicher-weinberg-guide.md"
    />
  );
}
