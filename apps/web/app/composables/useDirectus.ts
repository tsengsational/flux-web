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


export const useDirectus = () => {
  const config = useRuntimeConfig();
  const rawUrl = config.public.directusUrl;
  const directusUrl = rawUrl.startsWith('http') ? rawUrl : `https://${rawUrl}`;

  // Initialize the Directus client with the REST support
  const client = createDirectus<Schema>(directusUrl).with(rest());

  /**
   * Helper to get the full URL for a Directus asset with optional transformations
   */
  const getAssetUrl = (id: string | null | undefined, options?: { width?: number; height?: number; quality?: number; format?: string }) => {
    if (!id) return null;
    let url = `${directusUrl}/assets/${id}`;
    
    if (options) {
      const params = new URLSearchParams();
      if (options.width) params.append('width', options.width.toString());
      if (options.height) params.append('height', options.height.toString());
      if (options.quality) params.append('quality', options.quality.toString());
      
      // Default to webp for better compression unless specified
      params.append('format', options.format || 'webp');
      
      url += `?${params.toString()}`;
    }
    
    return url;
  };

  return {
    client,
    readItems,
    readSingleton,
    getAssetUrl,
  };
};
