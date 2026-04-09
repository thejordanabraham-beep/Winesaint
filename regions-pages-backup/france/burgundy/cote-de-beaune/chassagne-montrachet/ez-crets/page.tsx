import RegionLayout from '@/components/RegionLayout';

export default function EzCretsPage() {
  return (
    <RegionLayout
      title="Ez Crets"
      level="vineyard"
      parentRegion="france/burgundy/cote-de-beaune/chassagne-montrachet"
      classification="premier-cru"
      contentFile="ez-crets-vineyard-guide.md"
    />
  );
}
