import RegionLayout from '@/components/RegionLayout';

export default function RoussetteDeSavoiePage() {
  return (
    <RegionLayout
      title="Roussette de Savoie"
      level="sub-region"
      parentRegion="france/savoie"
      contentFile="roussette-de-savoie-guide.md"
    />
  );
}
