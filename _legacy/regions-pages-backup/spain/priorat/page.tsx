import RegionLayout from '@/components/RegionLayout';

const PRIORAT_PRODUCERS = [
  { name: 'Clos Mogador', slug: 'clos-mogador', classification: 'single-vineyard' as const },
  { name: "Alvaro Palacios L'Ermita", slug: 'alvaro-palacios-lermita', classification: 'single-vineyard' as const },
  { name: 'Clos Erasmus', slug: 'clos-erasmus', classification: 'single-vineyard' as const },
];

export default function PrioratPage() {
  return (
    <RegionLayout
      title="Priorat"
      level="region"
      parentRegion="spain"
      sidebarLinks={PRIORAT_PRODUCERS}
      contentFile="priorat-guide.md"
    />
  );
}
