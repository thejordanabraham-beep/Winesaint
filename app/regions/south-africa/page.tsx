import RegionLayout from '@/components/RegionLayout';

const SOUTH_AFRICA_SUB_REGIONS = [
  // Western Cape
  { name: 'Stellenbosch', slug: 'stellenbosch' },
  { name: 'Franschhoek', slug: 'franschhoek' },
  { name: 'Paarl', slug: 'paarl' },
  { name: 'Constantia', slug: 'constantia' },
  { name: 'Swartland', slug: 'swartland' },
  { name: 'Walker Bay', slug: 'walker-bay' },
  { name: 'Hemel-en-Aarde', slug: 'hemel-en-aarde' },
  { name: 'Elgin', slug: 'elgin' },
  { name: 'Robertson', slug: 'robertson' },
  { name: 'Tulbagh', slug: 'tulbagh' },
];

export default function SouthAfricaPage() {
  return (
    <RegionLayout
      title="South Africa"
      level="country"
      sidebarLinks={SOUTH_AFRICA_SUB_REGIONS}
      contentFile="south-africa-guide.md"
    />
  );
}
