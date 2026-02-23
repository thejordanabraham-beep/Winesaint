import RegionLayout from '@/components/RegionLayout';

export default function FelsenbergPage() {
  return (
    <RegionLayout
      title="Felsenberg"
      level="vineyard"
      parentRegion="germany/nahe"
      classification="grosses-gewachs"
      contentFile="felsenberg-guide.md"
    />
  );
}
