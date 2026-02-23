import RegionLayout from '@/components/RegionLayout';

export default function EichbergPage() {
  return (
    <RegionLayout
      title="Eichberg"
      level="vineyard"
      parentRegion="germany/baden"
      classification="grosses-gewachs"
      contentFile="eichberg-guide.md"
    />
  );
}
