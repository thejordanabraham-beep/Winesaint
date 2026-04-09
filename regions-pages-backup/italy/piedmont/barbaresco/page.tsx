import RegionLayout from '@/components/RegionLayout';

const BARBARESCO_COMMUNES = [
  {
    "name": "Barbaresco",
    "slug": "barbaresco"
  },
  {
    "name": "Neive",
    "slug": "neive"
  },
  {
    "name": "San Rocco Seno d'Elvio",
    "slug": "san-rocco-seno-d-elvio"
  },
  {
    "name": "Treiso",
    "slug": "treiso"
  }
] as const;

export default function BarbarescoPage() {
  return (
    <RegionLayout
      title="Barbaresco"
      level="sub-region"
      parentRegion="italy/piedmont"
      sidebarLinks={BARBARESCO_COMMUNES}
      contentFile="barbaresco-guide.md"
    />
  );
}
