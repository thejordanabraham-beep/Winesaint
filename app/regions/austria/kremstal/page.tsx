import RegionLayout from '@/components/RegionLayout';

const KREMSTAL_VINEYARDS = [
  {
    "name": "Pfaffenberg",
    "slug": "pfaffenberg",
    "classification": "erste-lage"
  },
  {
    "name": "Steiner Kögl",
    "slug": "steiner-kogl",
    "classification": "erste-lage"
  },
  {
    "name": "Gaisberg",
    "slug": "gaisberg",
    "classification": "erste-lage"
  },
  {
    "name": "Steiner Hund",
    "slug": "steiner-hund",
    "classification": "erste-lage"
  },
  {
    "name": "Grillenparz",
    "slug": "grillenparz",
    "classification": "erste-lage"
  },
  {
    "name": "Goldberg",
    "slug": "goldberg",
    "classification": "erste-lage"
  },
  {
    "name": "Wachtberg",
    "slug": "wachtberg",
    "classification": "erste-lage"
  },
  {
    "name": "Lindberg",
    "slug": "lindberg",
    "classification": "erste-lage"
  },
  {
    "name": "Thurnerberg",
    "slug": "thurnerberg",
    "classification": "erste-lage"
  },
  {
    "name": "Gebling",
    "slug": "gebling",
    "classification": "erste-lage"
  },
  {
    "name": "Schreck",
    "slug": "schreck",
    "classification": "erste-lage"
  },
  {
    "name": "Danzern",
    "slug": "danzern",
    "classification": "erste-lage"
  },
  {
    "name": "Sandgrube",
    "slug": "sandgrube",
    "classification": "erste-lage"
  },
  {
    "name": "Pellingen",
    "slug": "pellingen",
    "classification": "erste-lage"
  },
  {
    "name": "Pfenningberg",
    "slug": "pfenningberg",
    "classification": "erste-lage"
  },
  {
    "name": "Hochacker",
    "slug": "hochacker",
    "classification": "erste-lage"
  },
  {
    "name": "Ehrenfels",
    "slug": "ehrenfels",
    "classification": "erste-lage"
  },
  {
    "name": "Spiegel",
    "slug": "spiegel",
    "classification": "erste-lage"
  },
  {
    "name": "Steingraben",
    "slug": "steingraben",
    "classification": "erste-lage"
  },
  {
    "name": "Vordernberg",
    "slug": "vordernberg",
    "classification": "erste-lage"
  },
  {
    "name": "Wieland",
    "slug": "wieland",
    "classification": "erste-lage"
  },
  {
    "name": "Mosburgerin",
    "slug": "mosburgerin",
    "classification": "erste-lage"
  },
  {
    "name": "Gottschelle",
    "slug": "gottschelle",
    "classification": "erste-lage"
  },
  {
    "name": "Silberbichl",
    "slug": "silberbichl",
    "classification": "erste-lage"
  },
  {
    "name": "Weinzierlberg",
    "slug": "weinzierlberg",
    "classification": "erste-lage"
  },
  {
    "name": "Hintere Point",
    "slug": "hintere-point",
    "classification": "erste-lage"
  },
  {
    "name": "Oberfeld",
    "slug": "oberfeld",
    "classification": "erste-lage"
  },
  {
    "name": "Steinbühel",
    "slug": "steinbuhel",
    "classification": "erste-lage"
  },
  {
    "name": "Hinters Kirchl",
    "slug": "hinters-kirchl",
    "classification": "erste-lage"
  }
] as const;

export default function KremstalPage() {
  return (
    <RegionLayout
      title="Kremstal"
      level="region"
      parentRegion="austria"
      sidebarLinks={KREMSTAL_VINEYARDS}
      contentFile="kremstal-guide.md"
    />
  );
}
