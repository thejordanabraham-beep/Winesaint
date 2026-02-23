import RegionLayout from '@/components/RegionLayout';

const RIGHT_BANK_APPELLATIONS = [
  { name: 'Pomerol', slug: 'pomerol' },
  { name: 'Saint-Émilion', slug: 'saint-emilion' },
  { name: 'Fronsac', slug: 'fronsac' },
  { name: 'Canon-Fronsac', slug: 'canon-fronsac' },
  { name: 'Côtes de Bourg', slug: 'cotes-de-bourg' },
  { name: 'Côtes de Blaye', slug: 'cotes-de-blaye' },
] as const;

export default function RightBankPage() {
  return (
    <RegionLayout
      title="Right Bank"
      level="sub-region"
      parentRegion="france/bordeaux"
      sidebarLinks={RIGHT_BANK_APPELLATIONS}
      sidebarTitle="Appellations"
      contentFile="right-bank-guide.md"
    />
  );
}
