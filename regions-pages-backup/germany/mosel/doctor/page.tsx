import RegionLayout from '@/components/RegionLayout';

export default function DoctorPage() {
  return (
    <RegionLayout
      title="Doctor"
      level="vineyard"
      parentRegion="germany/mosel"
      classification="grosses-gewachs"
      contentFile="doctor-guide.md"
    />
  );
}
