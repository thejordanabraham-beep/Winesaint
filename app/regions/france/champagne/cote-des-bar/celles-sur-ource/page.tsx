import RegionLayout from '@/components/RegionLayout';

export default async function CellesSurOurcePage() {
  return (
    <RegionLayout
      title="Celles sur Ource"
      level="village"
      parentRegion="france/champagne/cote-des-bar"
      contentFile="celles-sur-ource-guide.md"
    />
  );
}
