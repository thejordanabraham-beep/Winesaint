import RegionLayout from '@/components/RegionLayout';

export default function HohenmorgenPage() {
  return (
    <RegionLayout
      title="Hohenmorgen"
      level="vineyard"
      parentRegion="germany/pfalz"
      classification="grosses-gewachs"
      contentFile="hohenmorgen-guide.md"
    />
  );
}
