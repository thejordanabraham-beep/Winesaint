import RegionLayout from '@/components/RegionLayout';

export default function PfarrgartenPage() {
  return (
    <RegionLayout
      title="Pfarrgarten"
      level="vineyard"
      parentRegion="austria/thermenregion"
      contentFile="pfarrgarten-guide.md"
    />
  );
}
