import RegionLayout from '@/components/RegionLayout';

export default function CastagniPage() {
  return (
    <RegionLayout
      title="Castagni"
      level="vineyard"
      parentRegion="italy/piedmont/barolo/la-morra"
      classification="mga"
      contentFile="castagni-guide.md"
    />
  );
}
