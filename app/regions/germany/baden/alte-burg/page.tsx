import RegionLayout from '@/components/RegionLayout';

export default function AlteBurgPage() {
  return (
    <RegionLayout
      title="Alte Burg"
      level="vineyard"
      parentRegion="germany/baden"
      classification="grosses-gewachs"
      contentFile="alte-burg-guide.md"
    />
  );
}
