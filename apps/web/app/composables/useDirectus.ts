import { createDirectus, rest, readItems, readSingleton } from '@directus/sdk';
import type { Production, BlogPost, Event, Venue, HomePage, HeroSlide, SiteSettings, Page, Person, CastCredit, CrewCredit, Group } from '@flux-theatre/shared';

/**
 * Interface for the Directus schema
 * This maps our shared types to the collection names in Directus
 */
export interface Schema {
  productions: Production[];
  posts: BlogPost[];
  events: Event[];
  venues: Venue[];
  homepage: HomePage;
  hero_slides: HeroSlide[];
  site_settings: SiteSettings;
  pages: Page[];
  people: Person[];
  productions_cast: CastCredit[];
  productions_crew: CrewCredit[];
  groups: Group[];
}


export interface AssetOptions {
  width?: number;
  height?: number;
  quality?: number;
  format?: 'webp' | 'jpg' | 'png' | 'avif';
  fit?: 'cover' | 'contain' | 'inside' | 'outside';
  withoutEnlargement?: boolean;
}

export interface ResponsiveConfig {
  [breakpoint: string]: number | (Omit<AssetOptions, 'width'> & { width: number });
}

const DEFAULT_BREAKPOINTS: Record<string, number> = {
  sm: 640,
  md: 768,
  lg: 1024,
  xl: 1280,
  '2xl': 1536
};

export const useDirectus = () => {
  const config = useRuntimeConfig();
  const rawUrl = (config.public.directusUrl as string) || '';
  const directusUrl = rawUrl.startsWith('http') ? rawUrl : `https://${rawUrl}`;

  // Use the local proxy on the client to avoid CORS, but use the direct URL on the server for speed
  const requestUrl = useRequestURL();
  const clientUrl = import.meta.client ? requestUrl.origin : directusUrl;

  // Initialize the Directus client with the REST support
  const client = createDirectus<Schema>(clientUrl).with(rest());

  /**
   * Helper to get the full URL for a Directus asset with optional transformations
   */
  const getAssetUrl = (id: string | null | undefined, options?: AssetOptions) => {
    if (!id) return null;
    // Use relative path for assets to ensure consistency between SSR and CSR and use the local proxy
    let url = `/assets/${id}`;
    
    const params = new URLSearchParams();
    const format = options?.format || 'webp';
    params.append('format', format);

    if (options) {
      if (options.width) params.append('width', options.width.toString());
      if (options.height) params.append('height', options.height.toString());
      if (options.quality) params.append('quality', options.quality.toString());
      if (options.fit) params.append('fit', options.fit);
      if (options.withoutEnlargement) params.append('withoutEnlargement', 'true');
    }
    
    const queryString = params.toString();
    return queryString ? `${url}?${queryString}` : url;
  };

  /**
   * Helper to generate src, srcset, and sizes attributes for a responsive image
   */
  const getImageProps = (id: string | null | undefined, config: ResponsiveConfig, baseOptions: Omit<AssetOptions, 'width'> = { quality: 80 }) => {
    if (!id) return {};

    // Sort breakpoints by size
    const sortedBreakpoints = Object.entries(config)
      .map(([key, val]) => ({
        key,
        width: typeof val === 'number' ? val : val.width,
        breakpointWidth: DEFAULT_BREAKPOINTS[key] || parseInt(key) || 0,
        options: typeof val === 'number' ? {} : val
      }))
      .sort((a, b) => a.breakpointWidth - b.breakpointWidth);

    // Generate srcset
    const srcset = sortedBreakpoints
      .map(bp => `${getAssetUrl(id, { ...baseOptions, ...bp.options, width: bp.width })} ${bp.width}w`)
      .join(', ');

    // Generate sizes attribute
    const sizesParts = sortedBreakpoints.map((bp, i) => {
      if (i === sortedBreakpoints.length - 1) {
        return `${bp.width}px`;
      }
      return `(max-width: ${bp.breakpointWidth}px) ${bp.width}px`;
    });
    const sizes = sizesParts.join(', ');

    // Default src to the largest or a reasonable base
    const defaultWidth = sortedBreakpoints[0]?.width || 800;

    return {
      src: getAssetUrl(id, { ...baseOptions, width: defaultWidth }) || '',
      srcset,
      sizes
    };
  };

  return {
    client,
    readItems,
    readSingleton,
    getAssetUrl,
    getImageProps,
  };
};
