import RegionLayout from '@/components/RegionLayout';

const LADOIX_VINEYARDS = [
  { name: 'Basses-Mourottes', slug: 'basses-mourottes', classification: 'premier-cru' as const },
  { name: 'Bois-Roussot', slug: 'bois-roussot', classification: 'premier-cru' as const },
  { name: 'En-Naget', slug: 'en-naget', classification: 'premier-cru' as const },
  { name: 'Hautes-Mourottes', slug: 'hautes-mourottes', classification: 'premier-cru' as const },
  { name: 'la-Corvee', slug: 'la-corvee', classification: 'premier-cru' as const },
  { name: 'la-Micaude', slug: 'la-micaude', classification: 'premier-cru' as const },
  { name: 'le-Clou-D-Orge', slug: 'le-clou-d-orge', classification: 'premier-cru' as const },
  { name: 'le-Rognet-Et-Corton', slug: 'le-rognet-et-corton', classification: 'premier-cru' as const },
  { name: 'les-Buis', slug: 'les-buis', classification: 'premier-cru' as const },
  { name: 'les-Grechons', slug: 'les-grechons', classification: 'premier-cru' as const },
  { name: 'les-Joyeuses', slug: 'les-joyeuses', classification: 'premier-cru' as const },
] as const;

export default function LadoixPage() {
  return (
    <RegionLayout
      title="Ladoix"
      level="village"
      parentRegion="france/burgundy/cote-de-beaune"
      sidebarLinks={LADOIX_VINEYARDS}
      contentFile="ladoix-guide.md"
    />
  );
}
