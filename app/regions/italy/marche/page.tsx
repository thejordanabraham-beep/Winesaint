import RegionLayout from '@/components/RegionLayout';

const MARCHE_SUB_REGIONS = [
  { name: 'Verdicchio dei Castelli di Jesi', slug: 'verdicchio-dei-castelli-di-jesi' },
  { name: 'Verdicchio di Matelica', slug: 'verdicchio-di-matelica' },
  { name: 'Conero', slug: 'conero' },
  { name: 'Lacrima di Morro d\'Alba', slug: 'lacrima-di-morro-d-alba' },
  { name: 'Rosso Piceno', slug: 'rosso-piceno' },
];

export default function MarchePage() {
  return (
    <RegionLayout
      title="Marche"
      level="region"
      parentRegion="italy"
      sidebarLinks={MARCHE_SUB_REGIONS}
      contentFile="marche-guide.md"
    />
  );
}
