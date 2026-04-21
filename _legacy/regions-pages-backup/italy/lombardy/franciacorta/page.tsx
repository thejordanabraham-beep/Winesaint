import RegionLayout from '@/components/RegionLayout';

export default function FranciacortaPage() {
  return (
    <RegionLayout
      title="Franciacorta"
      level="sub-region"
      parentRegion="italy/lombardy"
      contentFile="franciacorta-guide.md"
    />
  );
}
