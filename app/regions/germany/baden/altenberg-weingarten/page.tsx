import RegionLayout from '@/components/RegionLayout';

export default function AltenbergWeingartenPage() {
  return (
    <RegionLayout
      title="Altenberg Weingarten"
      level="vineyard"
      parentRegion="germany/baden"
      classification="grosses-gewachs"
      contentFile="altenberg-weingarten-guide.md"
    />
  );
}
