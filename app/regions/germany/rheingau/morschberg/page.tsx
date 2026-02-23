import RegionLayout from '@/components/RegionLayout';

export default function MorschbergPage() {
  return (
    <RegionLayout
      title="Morschberg"
      level="vineyard"
      parentRegion="germany/rheingau"
      classification="grosses-gewachs"
      contentFile="morschberg-guide.md"
    />
  );
}
