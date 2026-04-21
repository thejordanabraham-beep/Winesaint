import RegionLayout from '@/components/RegionLayout';

const HERMITAGE_PRODUCERS = [
  { name: 'Domaine Jean-Louis Chave', slug: 'domaine-jean-louis-chave', classification: 'single-vineyard' as const },
  { name: 'M. Chapoutier', slug: 'm-chapoutier', classification: 'single-vineyard' as const },
  { name: 'Paul Jaboulet Aîné', slug: 'paul-jaboulet-aine', classification: 'single-vineyard' as const },
];

export default function HermitagePage() {
  return (
    <RegionLayout
      title="Hermitage"
      level="sub-region"
      parentRegion="france/rhone-valley"
      sidebarLinks={HERMITAGE_PRODUCERS}
      contentFile="hermitage-guide.md"
    />
  );
}
