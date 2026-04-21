import RegionLayout from '@/components/RegionLayout';

export default function KarthuserPage() {
  return (
    <RegionLayout
      title="Karthäuser"
      level="vineyard"
      parentRegion="germany/franken"
      classification="grosses-gewachs"
      contentFile="karthauser-guide.md"
    />
  );
}
