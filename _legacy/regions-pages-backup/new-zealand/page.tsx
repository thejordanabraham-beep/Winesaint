import RegionLayout from '@/components/RegionLayout';

const NEW_ZEALAND_SUB_REGIONS = [
  { name: 'Marlborough', slug: 'marlborough' },
  { name: 'Central Otago', slug: 'central-otago' },
  { name: 'Hawke\'s Bay', slug: 'hawkes-bay' },
  { name: 'Martinborough', slug: 'martinborough' },
  { name: 'Waipara Valley', slug: 'waipara-valley' },
  { name: 'Nelson', slug: 'nelson' },
  { name: 'Gisborne', slug: 'gisborne' },
];

export default function NewZealandPage() {
  return (
    <RegionLayout
      title="New Zealand"
      level="country"
      sidebarLinks={NEW_ZEALAND_SUB_REGIONS}
      contentFile="new-zealand-guide.md"
    />
  );
}
