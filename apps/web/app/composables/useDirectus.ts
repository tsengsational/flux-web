import { createDirectus, rest, readItems, readSingleton } from '@directus/sdk';
import type { Production, BlogPost, Event, Venue, HomePage, HeroSlide, SiteSettings, Page, Person, CastCredit, CrewCredit } from '@flux-theatre/shared';

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
}

export const useDirectus = () => {
  const config = useRuntimeConfig();
  const rawUrl = config.public.directusUrl;
  const directusUrl = rawUrl.startsWith('http') ? rawUrl : `https://${rawUrl}`;

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
