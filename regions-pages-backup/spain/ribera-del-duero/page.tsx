import RegionLayout from '@/components/RegionLayout';

// Major wine towns of Ribera del Duero - proper geographic hierarchy
const RIBERADELDUERO_TOWNS = [
  { name: 'Aranda de Duero', slug: 'aranda-de-duero', type: 'town' },
  { name: 'Gumiel de Izán', slug: 'gumiel-de-izan', type: 'town' },
  { name: 'La Horra', slug: 'la-horra', type: 'town' },
  { name: 'Peñafiel', slug: 'penafiel', type: 'town' },
  { name: 'Pesquera de Duero', slug: 'pesquera-de-duero', type: 'town' },
  { name: 'Quintanilla de Onésimo', slug: 'quintanilla-de-onesimo', type: 'town' },
  { name: 'Roa de Duero', slug: 'roa-de-duero', type: 'town' },
  { name: 'San Esteban de Gormaz', slug: 'san-esteban-de-gormaz', type: 'town' },
  { name: 'Sotillo de la Ribera', slug: 'sotillo-de-la-ribera', type: 'town' },
  { name: 'Valbuena de Duero', slug: 'valbuena-de-duero', type: 'town' }
];

export default function RiberaDelDueroPage() {
  return (
    <RegionLayout
      title="Ribera del Duero"
      level="region"
      parentRegion="spain"
      sidebarLinks={RIBERADELDUERO_TOWNS}
      contentFile="ribera-del-duero-guide.md"
    />
  );
}
