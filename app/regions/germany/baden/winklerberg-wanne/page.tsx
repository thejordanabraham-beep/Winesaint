import RegionLayout from '@/components/RegionLayout';

export default function WinklerbergWannePage() {
  return (
    <RegionLayout
      title="Winklerberg Wanne"
      level="vineyard"
      parentRegion="germany/baden"
      classification="grosses-gewachs"
      contentFile="winklerberg-wanne-guide.md"
    />
  );
}
