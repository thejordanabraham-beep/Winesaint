import RegionLayout from '@/components/RegionLayout';

const WIEN_VINEYARDS = [
  {
    "name": "Preussen",
    "slug": "preussen",
    "classification": "erste-lage"
  },
  {
    "name": "Rosengartl",
    "slug": "rosengartl",
    "classification": "erste-lage"
  },
  {
    "name": "Langteufel",
    "slug": "langteufel",
    "classification": "erste-lage"
  },
  {
    "name": "Ulm",
    "slug": "ulm",
    "classification": "erste-lage"
  },
  {
    "name": "Gollin",
    "slug": "gollin",
    "classification": "erste-lage"
  },
  {
    "name": "Seidenhaus",
    "slug": "seidenhaus",
    "classification": "erste-lage"
  },
  {
    "name": "Schenkenberg",
    "slug": "schenkenberg",
    "classification": "erste-lage"
  },
  {
    "name": "Steinberg",
    "slug": "steinberg",
    "classification": "erste-lage"
  },
  {
    "name": "Wiesthalen",
    "slug": "wiesthalen",
    "classification": "erste-lage"
  },
  {
    "name": "Falkenberg",
    "slug": "falkenberg",
    "classification": "erste-lage"
  },
  {
    "name": "Sätzen",
    "slug": "satzen",
    "classification": "erste-lage"
  },
  {
    "name": "Himmel",
    "slug": "himmel",
    "classification": "erste-lage"
  }
] as const;

export default function WienPage() {
  return (
    <RegionLayout
      title="Wien"
      level="region"
      parentRegion="austria"
      sidebarLinks={WIEN_VINEYARDS}
      contentFile="wien-guide.md"
    />
  );
}
