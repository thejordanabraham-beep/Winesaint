import RegionLayout from '@/components/RegionLayout';
import { notFound } from 'next/navigation';
import { Metadata } from 'next';
import regionConfigs from '../../data/region-configs.json';

// Force dynamic rendering
export const dynamic = 'force-dynamic';
export const dynamicParams = true;

interface SidebarLink {
  name: string;
  slug: string;
  classification?: string;
}

interface PageConfig {
  title: string;
  level: 'country' | 'region' | 'sub-region' | 'village' | 'vineyard';
  parentRegion?: string;
  contentFile: string;
  sidebarLinks?: SidebarLink[];
  sidebarTitle?: string;
}

const configs = regionConfigs as Record<string, PageConfig>;

export async function generateMetadata({ params }: { params: Promise<{ slug: string[] }> }): Promise<Metadata> {
  const { slug } = await params;
  const pathKey = slug.join('/');
  const config = configs[pathKey];

  if (!config) {
    return { title: 'Region Not Found | WineSaint' };
  }

  return {
    title: `${config.title} Wine Guide | WineSaint`,
    description: `Complete guide to ${config.title} wines, terroir, and producers.`
  };
}

export default async function RegionPage({ params }: { params: Promise<{ slug: string[] }> }) {
  const { slug } = await params;
  const pathKey = slug.join('/');
  const config = configs[pathKey];

  if (!config) {
    notFound();
  }

  return (
    <RegionLayout
      title={config.title}
      level={config.level}
      parentRegion={config.parentRegion}
      sidebarLinks={config.sidebarLinks}
      sidebarTitle={config.sidebarTitle}
      contentFile={config.contentFile}
    />
  );
}
