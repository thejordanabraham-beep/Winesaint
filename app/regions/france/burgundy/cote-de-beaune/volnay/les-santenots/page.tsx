import RegionLayout from '@/components/RegionLayout';

export default function LesSantenotsPage() {
  return (
    <RegionLayout
      title="Les Santenots"
      level="vineyard"
      parentRegion="france/burgundy/cote-de-beaune/volnay"
      classification="premier-cru"
      contentFile="les-santenots-guide.md"
    />
  );
}
