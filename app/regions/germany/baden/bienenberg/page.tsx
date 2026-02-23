import RegionLayout from '@/components/RegionLayout';

export default function BienenbergPage() {
  return (
    <RegionLayout
      title="Bienenberg"
      level="vineyard"
      parentRegion="germany/baden"
      classification="grosses-gewachs"
      contentFile="bienenberg-guide.md"
    />
  );
}
