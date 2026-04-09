import RegionLayout from '@/components/RegionLayout';

const SAVIGNY_LES_BEAUNE_VINEYARDS = [
  {
    "name": "Aux Clous",
    "slug": "aux-clous",
    "classification": "premier-cru"
  },
  {
    "name": "Aux Fourneaux",
    "slug": "aux-fourneaux",
    "classification": "premier-cru"
  },
  {
    "name": "Aux Gravains",
    "slug": "aux-gravains",
    "classification": "premier-cru"
  },
  {
    "name": "Aux Guettes",
    "slug": "aux-guettes",
    "classification": "premier-cru"
  },
  {
    "name": "Aux Serpentières",
    "slug": "aux-serpentieres",
    "classification": "premier-cru"
  },
  {
    "name": "Basses Vergelesses",
    "slug": "basses-vergelesses",
    "classification": "premier-cru"
  },
  {
    "name": "Bataillère",
    "slug": "bataillere",
    "classification": "premier-cru"
  },
  {
    "name": "Champ Chevrey",
    "slug": "champ-chevrey",
    "classification": "premier-cru"
  },
  {
    "name": "La Dominode",
    "slug": "la-dominode",
    "classification": "premier-cru"
  },
  {
    "name": "Les Charnières",
    "slug": "les-charnieres",
    "classification": "premier-cru"
  },
  {
    "name": "Les Hauts Jarrons",
    "slug": "les-hauts-jarrons",
    "classification": "premier-cru"
  },
  {
    "name": "Les Hauts Marconnets",
    "slug": "les-hauts-marconnets",
    "classification": "premier-cru"
  },
  {
    "name": "Les Jarrons",
    "slug": "les-jarrons",
    "classification": "premier-cru"
  },
  {
    "name": "Les Lavières",
    "slug": "les-lavieres",
    "classification": "premier-cru"
  },
  {
    "name": "Les Marconnets",
    "slug": "les-marconnets",
    "classification": "premier-cru"
  },
  {
    "name": "Les Narbantons",
    "slug": "les-narbantons",
    "classification": "premier-cru"
  },
  {
    "name": "Les Peuillets",
    "slug": "les-peuillets",
    "classification": "premier-cru"
  },
  {
    "name": "Les Rouvrettes",
    "slug": "les-rouvrettes",
    "classification": "premier-cru"
  },
  {
    "name": "Les Talmettes",
    "slug": "les-talmettes",
    "classification": "premier-cru"
  },
  {
    "name": "Les Vergelesses",
    "slug": "les-vergelesses",
    "classification": "premier-cru"
  },
  {
    "name": "Petits Godeaux",
    "slug": "petits-godeaux",
    "classification": "premier-cru"
  },
  {
    "name": "Redrescul",
    "slug": "redrescul",
    "classification": "premier-cru"
  }
] as const;

export default function SavignylsBeaunePage() {
  return (
    <RegionLayout
      title="Savigny-lès-Beaune"
      level="village"
      parentRegion="france/burgundy/cote-de-beaune"
      sidebarLinks={SAVIGNY_LES_BEAUNE_VINEYARDS}
      contentFile="savigny-les-beaune-guide.md"
    />
  );
}
