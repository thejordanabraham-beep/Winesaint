import RegionLayout from '@/components/RegionLayout';

export default async function CumieresPage() {
  return (
    <RegionLayout
      title="Cumieres"
      level="village"
      parentRegion="france/champagne/vallee-de-la-marne"
      contentFile="cumières-guide.md"
    />
  );
}
