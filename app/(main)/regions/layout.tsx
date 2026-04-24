// Force all region pages to render on-demand instead of at build time
// This prevents build timeouts when generating thousands of static pages
export const revalidate = 3600;
export const dynamicParams = true;

export default function RegionsLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}
