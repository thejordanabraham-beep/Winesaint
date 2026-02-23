import RegionLayout from '@/components/RegionLayout';

export default function FaugeresPage() {
  return (
    <RegionLayout
      title="Faugères"
      level="sub-region"
      parentRegion="france/languedoc"
      contentFile="faugeres-guide.md"
    />
  );
}
