import RegionLayout from '@/components/RegionLayout';

export default function KalmitPage() {
  return (
    <RegionLayout
      title="Kalmit"
      level="vineyard"
      parentRegion="germany/pfalz"
      classification="grosses-gewachs"
      contentFile="kalmit-guide.md"
    />
  );
}
