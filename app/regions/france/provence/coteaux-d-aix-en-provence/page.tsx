import RegionLayout from '@/components/RegionLayout';

export default function CoteauxDAixEnProvencePage() {
  return (
    <RegionLayout
      title="Coteaux d'Aix-en-Provence"
      level="sub-region"
      parentRegion="france/provence"
      contentFile="coteaux-d-aix-en-provence-guide.md"
    />
  );
}
