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
    description: string;          // Rich-text / HTML
    playwright: string;
    director: string | null;

    // Media
    poster_image: string | null;  // Directus file UUID → Supabase S3
    gallery: string[];             // Array of file UUIDs

    // Scheduling
    season: string;               // e.g. "2025–2026"
    opening_date: string | null;  // ISO date
    closing_date: string | null;
    showtimes: Showtime[];

    // Relations
    venue: string | Venue;        // UUID or populated
    cast: CastCredit[];
    crew: CrewCredit[];

    // SEO
    meta_title: string | null;
    meta_description: string | null;
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
    bio: string | null;           // Rich-text
    headshot: string | null;      // Directus file UUID
    website: string | null;
    pronouns: string | null;
}

// ─── Credits (Junction tables) ───

export interface CastCredit {
    id: string;
    person: string | Person;      // UUID or populated
    production: string | Production;
    role_name: string;            // e.g. "Hamlet"
    sort: number;
    is_understudy: boolean;
}

export interface CrewCredit {
    id: string;
    person: string | Person;
    production: string | Production;
    department: CrewDepartment;
    title: string;                // e.g. "Stage Manager", "Lighting Designer"
    sort: number;
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
    | 'other';

export interface Event extends DirectusBaseFields {
    title: string;
    slug: string;
    description: string;          // Rich-text / HTML
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

    // SEO
    meta_title: string | null;
    meta_description: string | null;
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
}

// ─── Blog / News ───

export interface BlogPost extends DirectusBaseFields {
    title: string;
    slug: string;
    excerpt: string | null;
    body: string;                 // Rich-text / HTML
    cover_image: string | null;
    author: string | Person;
    tags: string[];
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

// ─── Navigation ───

export interface NavigationItem {
    id: string;
    label: string;
    url: string;
    sort: number;
    children: NavigationItem[];
    is_external: boolean;
}
