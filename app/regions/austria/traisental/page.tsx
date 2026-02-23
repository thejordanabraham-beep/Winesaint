import RegionLayout from '@/components/RegionLayout';

const TRAISENTAL_VINEYARDS = [
  {
    "name": "Alte Setzen",
    "slug": "alte-setzen",
    "classification": "erste-lage"
  },
  {
    "name": "Berg",
    "slug": "berg",
    "classification": "erste-lage"
  },
  {
    "name": "Hochschopf",
    "slug": "hochschopf",
    "classification": "erste-lage"
  },
  {
    "name": "Pletzengraben",
    "slug": "pletzengraben",
    "classification": "erste-lage"
  },
  {
    "name": "Rothenbart",
    "slug": "rothenbart",
    "classification": "erste-lage"
  },
  {
    "name": "Zwirch",
    "slug": "zwirch",
    "classification": "erste-lage"
  }
] as const;

export default function TraisentalPage() {
  return (
    <RegionLayout
      title="Traisental"
      level="region"
      parentRegion="austria"
      sidebarLinks={TRAISENTAL_VINEYARDS}
      contentFile="traisental-guide.md"
    />
  );
}
