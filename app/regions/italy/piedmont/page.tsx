import RegionLayout from '@/components/RegionLayout';

const PIEDMONT_SUBREGIONS = [
  { name: 'Barolo', slug: 'barolo' },
  { name: 'Barbaresco', slug: 'barbaresco' },
  { name: 'Alto Piemonte', slug: 'alto-piemonte' },
  { name: 'Roero', slug: 'roero' },
  { name: 'Langhe', slug: 'langhe' },
  { name: 'Gavi', slug: 'gavi' },
  { name: 'Barbera d\'Asti', slug: 'barbera-dasti' },
  { name: 'Barbera d\'Alba', slug: 'barbera-dalba' },
  { name: 'Dolcetto d\'Alba', slug: 'dolcetto-dalba' },
];

export default function PiedmontPage() {
  return (
    <RegionLayout
      title="Piedmont"
      level="region"
      parentRegion="italy"
      sidebarLinks={PIEDMONT_SUBREGIONS}
      contentFile="piedmont-guide.md"
    />
  );
}
