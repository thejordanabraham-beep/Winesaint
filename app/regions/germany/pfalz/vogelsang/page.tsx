import RegionLayout from '@/components/RegionLayout';

export default function VogelsangPage() {
  return (
    <RegionLayout
      title="Vogelsang"
      level="vineyard"
      parentRegion="germany/pfalz"
      classification="grosses-gewachs"
      contentFile="vogelsang-guide.md"
    />
  );
}
