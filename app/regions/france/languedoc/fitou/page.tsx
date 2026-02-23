import RegionLayout from '@/components/RegionLayout';

export default function FitouPage() {
  return (
    <RegionLayout
      title="Fitou"
      level="sub-region"
      parentRegion="france/languedoc"
      contentFile="fitou-guide.md"
    />
  );
}
