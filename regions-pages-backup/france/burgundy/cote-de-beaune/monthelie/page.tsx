import RegionLayout from '@/components/RegionLayout';

const MONTHELIE_VINEYARDS = [
  { name: 'Clos-des-Toisieres', slug: 'clos-des-toisieres', classification: 'premier-cru' as const },
  { name: 'la-Taupine', slug: 'la-taupine', classification: 'premier-cru' as const },
  { name: 'le-Cas-Rougeot', slug: 'le-cas-rougeot', classification: 'premier-cru' as const },
  { name: 'le-Chateau-Gaillard', slug: 'le-chateau-gaillard', classification: 'premier-cru' as const },
  { name: 'le-Clos-Gauthey', slug: 'le-clos-gauthey', classification: 'premier-cru' as const },
  { name: 'le-Clou-des-Chenes', slug: 'le-clou-des-chenes', classification: 'premier-cru' as const },
  { name: 'le-Meix-Bataille', slug: 'le-meix-bataille', classification: 'premier-cru' as const },
  { name: 'le-Village', slug: 'le-village', classification: 'premier-cru' as const },
  { name: 'les-Barbieres', slug: 'les-barbieres', classification: 'premier-cru' as const },
  { name: 'les-Champs-Fulliots', slug: 'les-champs-fulliots', classification: 'premier-cru' as const },
  { name: 'les-Clous', slug: 'les-clous', classification: 'premier-cru' as const },
  { name: 'les-Crays', slug: 'les-crays', classification: 'premier-cru' as const },
  { name: 'les-Duresses', slug: 'les-duresses', classification: 'premier-cru' as const },
  { name: 'les-Riottes', slug: 'les-riottes', classification: 'premier-cru' as const },
  { name: 'les-Vignes-Rondes', slug: 'les-vignes-rondes', classification: 'premier-cru' as const },
] as const;

export default function MonthliePage() {
  return (
    <RegionLayout
      title="Monthélie"
      level="village"
      parentRegion="france/burgundy/cote-de-beaune"
      sidebarLinks={MONTHELIE_VINEYARDS}
      contentFile="monthelie-guide.md"
    />
  );
}
