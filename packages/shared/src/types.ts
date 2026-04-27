// ─────────────────────────────────────────────
//  Flux Theatre Ensemble — Shared Schema Types
//  Mirrors the Directus collection structure
// ─────────────────────────────────────────────

/** Directus system fields present on every collection item */
export interface DirectusBaseFields {
    id: string;
    status: 'published' | 'draft' | 'archived';
    date_created: string;
    date_updated: string | null;
    user_created: string;
    user_updated: string | null;
}

// ─── Productions ───

export interface Production extends DirectusBaseFields {
    title: string;
    slug: string;
    tagline: string | null;
    description: any | null;      // Structured JSON for Block Editor
    content: any | null;          // Main production content/overview
    playwright: string;
    director: string | null;

    // Media
    poster_image: string | null;  // Directus file UUID → Supabase S3
    gallery: string[];             // Array of file UUIDs

    // Scheduling
    season: string;               // e.g. "2025–2026"
    opening_date: string | null;  // ISO date
    closing_date: string | null;
    showtimes: Showtime[]; // Keeping for backward compatibility if needed, but we'll use events
    events: Event[];        // Unified event-based showtimes

    // Relations
    Venue: string | Venue;        // UUID or populated
    Cast: CastCredit[];
    Crew: CrewCredit[];
    funders: ProductionFunder[];

    // SEO
    meta_title: string | null;
    meta_description: string | null;
    featured: boolean;
}

export interface Showtime {
    id: string;
    datetime: string;             // ISO datetime
    ticket_url: string | null;
    is_sold_out: boolean;
    notes: string | null;         // e.g. "Preview", "Pay-What-You-Can"
}

// ─── People ───

export interface Person extends DirectusBaseFields {
    first_name: string;
    last_name: string;
    slug: string;
    bio: string | any | null;      // Rich-text or Block Editor JSON
    headshot: string | null;      // Directus file UUID
    website: string | null;
    pronouns: string | null;
    tags: PersonTag[];
}

export interface PersonTag {
    id: string;
    people_id: string | Person;
    tags_id: string | Tag;
}


// ─── Credits (Junction tables) ───

export interface CastCredit {
    id: string;
    person: string | Person;      // UUID or populated
    production: string | Production;
    role_name: string;            // e.g. Hamlet
    sort: number;
    is_understudy: boolean;
    content?: any | null;         // Production-specific bio override
}

export interface CrewCredit {
    id: string;
    person: string | Person;
    production: string | Production;
    department: CrewDepartment;
    title: string;                // e.g. "Stage Manager", "Lighting Designer"
    sort: number;
    content?: any | null;         // Production-specific bio override
}

export type CrewDepartment =
    | 'direction'
    | 'production'
    | 'stage_management'
    | 'scenic'
    | 'lighting'
    | 'sound'
    | 'costumes'
    | 'props'
    | 'dramaturgy'
    | 'marketing'
    | 'other';

// ─── Venues ───

export interface Venue extends DirectusBaseFields {
    name: string;
    slug: string;
    address: string | null;
    city: string;
    state: string;
    zip: string | null;
    capacity: number | null;
    website: string | null;
    maps_url: string | null;
    photo: string | null;
}

// ─── Funders ───

export interface Funder {
    id: string;
    name: string;
    slug: string;
    description: any | null;      // WYSIWYG / Block Editor
    url: string | null;
    image: string | null;         // Directus file UUID
}

export interface ProductionFunder {
    id: string;
    production_id: string | Production;
    funder_id: string | Funder;
}

export interface EventFunder {
    id: string;
    event_id: string | Event;
    funder_id: string | Funder;
}

export interface PageFunder {
    id: string;
    page_id: string | Page;
    funder_id: string | Funder;
}

export interface PagePerson {
    id: string;
    pages_id: string | Page;
    people_id: string | Person;
    sort: number | null;
}


// ─── Events (non-production) ───

export type EventFormat = 'in_person' | 'digital' | 'hybrid';

export type EventCategory =
    | 'workshop'
    | 'reading'
    | 'talkback'
    | 'fundraiser'
    | 'social'
    | 'audition'
    | 'masterclass'
    | 'community'
    | 'performance'
    | 'other';

export interface Event extends DirectusBaseFields {
    title: string;
    slug: string;
    description: string;          // Rich-text / HTML fallback
    content: any | null;          // Structured JSON for Block Editor
    excerpt: string | null;

    // Scheduling
    start_datetime: string;       // ISO datetime
    end_datetime: string | null;
    is_all_day: boolean;
    is_recurring: boolean;
    recurrence_rule: string | null; // iCal RRULE

