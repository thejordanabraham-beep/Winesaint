import RegionLayout from '@/components/RegionLayout';

export default function RobardellePage() {
  return (
    <RegionLayout
      title="Robardelle"
      level="vineyard"
      parentRegion="france/burgundy/cote-de-beaune/volnay"
      classification="premier-cru"
      contentFile="robardelle-guide.md"
    />
  );
}
