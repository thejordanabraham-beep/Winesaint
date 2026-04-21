import RegionLayout from '@/components/RegionLayout';

export default function LesHautsDoixPage() {
  return (
    <RegionLayout
      title="Les Hauts Doix"
      level="vineyard"
      parentRegion="france/burgundy/cote-de-nuits/chambolle-musigny"
      classification="premier-cru"
      contentFile="les-hauts-doix-guide.md"
    />
  );
}
