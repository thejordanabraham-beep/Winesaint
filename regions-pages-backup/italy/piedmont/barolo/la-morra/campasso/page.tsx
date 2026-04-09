import RegionLayout from '@/components/RegionLayout';

export default function CampassoPage() {
  return (
    <RegionLayout
      title="Campasso"
      level="vineyard"
      parentRegion="italy/piedmont/barolo/la-morra"
      classification="mga"
      contentFile="campasso-guide.md"
    />
  );
}
