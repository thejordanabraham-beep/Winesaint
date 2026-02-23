import RegionLayout from '@/components/RegionLayout';

export default function DolcettoAlbaPage() {
  return (
    <RegionLayout
      title="Dolcetto d'Alba"
      level="sub-region"
      parentRegion="italy/piedmont"
      contentFile="dolcetto-dalba-guide.md"
    />
  );
}
