import RegionLayout from '@/components/RegionLayout';

export default function LimouxPage() {
  return (
    <RegionLayout
      title="Limoux"
      level="sub-region"
      parentRegion="france/languedoc"
      contentFile="limoux-guide.md"
    />
  );
}
