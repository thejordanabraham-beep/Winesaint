import RegionLayout from '@/components/RegionLayout';

export default function PouillyFumePage() {
  return (
    <RegionLayout
      title="Pouilly-Fumé"
      level="village"
      parentRegion="france/loire-valley/centre-loire"
      contentFile="pouilly-fume-guide.md"
    />
  );
}
