import RegionLayout from '@/components/RegionLayout';

const CARNUNTUM_VINEYARDS = [
  {
    "name": "Stuhlwerker",
    "slug": "stuhlwerker",
    "classification": "erste-lage"
  },
  {
    "name": "Schüttenberg",
    "slug": "schuttenberg",
    "classification": "erste-lage"
  },
  {
    "name": "Rosenberg",
    "slug": "rosenberg",
    "classification": "erste-lage"
  },
  {
    "name": "Haidacker",
    "slug": "haidacker",
    "classification": "erste-lage"
  },
  {
    "name": "Bärnreiser",
    "slug": "barnreiser",
    "classification": "erste-lage"
  },
  {
    "name": "Steinäcker",
    "slug": "steinacker",
    "classification": "erste-lage"
  },
  {
    "name": "Aubühl",
    "slug": "aubuhl",
    "classification": "erste-lage"
  },
  {
    "name": "Kirchweingarten",
    "slug": "kirchweingarten",
    "classification": "erste-lage"
  },
  {
    "name": "Spitzerberg",
    "slug": "spitzerberg",
    "classification": "erste-lage"
  }
] as const;

export default function CarnuntumPage() {
  return (
    <RegionLayout
      title="Carnuntum"
      level="region"
      parentRegion="austria"
      sidebarLinks={CARNUNTUM_VINEYARDS}
      contentFile="carnuntum-guide.md"
    />
  );
}
