import RegionLayout from '@/components/RegionLayout';

export default function NiederbergHeldenPage() {
  return (
    <RegionLayout
      title="Niederberg Helden"
      level="vineyard"
      parentRegion="germany/mosel"
      classification="grosses-gewachs"
      contentFile="niederberg-helden-guide.md"
    />
  );
}
