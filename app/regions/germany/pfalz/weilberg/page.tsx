import RegionLayout from '@/components/RegionLayout';

export default function WeilbergPage() {
  return (
    <RegionLayout
      title="Weilberg"
      level="vineyard"
      parentRegion="germany/pfalz"
      classification="grosses-gewachs"
      contentFile="weilberg-guide.md"
    />
  );
}
