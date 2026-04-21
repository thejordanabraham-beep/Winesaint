import RegionLayout from '@/components/RegionLayout';

export default function UngeheuerPage() {
  return (
    <RegionLayout
      title="Ungeheuer"
      level="vineyard"
      parentRegion="germany/pfalz"
      classification="grosses-gewachs"
      contentFile="ungeheuer-guide.md"
    />
  );
}
