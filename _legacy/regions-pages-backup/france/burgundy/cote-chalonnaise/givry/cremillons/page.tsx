import RegionLayout from '@/components/RegionLayout';

export default function CrmillonsPage() {
  return (
    <RegionLayout
      title="Crémillons"
      level="vineyard"
      parentRegion="france/burgundy/cote-chalonnaise/givry"
      classification="premier-cru"
      contentFile="cremillons-guide.md"
    />
  );
}
