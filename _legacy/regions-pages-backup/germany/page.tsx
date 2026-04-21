import RegionLayout from '@/components/RegionLayout';

const GERMANY_SUB_REGIONS = [
  // Major regions
  { name: 'Mosel', slug: 'mosel' },
  { name: 'Rheingau', slug: 'rheingau' },
  { name: 'Rheinhessen', slug: 'rheinhessen' },
  { name: 'Pfalz', slug: 'pfalz' },
  { name: 'Nahe', slug: 'nahe' },
  { name: 'Baden', slug: 'baden' },
  { name: 'Franken', slug: 'franken' },
  { name: 'Württemberg', slug: 'wurttemberg' },
  // Smaller regions
  { name: 'Ahr', slug: 'ahr' },
  { name: 'Mittelrhein', slug: 'mittelrhein' },
  { name: 'Saale-Unstrut', slug: 'saale-unstrut' },
  { name: 'Sachsen', slug: 'sachsen' },
];

export default function GermanyPage() {
  return (
    <RegionLayout
      title="Germany"
      level="country"
      sidebarLinks={GERMANY_SUB_REGIONS}
      contentFile="germany-guide.md"
    />
  );
}
