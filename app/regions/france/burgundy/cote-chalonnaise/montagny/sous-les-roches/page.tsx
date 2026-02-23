import RegionLayout from '@/components/RegionLayout';

export default function SouslesRochesPage() {
  return (
    <RegionLayout
      title="Sous les Roches"
      level="vineyard"
      parentRegion="france/burgundy/cote-chalonnaise/montagny"
      classification="premier-cru"
      contentFile="sous-les-roches-guide.md"
    />
  );
}
