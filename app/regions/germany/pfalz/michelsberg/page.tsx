import RegionLayout from '@/components/RegionLayout';

export default function MichelsbergPage() {
  return (
    <RegionLayout
      title="Michelsberg"
      level="vineyard"
      parentRegion="germany/pfalz"
      classification="grosses-gewachs"
      contentFile="michelsberg-guide.md"
    />
  );
}
