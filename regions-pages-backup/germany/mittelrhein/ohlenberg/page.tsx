import RegionLayout from '@/components/RegionLayout';

export default function OhlenbergPage() {
  return (
    <RegionLayout
      title="Ohlenberg"
      level="vineyard"
      parentRegion="germany/mittelrhein"
      classification="grosses-gewachs"
      contentFile="ohlenberg-guide.md"
    />
  );
}
