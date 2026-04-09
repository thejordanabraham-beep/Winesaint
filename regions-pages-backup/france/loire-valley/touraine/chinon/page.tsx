import RegionLayout from '@/components/RegionLayout';

export default function ChinonPage() {
  return (
    <RegionLayout
      title="Chinon"
      level="village"
      parentRegion="france/loire-valley/touraine"
      contentFile="chinon-guide.md"
    />
  );
}
