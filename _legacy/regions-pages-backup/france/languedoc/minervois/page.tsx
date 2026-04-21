import RegionLayout from '@/components/RegionLayout';

export default function MinervoisPage() {
  return (
    <RegionLayout
      title="Minervois"
      level="sub-region"
      parentRegion="france/languedoc"
      contentFile="minervois-guide.md"
    />
  );
}
