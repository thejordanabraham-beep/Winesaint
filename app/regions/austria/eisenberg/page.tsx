import RegionLayout from '@/components/RegionLayout';

export default function EisenbergPage() {
  return (
    <RegionLayout
      title="Eisenberg"
      level="region"
      parentRegion="austria"
      contentFile="eisenberg-guide.md"
    />
  );
}
