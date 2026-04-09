import RegionLayout from '@/components/RegionLayout';

export default function SaarfeilserPage() {
  return (
    <RegionLayout
      title="Saarfeilser"
      level="vineyard"
      parentRegion="germany/mosel"
      classification="grosses-gewachs"
      contentFile="saarfeilser-guide.md"
    />
  );
}
