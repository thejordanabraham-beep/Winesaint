import RegionLayout from '@/components/RegionLayout';

const LEFT_BANK_APPELLATIONS = [
  { name: 'Médoc', slug: 'medoc' },
  { name: 'Pauillac', slug: 'pauillac' },
  { name: 'Saint-Julien', slug: 'saint-julien' },
  { name: 'Margaux', slug: 'margaux' },
  { name: 'Saint-Estèphe', slug: 'saint-estephe' },
  { name: 'Pessac-Léognan', slug: 'pessac-leognan' },
  { name: 'Graves', slug: 'graves' },
  { name: 'Sauternes', slug: 'sauternes' },
  { name: 'Barsac', slug: 'barsac' },
] as const;

export default function LeftBankPage() {
  return (
    <RegionLayout
      title="Left Bank"
      level="sub-region"
      parentRegion="france/bordeaux"
      sidebarLinks={LEFT_BANK_APPELLATIONS}
      sidebarTitle="Appellations"
      contentFile="left-bank-guide.md"
    />
  );
}
