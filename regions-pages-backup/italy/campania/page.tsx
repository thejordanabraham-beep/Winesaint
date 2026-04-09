import RegionLayout from '@/components/RegionLayout';

const CAMPANIA_SUB_REGIONS = [
  { name: 'Taurasi', slug: 'taurasi' },
  { name: 'Fiano di Avellino', slug: 'fiano-di-avellino' },
  { name: 'Greco di Tufo', slug: 'greco-di-tufo' },
  { name: 'Aglianico del Taburno', slug: 'aglianico-del-taburno' },
  { name: 'Falerno del Massico', slug: 'falerno-del-massico' },
  { name: 'Lacryma Christi del Vesuvio', slug: 'lacryma-christi-del-vesuvio' },
];

export default function CampaniaPage() {
  return (
    <RegionLayout
      title="Campania"
      level="region"
      parentRegion="italy"
      sidebarLinks={CAMPANIA_SUB_REGIONS}
      contentFile="campania-guide.md"
    />
  );
}
