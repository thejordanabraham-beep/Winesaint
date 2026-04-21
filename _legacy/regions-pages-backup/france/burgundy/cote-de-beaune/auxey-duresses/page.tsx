import RegionLayout from '@/components/RegionLayout';

const AUXEY_DURESSES_VINEYARDS = [
  {
    "name": "Bas des Duresses",
    "slug": "bas-des-duresses",
    "classification": "premier-cru"
  },
  {
    "name": "Climat du Val",
    "slug": "climat-du-val",
    "classification": "premier-cru"
  },
  {
    "name": "Clos du Val",
    "slug": "clos-du-val",
    "classification": "premier-cru"
  },
  {
    "name": "La Chapelle",
    "slug": "la-chapelle",
    "classification": "premier-cru"
  },
  {
    "name": "Les Bréterins",
    "slug": "les-breterins",
    "classification": "premier-cru"
  },
  {
    "name": "Les Duresses",
    "slug": "les-duresses",
    "classification": "premier-cru"
  },
  {
    "name": "Les Écusseaux",
    "slug": "les-ecusseaux",
    "classification": "premier-cru"
  },
  {
    "name": "Les Grands Champs",
    "slug": "les-grands-champs",
    "classification": "premier-cru"
  },
  {
    "name": "Reugne",
    "slug": "reugne",
    "classification": "premier-cru"
  }
] as const;

export default function AuxeyDuressesPage() {
  return (
    <RegionLayout
      title="Auxey-Duresses"
      level="village"
      parentRegion="france/burgundy/cote-de-beaune"
      sidebarLinks={AUXEY_DURESSES_VINEYARDS}
      contentFile="auxey-duresses-guide.md"
    />
  );
}
