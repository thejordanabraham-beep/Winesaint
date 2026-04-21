import RegionLayout from '@/components/RegionLayout';

export default function FelsenbergPage() {
  return (
    <RegionLayout
      title="Felsenberg"
      level="vineyard"
      parentRegion="germany/pfalz"
      classification="grosses-gewachs"
      contentFile="felsenberg-guide.md"
    />
  );
}
