import RegionLayout from '@/components/RegionLayout';

export default function LaClapePage() {
  return (
    <RegionLayout
      title="La Clape"
      level="sub-region"
      parentRegion="france/languedoc"
      contentFile="la-clape-guide.md"
    />
  );
}
