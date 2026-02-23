import RegionLayout from '@/components/RegionLayout';

export default function SonnenbergPage() {
  return (
    <RegionLayout
      title="Sonnenberg"
      level="vineyard"
      parentRegion="austria/thermenregion"
      contentFile="sonnenberg-guide.md"
    />
  );
}
