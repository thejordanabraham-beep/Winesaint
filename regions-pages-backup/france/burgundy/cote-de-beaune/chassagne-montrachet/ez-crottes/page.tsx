import RegionLayout from '@/components/RegionLayout';

export default function EzCrottesPage() {
  return (
    <RegionLayout
      title="Ez Crottes"
      level="vineyard"
      parentRegion="france/burgundy/cote-de-beaune/chassagne-montrachet"
      classification="premier-cru"
      contentFile="ez-crottes-vineyard-guide.md"
    />
  );
}
