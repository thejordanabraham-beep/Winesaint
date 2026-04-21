import RegionLayout from '@/components/RegionLayout';

export default function FelsenkopfPage() {
  return (
    <RegionLayout
      title="Felsenkopf"
      level="vineyard"
      parentRegion="germany/mosel"
      classification="grosses-gewachs"
      contentFile="felsenkopf-guide.md"
    />
  );
}
