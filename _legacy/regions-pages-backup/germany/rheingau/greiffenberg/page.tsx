import RegionLayout from '@/components/RegionLayout';

export default function GreiffenbergPage() {
  return (
    <RegionLayout
      title="Greiffenberg"
      level="vineyard"
      parentRegion="germany/rheingau"
      classification="grosses-gewachs"
      contentFile="greiffenberg-guide.md"
    />
  );
}
