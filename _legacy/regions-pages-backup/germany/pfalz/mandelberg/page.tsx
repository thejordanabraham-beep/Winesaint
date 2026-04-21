import RegionLayout from '@/components/RegionLayout';

export default function MandelbergPage() {
  return (
    <RegionLayout
      title="Mandelberg"
      level="vineyard"
      parentRegion="germany/pfalz"
      classification="grosses-gewachs"
      contentFile="mandelberg-guide.md"
    />
  );
}
