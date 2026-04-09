import RegionLayout from '@/components/RegionLayout';

export default function SchlenzenbergPage() {
  return (
    <RegionLayout
      title="Schlenzenberg"
      level="vineyard"
      parentRegion="germany/rheingau"
      classification="grosses-gewachs"
      contentFile="schlenzenberg-guide.md"
    />
  );
}
