import { createDirectus, rest, readItems, readSingleton } from '@directus/sdk';
import type { Production, BlogPost, Event, Venue, HomePage, SiteSettings } from '@flux-theatre/shared';

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
  site_settings: SiteSettings;
}

export const useDirectus = () => {
  const config = useRuntimeConfig();
  const directusUrl = config.public.directusUrl;

  // Initialize the Directus client with the REST support
  const client = createDirectus<Schema>(directusUrl).with(rest());

  /**
   * Helper to get the full URL for a Directus asset
   */
  const getAssetUrl = (id: string | null | undefined) => {
    if (!id) return null;
    return `${directusUrl}/assets/${id}`;
  };

  return {
    client,
    readItems,
    readSingleton,
    getAssetUrl,
  };
};
