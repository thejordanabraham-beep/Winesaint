import RegionLayout from '@/components/RegionLayout';

export default function CabardesPage() {
  return (
    <RegionLayout
      title="Cabardès"
      level="sub-region"
      parentRegion="france/languedoc"
      contentFile="cabardes-guide.md"
    />
  );
}
