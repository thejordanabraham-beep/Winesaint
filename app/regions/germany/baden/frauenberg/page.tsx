import RegionLayout from '@/components/RegionLayout';

export default function FrauenbergPage() {
  return (
    <RegionLayout
      title="Frauenberg"
      level="vineyard"
      parentRegion="germany/baden"
      classification="grosses-gewachs"
      contentFile="frauenberg-guide.md"
    />
  );
}
