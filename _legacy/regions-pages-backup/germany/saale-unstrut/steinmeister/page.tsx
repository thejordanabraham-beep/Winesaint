import RegionLayout from '@/components/RegionLayout';

export default function SteinmeisterPage() {
  return (
    <RegionLayout
      title="Steinmeister"
      level="vineyard"
      parentRegion="germany/saale-unstrut"
      classification="grosses-gewachs"
      contentFile="steinmeister-guide.md"
    />
  );
}
