import RegionLayout from '@/components/RegionLayout';

export default function MandelhohePage() {
  return (
    <RegionLayout
      title="Mandelhöhe"
      level="vineyard"
      parentRegion="austria/thermenregion"
      contentFile="mandelhohe-guide.md"
    />
  );
}
