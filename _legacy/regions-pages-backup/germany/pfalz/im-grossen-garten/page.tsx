import RegionLayout from '@/components/RegionLayout';

export default function ImGrossenGartenPage() {
  return (
    <RegionLayout
      title="Im Grossen Garten"
      level="vineyard"
      parentRegion="germany/pfalz"
      classification="grosses-gewachs"
      contentFile="im-grossen-garten-guide.md"
    />
  );
}
