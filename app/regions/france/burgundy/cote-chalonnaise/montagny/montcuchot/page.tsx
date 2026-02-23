import RegionLayout from '@/components/RegionLayout';

export default function MontcuchotPage() {
  return (
    <RegionLayout
      title="Montcuchot"
      level="vineyard"
      parentRegion="france/burgundy/cote-chalonnaise/montagny"
      classification="premier-cru"
      contentFile="montcuchot-guide.md"
    />
  );
}
