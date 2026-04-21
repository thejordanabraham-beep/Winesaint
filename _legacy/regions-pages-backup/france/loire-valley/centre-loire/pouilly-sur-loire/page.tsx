import RegionLayout from '@/components/RegionLayout';

export default function PouillySurLoirePage() {
  return (
    <RegionLayout
      title="Pouilly-sur-Loire"
      level="village"
      parentRegion="france/loire-valley/centre-loire"
      contentFile="pouilly-sur-loire-guide.md"
    />
  );
}
