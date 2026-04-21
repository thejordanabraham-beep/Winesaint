import RegionLayout from '@/components/RegionLayout';

export default function ScharzhofbergerPage() {
  return (
    <RegionLayout
      title="Scharzhofberger"
      level="vineyard"
      parentRegion="germany/mosel"
      classification="grosses-gewachs"
      contentFile="scharzhofberger-guide.md"
    />
  );
}
