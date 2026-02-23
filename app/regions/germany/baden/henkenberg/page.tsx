import RegionLayout from '@/components/RegionLayout';

export default function HenkenbergPage() {
  return (
    <RegionLayout
      title="Henkenberg"
      level="vineyard"
      parentRegion="germany/baden"
      classification="grosses-gewachs"
      contentFile="henkenberg-guide.md"
    />
  );
}
