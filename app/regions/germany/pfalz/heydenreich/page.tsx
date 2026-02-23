import RegionLayout from '@/components/RegionLayout';

export default function HeydenreichPage() {
  return (
    <RegionLayout
      title="Heydenreich"
      level="vineyard"
      parentRegion="germany/pfalz"
      classification="grosses-gewachs"
      contentFile="heydenreich-guide.md"
    />
  );
}
