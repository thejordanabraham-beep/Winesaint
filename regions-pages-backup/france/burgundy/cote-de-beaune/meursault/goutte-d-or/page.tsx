import RegionLayout from '@/components/RegionLayout';

export default function GouttedOrPage() {
  return (
    <RegionLayout
      title="Goutte d'Or"
      level="vineyard"
      parentRegion="france/burgundy/cote-de-beaune/meursault"
      classification="premier-cru"
      contentFile="goutte-d-or-guide.md"
    />
  );
}
