import RegionLayout from '@/components/RegionLayout';

export default function VinDeSavoiePage() {
  return (
    <RegionLayout
      title="Vin de Savoie"
      level="sub-region"
      parentRegion="france/savoie"
      contentFile="vin-de-savoie-guide.md"
    />
  );
}
