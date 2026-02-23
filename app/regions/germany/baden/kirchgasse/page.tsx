import RegionLayout from '@/components/RegionLayout';

export default function KirchgassePage() {
  return (
    <RegionLayout
      title="Kirchgasse"
      level="vineyard"
      parentRegion="germany/baden"
      classification="grosses-gewachs"
      contentFile="kirchgasse-guide.md"
    />
  );
}
