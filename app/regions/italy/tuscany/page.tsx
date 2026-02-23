import RegionLayout from '@/components/RegionLayout';

const TUSCANY_APPELLATIONS = [
  { name: 'Chianti', slug: 'chianti' },
  { name: 'Brunello di Montalcino', slug: 'brunello-di-montalcino' },
  { name: 'Vino Nobile di Montepulciano', slug: 'vino-nobile-di-montepulciano' },
  { name: 'Bolgheri', slug: 'bolgheri' },
  { name: 'Carmignano', slug: 'carmignano' },
];

export default function TuscanyPage() {
  return (
    <RegionLayout
      title="Tuscany"
      level="region"
      parentRegion="italy"
      sidebarLinks={TUSCANY_APPELLATIONS}
      contentFile="tuscany-guide.md"
    />
  );
}
