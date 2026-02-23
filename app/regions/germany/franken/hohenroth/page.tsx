import RegionLayout from '@/components/RegionLayout';

export default function HohenrothPage() {
  return (
    <RegionLayout
      title="Hohenroth"
      level="vineyard"
      parentRegion="germany/franken"
      classification="grosses-gewachs"
      contentFile="hohenroth-guide.md"
    />
  );
}
