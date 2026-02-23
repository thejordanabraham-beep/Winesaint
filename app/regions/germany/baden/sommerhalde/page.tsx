import RegionLayout from '@/components/RegionLayout';

export default function SommerhaldePage() {
  return (
    <RegionLayout
      title="Sommerhalde"
      level="vineyard"
      parentRegion="germany/baden"
      classification="grosses-gewachs"
      contentFile="sommerhalde-guide.md"
    />
  );
}
