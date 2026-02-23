import RegionLayout from '@/components/RegionLayout';

export default function PertuisotsPage() {
  return (
    <RegionLayout
      title="Pertuisots"
      level="vineyard"
      parentRegion="france/burgundy/cote-de-beaune/beaune"
      classification="premier-cru"
      contentFile="pertuisots-guide.md"
    />
  );
}
