import RegionLayout from '@/components/RegionLayout';

export default async function PalettePage() {
  return (
    <RegionLayout
      title="Palette"
      level="sub-region"
      parentRegion="france/provence"
      contentFile="palette-guide.md"
    />
  );
}
