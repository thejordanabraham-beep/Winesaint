import RegionLayout from '@/components/RegionLayout';

const THERMENREGION_VINEYARDS = [
  {
    "name": "Brindlbach",
    "slug": "brindlbach",
    "classification": "erste-lage"
  },
  {
    "name": "Docterin",
    "slug": "docterin",
    "classification": "erste-lage"
  },
  {
    "name": "Eichkogel",
    "slug": "eichkogel",
    "classification": "erste-lage"
  },
  {
    "name": "Goldeck",
    "slug": "goldeck",
    "classification": "erste-lage"
  },
  {
    "name": "Igeln",
    "slug": "igeln",
    "classification": "erste-lage"
  },
  {
    "name": "Kreuzer",
    "slug": "kreuzer",
    "classification": "erste-lage"
  },
  {
    "name": "Mandelhöhe",
    "slug": "mandelhohe",
    "classification": "erste-lage"
  },
  {
    "name": "Pfarrgarten",
    "slug": "pfarrgarten",
    "classification": "erste-lage"
  },
  {
    "name": "Spiegel",
    "slug": "spiegel",
    "classification": "erste-lage"
  },
  {
    "name": "Tümpfel",
    "slug": "tumpfel",
    "classification": "erste-lage"
  },
  {
    "name": "Wiegen",
    "slug": "wiegen",
    "classification": "erste-lage"
  },
  {
    "name": "Rosengartl",
    "slug": "rosengartl",
    "classification": "erste-lage"
  },
  {
    "name": "Sonnenberg",
    "slug": "sonnenberg",
    "classification": "erste-lage"
  },
  {
    "name": "Hochberg",
    "slug": "hochberg",
    "classification": "erste-lage"
  },
  {
    "name": "Tatschenberg",
    "slug": "tatschenberg",
    "classification": "erste-lage"
  },
  {
    "name": "Haideberg",
    "slug": "haideberg",
    "classification": "erste-lage"
  },
  {
    "name": "Roter Berg",
    "slug": "roter-berg",
    "classification": "erste-lage"
  },
  {
    "name": "Steinfelsen",
    "slug": "steinfelsen",
    "classification": "erste-lage"
  },
  {
    "name": "Johannesberg",
    "slug": "johannesberg",
    "classification": "erste-lage"
  },
  {
    "name": "Rot-Kreuz",
    "slug": "rot-kreuz",
    "classification": "erste-lage"
  },
  {
    "name": "Steinriegel",
    "slug": "steinriegel",
    "classification": "erste-lage"
  }
] as const;

export default function ThermenregionPage() {
  return (
    <RegionLayout
      title="Thermenregion"
      level="region"
      parentRegion="austria"
      sidebarLinks={THERMENREGION_VINEYARDS}
      contentFile="thermenregion-guide.md"
    />
  );
}
