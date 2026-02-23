import RegionLayout from '@/components/RegionLayout';

const SAN_ROCCO_SENO_D_ELVIO_MGAS = [
  {
    "name": "Montersino",
    "slug": "montersino",
    "classification": "mga"
  }
] as const;

export default function SanRoccoSenodElvioPage() {
  return (
    <RegionLayout
      title="San Rocco Seno d'Elvio"
      level="village"
      parentRegion="italy/piedmont/barbaresco"
      sidebarLinks={SAN_ROCCO_SENO_D_ELVIO_MGAS}
      contentFile="san-rocco-seno-d-elvio-guide.md"
    />
  );
}
