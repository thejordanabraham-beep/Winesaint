import RegionLayout from '@/components/RegionLayout';

const KAMPTAL_VINEYARDS = [
  {
    "name": "Dechant",
    "slug": "dechant",
    "classification": "erste-lage"
  },
  {
    "name": "Loiserberg",
    "slug": "loiserberg",
    "classification": "erste-lage"
  },
  {
    "name": "Spiegel",
    "slug": "spiegel",
    "classification": "erste-lage"
  },
  {
    "name": "Seeberg",
    "slug": "seeberg",
    "classification": "erste-lage"
  },
  {
    "name": "Kittmannsberg",
    "slug": "kittmannsberg",
    "classification": "erste-lage"
  },
  {
    "name": "Steinhaus",
    "slug": "steinhaus",
    "classification": "erste-lage"
  },
  {
    "name": "Steinmassl",
    "slug": "steinmassl",
    "classification": "erste-lage"
  },
  {
    "name": "Thal",
    "slug": "thal",
    "classification": "erste-lage"
  },
  {
    "name": "Schenkenbichl",
    "slug": "schenkenbichl",
    "classification": "erste-lage"
  },
  {
    "name": "Käferberg",
    "slug": "kaferberg",
    "classification": "erste-lage"
  },
  {
    "name": "Gaisberg",
    "slug": "gaisberg",
    "classification": "erste-lage"
  },
  {
    "name": "Heiligenstein",
    "slug": "heiligenstein",
    "classification": "erste-lage"
  },
  {
    "name": "Kogelberg",
    "slug": "kogelberg",
    "classification": "erste-lage"
  },
  {
    "name": "Grub",
    "slug": "grub",
    "classification": "erste-lage"
  },
  {
    "name": "Lamm",
    "slug": "lamm",
    "classification": "erste-lage"
  },
  {
    "name": "Renner",
    "slug": "renner",
    "classification": "erste-lage"
  },
  {
    "name": "Offenberg",
    "slug": "offenberg",
    "classification": "erste-lage"
  },
  {
    "name": "Wechselberg Spiegel",
    "slug": "wechselberg-spiegel",
    "classification": "erste-lage"
  },
  {
    "name": "Berg Vogelsang",
    "slug": "berg-vogelsang",
    "classification": "erste-lage"
  }
] as const;

export default function KamptalPage() {
  return (
    <RegionLayout
      title="Kamptal"
      level="region"
      parentRegion="austria"
      sidebarLinks={KAMPTAL_VINEYARDS}
      contentFile="kamptal-guide.md"
    />
  );
}
