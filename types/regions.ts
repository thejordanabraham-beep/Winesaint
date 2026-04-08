// TypeScript interfaces for wine region data structure

export interface RegionContent {
  overview: string;
  climate: string;
  soil: string;
  key_facts: string[];
}

export interface Region {
  id: string;
  name: string;
  slug: string;
  country: string;
  country_slug: string;
  hierarchy_level: string;
  parent_region: string | null;
  content: RegionContent;
  grapes: string[];
  wine_styles: string[];
  subregions: string[];
  children: Region[];
}

export interface Country {
  name: string;
  slug: string;
  overview: string;
  regions: Record<string, Region>;
}

export interface RegionsHierarchical {
  guide_type: string;
  source_file: string;
  parsed_date: string;
  total_countries: number;
  countries: Record<string, Country>;
}

export interface BreadcrumbItem {
  name: string;
  href: string;
}

export interface CountryPageData {
  type: 'country';
  name: string;
  slug: string;
  overview: string;
  regions: Region[];
  breadcrumb: BreadcrumbItem[];
}

export interface RegionPageData extends Region {
  type: 'region';
  breadcrumb: BreadcrumbItem[];
}

export type PageData = CountryPageData | RegionPageData | null;
