import '@/components/maps/MapApp.css';

export const metadata = {
  title: 'Wine Maps | WineSaint',
  description: 'Explore wine regions around the world with our interactive maps.',
};

export default function MapsLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return <>{children}</>;
}
