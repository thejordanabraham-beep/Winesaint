import RegionLayout from '@/components/RegionLayout';

export default function SteinbuckelPage() {
  return (
    <RegionLayout
      title="Steinbuckel"
      level="vineyard"
      parentRegion="germany/pfalz"
      classification="grosses-gewachs"
      contentFile="steinbuckel-guide.md"
    />
  );
}
