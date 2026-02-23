import RegionLayout from '@/components/RegionLayout';

const WAGRAM_VINEYARDS = [
  {
    "name": "Rosenberg",
    "slug": "rosenberg",
    "classification": "erste-lage"
  },
  {
    "name": "Spiegel",
    "slug": "spiegel",
    "classification": "erste-lage"
  },
  {
    "name": "Stein Engabrunn",
    "slug": "stein-engabrunn",
    "classification": "erste-lage"
  },
  {
    "name": "Scheiben",
    "slug": "scheiben",
    "classification": "erste-lage"
  },
  {
    "name": "Mordthal",
    "slug": "mordthal",
    "classification": "erste-lage"
  },
  {
    "name": "Steinberg",
    "slug": "steinberg",
    "classification": "erste-lage"
  },
  {
    "name": "Gmirk",
    "slug": "gmirk",
    "classification": "erste-lage"
  },
  {
    "name": "Schlossberg",
    "slug": "schlossberg",
    "classification": "erste-lage"
  },
  {
    "name": "Brenner",
    "slug": "brenner",
    "classification": "erste-lage"
  },
  {
    "name": "Kirchtal",
    "slug": "kirchtal",
    "classification": "erste-lage"
  },
  {
    "name": "Stössing",
    "slug": "stossing",
    "classification": "erste-lage"
  },
  {
    "name": "Achleiten",
    "slug": "achleiten",
    "classification": "erste-lage"
  },
  {
    "name": "Altenberg",
    "slug": "altenberg",
    "classification": "erste-lage"
  },
  {
    "name": "Baiern",
    "slug": "baiern",
    "classification": "erste-lage"
  },
  {
    "name": "Berg",
    "slug": "berg",
    "classification": "erste-lage"
  },
  {
    "name": "Dechant",
    "slug": "dechant",
    "classification": "erste-lage"
  },
  {
    "name": "Edelgrund",
    "slug": "edelgrund",
    "classification": "erste-lage"
  },
  {
    "name": "Ehrenfels",
    "slug": "ehrenfels",
    "classification": "erste-lage"
  },
  {
    "name": "Engabrunn",
    "slug": "engabrunn",
    "classification": "erste-lage"
  },
  {
    "name": "Fels",
    "slug": "fels",
    "classification": "erste-lage"
  },
  {
    "name": "Gaisberg",
    "slug": "gaisberg",
    "classification": "erste-lage"
  },
  {
    "name": "Goldberg",
    "slug": "goldberg",
    "classification": "erste-lage"
  },
  {
    "name": "Gottschelle",
    "slug": "gottschelle",
    "classification": "erste-lage"
  },
  {
    "name": "Hasel",
    "slug": "hasel",
    "classification": "erste-lage"
  },
  {
    "name": "Hermannsberg",
    "slug": "hermannsberg",
    "classification": "erste-lage"
  },
  {
    "name": "Hochacker",
    "slug": "hochacker",
    "classification": "erste-lage"
  },
  {
    "name": "Hoher Rain",
    "slug": "hoher-rain",
    "classification": "erste-lage"
  },
  {
    "name": "Kollektion",
    "slug": "kollektion",
    "classification": "erste-lage"
  },
  {
    "name": "Kremser Berg",
    "slug": "kremser-berg",
    "classification": "erste-lage"
  },
  {
    "name": "Lindberg",
    "slug": "lindberg",
    "classification": "erste-lage"
  },
  {
    "name": "Loiserberg",
    "slug": "loiserberg",
    "classification": "erste-lage"
  },
  {
    "name": "Neuberg",
    "slug": "neuberg",
    "classification": "erste-lage"
  },
  {
    "name": "Pellingen",
    "slug": "pellingen",
    "classification": "erste-lage"
  },
  {
    "name": "Pfaffenberg",
    "slug": "pfaffenberg",
    "classification": "erste-lage"
  },
  {
    "name": "Point",
    "slug": "point",
    "classification": "erste-lage"
  },
  {
    "name": "Sandgrube",
    "slug": "sandgrube",
    "classification": "erste-lage"
  },
  {
    "name": "Silberbichl",
    "slug": "silberbichl",
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
    "name": "Wachtberg",
    "slug": "wachtberg",
    "classification": "erste-lage"
  }
] as const;

export default function WagramPage() {
  return (
    <RegionLayout
      title="Wagram"
      level="region"
      parentRegion="austria"
      sidebarLinks={WAGRAM_VINEYARDS}
      contentFile="wagram-guide.md"
    />
  );
}
