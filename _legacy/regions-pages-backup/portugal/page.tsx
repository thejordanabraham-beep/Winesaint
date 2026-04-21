import RegionLayout from '@/components/RegionLayout';

const PORTUGAL_SUB_REGIONS = [
  // Northern Portugal
  { name: 'Vinho Verde', slug: 'vinho-verde' },
  { name: 'Douro', slug: 'douro' },
  { name: 'Porto', slug: 'porto' },
  { name: 'Trás-os-Montes', slug: 'tras-os-montes' },
  // Central Portugal
  { name: 'Dão', slug: 'dao' },
  { name: 'Bairrada', slug: 'bairrada' },
  { name: 'Távora-Varosa', slug: 'tavora-varosa' },
  { name: 'Beira Interior', slug: 'beira-interior' },
  { name: 'Lisboa', slug: 'lisboa' },
  { name: 'Tejo', slug: 'tejo' },
  // Southern Portugal
  { name: 'Alentejo', slug: 'alentejo' },
  { name: 'Setúbal', slug: 'setubal' },
  { name: 'Algarve', slug: 'algarve' },
  // Islands
  { name: 'Madeira', slug: 'madeira' },
  { name: 'Açores', slug: 'acores' },
];

export default function PortugalPage() {
  return (
    <RegionLayout
      title="Portugal"
      level="country"
      sidebarLinks={PORTUGAL_SUB_REGIONS}
      contentFile="portugal-guide.md"
    />
  );
}
