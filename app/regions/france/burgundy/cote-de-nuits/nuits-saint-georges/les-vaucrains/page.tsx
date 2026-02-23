import RegionLayout from '@/components/RegionLayout';

export default function LesVaucrainsPage() {
  return (
    <RegionLayout
      title="Les Vaucrains"
      level="vineyard"
      parentRegion="france/burgundy/cote-de-nuits/nuits-saint-georges"
      classification="premier-cru"
      contentFile="les-vaucrains-guide.md"
    />
  );
}
