import RegionLayout from '@/components/RegionLayout';

export default function EichelbergPage() {
  return (
    <RegionLayout
      title="Eichelberg"
      level="vineyard"
      parentRegion="germany/baden"
      classification="grosses-gewachs"
      contentFile="eichelberg-guide.md"
    />
  );
}