    // Format & Location
    format: EventFormat;
    venue: string | Venue | null;
    virtual_url: string | null;   // Zoom / streaming link

    // Details
    category: EventCategory;
    cover_image: string | null;
    rsvp_url: string | null;
    ticket_url: string | null;
    is_free: boolean;
    price: string | null;         // e.g. "$15" or "Pay-What-You-Can"

    // Relations
    related_production: string | Production | null;
    tags: EventTag[];
    funders: EventFunder[];

    // SEO
    meta_title: string | null;
    meta_description: string | null;
    featured: boolean;
}

export interface EventTag {
    id: string;
    events_id: string | Event;
    tags_id: string | Tag;
}

// ─── Calendar (unified view helper) ───

export interface CalendarEntry {
    id: string;
    title: string;
    datetime: string;
    end_datetime: string | null;
    type: 'showtime' | 'event';
    slug: string;                  // links to production or event
    category?: EventCategory;
    format?: EventFormat;
    venue_name?: string;
    is_sold_out?: boolean;
    notes?: string | null;
    tags?: string[];
}

// ─── Blog / News ───

export interface Tag extends DirectusBaseFields {
    name: string;
}

export interface PostTag {
    id: string;
    posts_id: string | BlogPost;
    tags_id: string | Tag;
}

export interface BlogPost extends DirectusBaseFields {
    title: string;
    slug: string;
    excerpt: string | null;
    body: string;                 // Rich-text / HTML fallback
    content: any | null;          // Structured JSON for Block Editor
    cover_image: string | null;
    cover_image_override: string | null;
    gallery: string[] | null;     // Array of file UUIDs
    author: string | Person;
    tags: PostTag[];
    publish_date: string;
    meta_title: string | null;
    meta_description: string | null;
}

// ─── Site Settings (Singleton) ───

export interface SiteSettings {
    id: string;
    site_title: string;
    tagline: string | null;
    logo: string | null;
    favicon: string | null;
    social_facebook: string | null;
    social_instagram: string | null;
    social_twitter: string | null;
    social_youtube: string | null;
    footer_text: string | null;
    donate_url: string | null;
    mailing_list_url: string | null;
}

// ─── Hero Slides ───

export interface HeroSlide {
    id: string;
    status: 'published' | 'draft' | 'archived';
    sort: number | null;
    title: string | null;
    subtitle: string | null;
    description: string | null;
    background_image: string | null;  // Directus file UUID
    cta_primary_label: string | null;
    cta_primary_url: string | null;    // Calculated by Flow
    cta_primary_type: 'internal' | 'external' | null;
    cta_primary_link: any | null;      // M2A relationship
    cta_primary_external: string | null;

    cta_secondary_label: string | null;
    cta_secondary_url: string | null;  // Calculated by Flow
    cta_secondary_type: 'internal' | 'external' | null;
    cta_secondary_link: any | null;    // M2A relationship
    cta_secondary_external: string | null;
    homepage_id: string | null;
}

// ─── Homepage (Singleton) ───

export interface HomePage {
    id: string;
    hero_tagline: string | null;
    hero_title: string;
    hero_description: string | null;
    hero_image: string | null;
    hero_cta_primary_text: string | null;
    hero_cta_primary_link: string | null;
    hero_cta_secondary_text: string | null;
    hero_cta_secondary_link: string | null;
    mission_statement: string | null;
    mission_background_image: string | null;
    // Hero carousel slides (O2M)
    hero_slides: HeroSlide[] | null;
}

// ─── Pages ───

export interface Page extends DirectusBaseFields {
    title: string;
    slug: string;
    body: string;                 // Rich-text / HTML fallback
    content: any | null;          // Structured JSON for Block Editor
    funders: PageFunder[];
    people_label: string | null;
    people: PagePerson[];
    meta_title: string | null;
    meta_description: string | null;
}

// ─── Groups ───

export interface Group extends DirectusBaseFields {
    title: string;
    slug: string;
    subtitle: string | null;
    tag_label: string | null;     // Custom label for related content section
    content: any | null;          // Structured JSON for Block Editor
    hero_image: string | null;    // Directus file UUID
    tags: GroupTag[];
}


export interface GroupTag {
    id: string;
    groups_id: string | Group;
    tags_id: string | Tag;
}


// ─── Navigation ───

export interface NavigationItem {
    id: string;
    label: string;
    url: string | null;           // Manual URL (e.g., external or static)
    page: string | Page | null;   // Link to an internal Page
    sort: number;
    parent: string | NavigationItem | null;
    children: NavigationItem[];
    is_external: boolean;
}
