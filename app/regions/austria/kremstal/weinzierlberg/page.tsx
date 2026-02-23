import RegionLayout from '@/components/RegionLayout';

export default function WeinzierlbergPage() {
  return (
    <RegionLayout
      title="Weinzierlberg"
      level="vineyard"
      parentRegion="austria/kremstal"
      contentFile="weinzierlberg-guide.md"
    />
  );
}
