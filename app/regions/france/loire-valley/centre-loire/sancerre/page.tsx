import RegionLayout from '@/components/RegionLayout';

export default function SancerrePage() {
  return (
    <RegionLayout
      title="Sancerre"
      level="village"
      parentRegion="france/loire-valley/centre-loire"
      contentFile="sancerre-guide.md"
    />
  );
}
