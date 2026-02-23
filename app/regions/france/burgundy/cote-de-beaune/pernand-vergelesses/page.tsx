import RegionLayout from '@/components/RegionLayout';

const PERNAND_VERGELESSES_VINEYARDS = [
  {
    "name": "Clos Berthet",
    "slug": "clos-berthet",
    "classification": "premier-cru"
  },
  {
    "name": "Creux de la Net",
    "slug": "creux-de-la-net",
    "classification": "premier-cru"
  },
  {
    "name": "En Caradeux",
    "slug": "en-caradeux",
    "classification": "premier-cru"
  },
  {
    "name": "Île des Vergelesses",
    "slug": "ile-des-vergelesses",
    "classification": "premier-cru"
  },
  {
    "name": "Les Fichots",
    "slug": "les-fichots",
    "classification": "premier-cru"
  },
  {
    "name": "Sous Frétille",
    "slug": "sous-fretille",
    "classification": "premier-cru"
  },
  {
    "name": "Vergelesses",
    "slug": "vergelesses",
    "classification": "premier-cru"
  },
  {
    "name": "Village de Pernand",
    "slug": "village-de-pernand",
    "classification": "premier-cru"
  }
] as const;

export default function PernandVergelessesPage() {
  return (
    <RegionLayout
      title="Pernand-Vergelesses"
      level="village"
      parentRegion="france/burgundy/cote-de-beaune"
      sidebarLinks={PERNAND_VERGELESSES_VINEYARDS}
      contentFile="pernand-vergelesses-guide.md"
    />
  );
}
