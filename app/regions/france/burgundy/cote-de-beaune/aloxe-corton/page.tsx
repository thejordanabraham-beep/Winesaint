import RegionLayout from '@/components/RegionLayout';

const ALOXE_CORTON_VINEYARDS = [
  {
    "name": "Charlemagne",
    "slug": "charlemagne",
    "classification": "grand-cru"
  },
  {
    "name": "Corton",
    "slug": "corton",
    "classification": "grand-cru"
  },
  {
    "name": "Corton-Charlemagne",
    "slug": "corton-charlemagne",
    "classification": "grand-cru"
  },
  {
    "name": "Clos des Maréchaudes",
    "slug": "clos-des-marechaudes",
    "classification": "premier-cru"
  },
  {
    "name": "Clos du Chapître",
    "slug": "clos-du-chapitre",
    "classification": "premier-cru"
  },
  {
    "name": "La Coutière",
    "slug": "la-coutiere",
    "classification": "premier-cru"
  },
  {
    "name": "La Maréchaude",
    "slug": "la-marechaude",
    "classification": "premier-cru"
  },
  {
    "name": "La Toppe au Vert",
    "slug": "la-toppe-au-vert",
    "classification": "premier-cru"
  },
  {
    "name": "Les Chaillots",
    "slug": "les-chaillots",
    "classification": "premier-cru"
  },
  {
    "name": "Les Fournières",
    "slug": "les-fournieres",
    "classification": "premier-cru"
  },
  {
    "name": "Les Guérets",
    "slug": "les-guerets",
    "classification": "premier-cru"
  },
  {
    "name": "Les Maréchaudes",
    "slug": "les-marechaudes",
    "classification": "premier-cru"
  },
  {
    "name": "Les Moutottes",
    "slug": "les-moutottes",
    "classification": "premier-cru"
  },
  {
    "name": "Les Paulands",
    "slug": "les-paulands",
    "classification": "premier-cru"
  },
  {
    "name": "Les Petites Lolières",
    "slug": "les-petites-lolieres",
    "classification": "premier-cru"
  },
  {
    "name": "Les Valozières",
    "slug": "les-valozieres",
    "classification": "premier-cru"
  },
  {
    "name": "Les Vercots",
    "slug": "les-vercots",
    "classification": "premier-cru"
  }
] as const;

export default function AloxeCortonPage() {
  return (
    <RegionLayout
      title="Aloxe-Corton"
      level="village"
      parentRegion="france/burgundy/cote-de-beaune"
      sidebarLinks={ALOXE_CORTON_VINEYARDS}
      contentFile="aloxe-corton-guide.md"
    />
  );
}
