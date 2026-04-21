import RegionLayout from '@/components/RegionLayout';

export default function VouvrayPage() {
  return (
    <RegionLayout
      title="Vouvray"
      level="village"
      parentRegion="france/loire-valley/touraine"
      contentFile="vouvray-guide.md"
    />
  );
}
