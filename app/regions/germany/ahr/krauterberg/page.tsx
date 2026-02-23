import RegionLayout from '@/components/RegionLayout';

export default function KruterbergPage() {
  return (
    <RegionLayout
      title="Kräuterberg"
      level="vineyard"
      parentRegion="germany/ahr"
      classification="grosses-gewachs"
      contentFile="krauterberg-guide.md"
    />
  );
}
