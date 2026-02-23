import RegionLayout from '@/components/RegionLayout';

export default function KastanienbuschPage() {
  return (
    <RegionLayout
      title="Kastanienbusch"
      level="vineyard"
      parentRegion="germany/pfalz"
      classification="grosses-gewachs"
      contentFile="kastanienbusch-guide.md"
    />
  );
}
