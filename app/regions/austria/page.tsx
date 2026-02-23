import RegionLayout from '@/components/RegionLayout';

const AUSTRIA_SUB_REGIONS = [
  // Niederösterreich (Lower Austria)
  { name: 'Wachau', slug: 'wachau' },
  { name: 'Kremstal', slug: 'kremstal' },
  { name: 'Kamptal', slug: 'kamptal' },
  { name: 'Traisental', slug: 'traisental' },
  { name: 'Wagram', slug: 'wagram' },
  { name: 'Weinviertel', slug: 'weinviertel' },
  { name: 'Carnuntum', slug: 'carnuntum' },
  { name: 'Thermenregion', slug: 'thermenregion' },
  // Burgenland
  { name: 'Burgenland', slug: 'burgenland' },
  { name: 'Neusiedlersee', slug: 'neusiedlersee' },
  { name: 'Leithaberg', slug: 'leithaberg' },
  { name: 'Mittelburgenland', slug: 'mittelburgenland' },
  { name: 'Eisenberg', slug: 'eisenberg' },
  // Steiermark (Styria)
  { name: 'Steiermark', slug: 'steiermark' },
  // Wien (Vienna)
  { name: 'Wien', slug: 'wien' },
];

export default function AustriaPage() {
  return (
    <RegionLayout
      title="Austria"
      level="country"
      sidebarLinks={AUSTRIA_SUB_REGIONS}
      contentFile="austria-guide.md"
    />
  );
}
