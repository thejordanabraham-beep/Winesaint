import RegionLayout from '@/components/RegionLayout';

export default function LesTuvilainsPage() {
  return (
    <RegionLayout
      title="Les Tuvilains"
      level="vineyard"
      parentRegion="france/burgundy/cote-de-beaune/beaune"
      classification="premier-cru"
      contentFile="les-tuvilains-guide.md"
    />
  );
}
