import RegionLayout from '@/components/RegionLayout';

export default function SteinfelsenPage() {
  return (
    <RegionLayout
      title="Steinfelsen"
      level="vineyard"
      parentRegion="austria/thermenregion"
      contentFile="steinfelsen-guide.md"
    />
  );
}
