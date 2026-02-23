import RegionLayout from '@/components/RegionLayout';

export default function ClimatduValPage() {
  return (
    <RegionLayout
      title="Climat du Val"
      level="vineyard"
      parentRegion="france/burgundy/cote-de-beaune/auxey-duresses"
      classification="premier-cru"
      contentFile="climat-du-val-guide.md"
    />
  );
}
