import RegionLayout from '@/components/RegionLayout';

export default function KluserwegPage() {
  return (
    <RegionLayout
      title="Kläuserweg"
      level="vineyard"
      parentRegion="germany/rheingau"
      classification="grosses-gewachs"
      contentFile="klauserweg-guide.md"
    />
  );
}
