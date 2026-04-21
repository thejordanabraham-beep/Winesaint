import RegionLayout from '@/components/RegionLayout';

export default function LEtoilePage() {
  return (
    <RegionLayout
      title="L'Étoile"
      level="sub-region"
      parentRegion="france/jura"
      contentFile="l-etoile-guide.md"
    />
  );
}
