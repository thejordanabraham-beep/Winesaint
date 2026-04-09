import RegionLayout from '@/components/RegionLayout';

export default function ConeroPage() {
  return (
    <RegionLayout
      title="Conero"
      level="sub-region"
      parentRegion="italy/marche"
      contentFile="conero-guide.md"
    />
  );
}
