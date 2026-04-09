import RegionLayout from '@/components/RegionLayout';

const LANGUEDOC_APPELLATIONS = [
  { name: 'Corbières', slug: 'corbieres' },
  { name: 'Minervois', slug: 'minervois' },
  { name: 'Fitou', slug: 'fitou' },
  { name: 'Faugères', slug: 'faugeres' },
  { name: 'Saint-Chinian', slug: 'saint-chinian' },
  { name: 'Pic Saint-Loup', slug: 'pic-saint-loup' },
  { name: 'Terrasses du Larzac', slug: 'terrasses-du-larzac' },
  { name: 'La Clape', slug: 'la-clape' },
  { name: 'Limoux', slug: 'limoux' },
  { name: 'Picpoul de Pinet', slug: 'picpoul-de-pinet' },
  { name: 'Cabardès', slug: 'cabardes' },
  { name: 'Malepère', slug: 'malepere' },
];

export default function LanguedocPage() {
  return (
    <RegionLayout
      title="Languedoc"
      level="region"
      parentRegion="france"
      sidebarLinks={LANGUEDOC_APPELLATIONS}
      contentFile="languedoc-guide.md"
    />
  );
}
