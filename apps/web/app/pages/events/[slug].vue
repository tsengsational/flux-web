<script setup lang="ts">
import type { EventFormat, EventCategory } from '@flux-theatre/shared';

const route = useRoute();
const slug = route.params.slug as string;

// In production: const { data } = await useFetch(`/api/events/${slug}`)
// Placeholder data for scaffolding:
const events = [
  {
    title: 'Flux Sundays: New Play Readings',
    slug: 'flux-sundays-march-2026',
    excerpt: 'Join us for our monthly reading series featuring two new short plays by emerging playwrights, followed by a community talkback.',
    body: `
      <p>Flux Sundays is our longest-running program — a monthly reading series dedicated to the 
      development of new work. Each month, we feature two new short plays or excerpts from full-length 
      works by emerging playwrights, followed by a moderated talkback with the community.</p>
      <p>This is a space for playwrights to hear their words out loud, and for audiences to witness 
      the spark of a new story. We invite you to stay after the readings for refreshments and 
      conversation with the artists.</p>
    `,
    cover_image: null,
    start_datetime: '2026-03-16T14:00:00',
    end_datetime: '2026-03-16T17:00:00',
    format: 'in_person' as EventFormat,
    category: 'reading' as EventCategory,
    venue: { 
      name: 'The 4th Street Theatre',
      address: '83 East 4th Street',
      city: 'New York',
      state: 'NY',
    },
    virtual_url: null,
    is_free: true,
    price: null,
    rsvp_url: '#',
  },
  {
    title: 'Playwriting Masterclass with Aria Chen',
    slug: 'masterclass-aria-chen',
    excerpt: 'A two-hour intensive on structure, voice, and the politics of place in contemporary playwriting.',
    body: `
      <p>Award-winning playwright Aria Chen (<em>Neon Wilderness</em>) leads this intensive masterclass 
      focused on the specific relationship between narrative structure and geography. How do the 
      spaces we inhabit shape the stories we tell? And how can we subvert traditional structures 
      to better reflect contemporary life?</p>
      <p>This session is open to playwrights of all experience levels. Participants should come 
      prepared with a short scene (2-3 pages) they are currently working on.</p>
    `,
    cover_image: null,
    start_datetime: '2026-03-22T10:00:00',
    end_datetime: '2026-03-22T12:00:00',
    format: 'hybrid' as EventFormat,
    category: 'masterclass' as EventCategory,
    venue: { 
      name: 'Flux Studio',
      address: 'Flux Theatre Ensemble Studio',
      city: 'New York',
      state: 'NY',
    },
    virtual_url: '#',
    is_free: false,
    price: '$35 / Pay-What-You-Can',
    rsvp_url: '#',
  },
  {
    title: 'Virtual Talkback: Directing The Tempest Today',
    slug: 'talkback-directing-tempest',
    excerpt: 'Director Elena Vasquez discusses her approach to reimagining Shakespeare for a contemporary audience.',
    body: `
      <p>Join Artistic Director Elena Vasquez for a deep dive into the creative process behind our 
      upcoming production of <em>The Tempest Reimagined</em>. This virtual talkback will explore 
      the challenges and opportunities of staging Shakespeare in 2026, focusing on themes of 
      environmental justice, power dynamics, and digital isolation.</p>
      <p>The session will include a 45-minute presentation followed by an open Q&A with the audience.</p>
    `,
    start_datetime: '2026-04-02T19:00:00',
    end_datetime: '2026-04-02T20:30:00',
    format: 'digital' as EventFormat,
    category: 'talkback' as EventCategory,
    venue: null,
    virtual_url: '#',
    is_free: true,
    price: null,
    rsvp_url: '#',
  },
  {
    title: 'Annual Spring Fundraiser Gala',
    slug: 'spring-gala-2026',
    excerpt: 'An evening of performances, cocktails, and celebration supporting Flux\'s mission of adventurous theatre.',
    body: `
      <p>Celebrate two decades of adventurous theatre at Flux Theatre Ensemble's Annual Spring 
      Fundraiser Gala. This year's event features pop-up performances from past Flux favorites, 
      a signature cocktail hour, and a silent auction featuring unique theatre experiences.</p>
      <p>All proceeds support our 2026-2027 season and our Open Account ticketing model, ensuring 
      accessible theatre for all.</p>
    `,
    start_datetime: '2026-04-25T18:30:00',
    end_datetime: '2026-04-25T22:00:00',
    format: 'in_person' as EventFormat,
    category: 'fundraiser' as EventCategory,
    venue: { name: 'The Green Room NYC' },
    virtual_url: null,
    is_free: false,
    price: '$75',
    rsvp_url: '#',
  },
  {
    title: 'Open Auditions: Neon Wilderness',
    slug: 'auditions-neon-wilderness',
    excerpt: 'Seeking actors for Aria Chen\'s bold new work. All ethnicities and gender expressions welcome.',
    body: `
      <p>Flux Theatre Ensemble is holding open auditions for our summer production of 
      <em>Neon Wilderness</em>. We are looking for a diverse ensemble of performers comfortable 
      with movement and text-heavy work.</p>
      <p>Please prepare one contemporary monologue (no more than 2 minutes). Bring a headshot 
      and resume if you have them; if not, we will have forms available on-site.</p>
    `,
    start_datetime: '2026-05-10T10:00:00',
    end_datetime: '2026-05-10T17:00:00',
    format: 'in_person' as EventFormat,
    category: 'audition' as EventCategory,
    venue: { name: 'Flux Studio' },
    virtual_url: null,
    is_free: true,
    price: null,
    rsvp_url: '#',
  },
  {
    title: 'Community Workshop: Devising from Dream',
    slug: 'workshop-devising-dream',
    excerpt: 'A free workshop exploring dream-based devising techniques. No experience necessary.',
    body: `
      <p>How do we translate the subconscious logic of dreams into theatrical form? This free 
      community workshop introduces participants to Flux's unique approach to devising from dream 
      and memory. Through guided exercises in movement, automatic writing, and collective 
      storytelling, we will build original performance fragments in real-time.</p>
    `,
    start_datetime: '2026-05-17T13:00:00',
    end_datetime: '2026-05-17T16:00:00',
    format: 'in_person' as EventFormat,
    category: 'workshop' as EventCategory,
    venue: { name: 'The 4th Street Theatre' },
    virtual_url: null,
    is_free: true,
    price: null,
    rsvp_url: '#',
  },
];

const event = computed(() => {
  return events.find(e => e.slug === slug) || events[0];
});

useSeoMeta({
  title: `${event.value.title} — Flux Theatre Ensemble`,
  description: event.value.excerpt || '',
});

const formattedDate = computed(() => {
  const d = new Date(event.value.start_datetime);
  return d.toLocaleDateString('en-US', { weekday: 'long', month: 'long', day: 'numeric', year: 'numeric' });
});

const formattedTime = computed(() => {
  const start = new Date(event.value.start_datetime);
  const startStr = start.toLocaleTimeString('en-US', { hour: 'numeric', minute: '2-digit' });
  
  if (event.value.end_datetime) {
    const end = new Date(event.value.end_datetime);
    const endStr = end.toLocaleTimeString('en-US', { hour: 'numeric', minute: '2-digit' });
    return `${startStr} – ${endStr}`;
  }
  
  return startStr;
});

const categoryLabel = computed(() => {
  const labels: Record<EventCategory, string> = {
    workshop: 'Workshop',
    reading: 'Reading',
    talkback: 'Talkback',
    fundraiser: 'Fundraiser',
    social: 'Social',
    audition: 'Audition',
    masterclass: 'Masterclass',
    community: 'Community',
    other: 'Event',
  };
  return labels[event.value.category];
});
</script>

<template>
  <article class="pb-24">
    <!-- Hero / Header -->
    <section class="relative pt-8 pb-16 bg-stage-900/40" id="event-detail-hero">
      <div class="relative max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
        <div class="flex flex-wrap items-center gap-3 mb-6">
          <NuxtLink to="/events" class="text-xs text-stage-400 hover:text-brand-400 transition-colors">
            &larr; All Events
          </NuxtLink>
          <span class="w-px h-3 bg-stage-700" />
          <span class="px-2.5 py-0.5 rounded-full text-xs font-semibold bg-brand-500/90 text-stage-950">
            {{ categoryLabel }}
          </span>
        </div>

        <h1 class="text-3xl sm:text-5xl lg:text-6xl font-serif font-bold text-stage-50 tracking-tight leading-tight">
          {{ event.title }}
        </h1>

        <div class="mt-8 flex flex-col sm:flex-row sm:items-center gap-6 text-stage-300">
          <!-- Date -->
          <div class="flex items-center gap-3">
            <div class="w-10 h-10 rounded-lg bg-stage-800 flex items-center justify-center text-brand-400">
              <svg class="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="1.5">
                <path stroke-linecap="round" stroke-linejoin="round" d="M6.75 3v2.25M17.25 3v2.25M3 18.75V7.5a2.25 2.25 0 012.25-2.25h13.5A2.25 2.25 0 0121 7.5v11.25m-18 0A2.25 2.25 0 005.25 21h13.5A2.25 2.25 0 0021 18.75m-18 0v-7.5A2.25 2.25 0 015.25 9h13.5A2.25 2.25 0 0121 11.25v7.5" />
              </svg>
            </div>
            <div>
              <p class="text-xs text-stage-500 uppercase font-bold tracking-wider">Date & Time</p>
              <p class="text-sm font-medium">{{ formattedDate }}</p>
              <p class="text-xs text-stage-400">{{ formattedTime }}</p>
            </div>
          </div>

          <!-- Location -->
          <div class="flex items-center gap-3">
            <div class="w-10 h-10 rounded-lg bg-stage-800 flex items-center justify-center text-brand-400">
              <svg v-if="event.format === 'digital'" class="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="1.5">
                <path stroke-linecap="round" stroke-linejoin="round" d="M9 17.25v1.007a3 3 0 01-.879 2.122L7.5 21h9l-.621-.621A3 3 0 0115 18.257V17.25m6-12V15a2.25 2.25 0 01-2.25 2.25H5.25A2.25 2.25 0 013 15V5.25A2.25 2.25 0 015.25 3h13.5A2.25 2.25 0 0121 5.25z" />
              </svg>
              <svg v-else class="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="1.5">
                <path stroke-linecap="round" stroke-linejoin="round" d="M15 10.5a3 3 0 11-6 0 3 3 0 016 0z" />
                <path stroke-linecap="round" stroke-linejoin="round" d="M19.5 10.5c0 7.142-7.5 11.25-7.5 11.25S4.5 17.642 4.5 10.5a7.5 7.5 0 1115 0z" />
              </svg>
            </div>
            <div>
              <p class="text-xs text-stage-500 uppercase font-bold tracking-wider">Location</p>
              <p class="text-sm font-medium">{{ event.venue?.name || 'Online' }}</p>
              <p v-if="event.format === 'hybrid'" class="text-xs text-stage-400">In person & digital</p>
            </div>
          </div>

          <!-- Admission -->
          <div class="flex items-center gap-3">
            <div class="w-10 h-10 rounded-lg bg-stage-800 flex items-center justify-center text-brand-400">
              <svg class="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="1.5">
                <path stroke-linecap="round" stroke-linejoin="round" d="M16.5 6v.75m0 3v.75m0 3v.75m0 3V18m-9-5.25h5.25M7.5 15h3M3.375 5.25c-.621 0-1.125.504-1.125 1.125v3.026a2.999 2.999 0 010 5.198v3.026c0 .621.504 1.125 1.125 1.125h17.25c.621 0 1.125-.504 1.125-1.125v-3.026a2.999 2.999 0 010-5.198V6.375c0-.621-.504-1.125-1.125-1.125H3.375z" />
              </svg>
            </div>
            <div>
              <p class="text-xs text-stage-500 uppercase font-bold tracking-wider">Admission</p>
              <p class="text-sm font-medium">{{ event.is_free ? 'Free' : (event.price || 'Ticketed') }}</p>
            </div>
          </div>
        </div>
      </div>
    </section>

    <!-- Main Content -->
    <section class="py-16 max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
      <div class="flex flex-col lg:flex-row gap-12">
        <!-- Body Text -->
        <div class="flex-1">
          <div
            v-if="event.body"
            class="prose prose-invert prose-lg max-w-none
                   prose-p:text-stage-300 prose-p:leading-relaxed
                   prose-strong:text-stage-100"
            v-html="event.body"
          />
          
          <div class="mt-12 flex flex-wrap gap-4">
            <a :href="event.rsvp_url || '#'" class="btn-primary">
              RSVP / Get Tickets
            </a>
            <NuxtLink v-if="event.format === 'digital' || event.format === 'hybrid'" to="#" class="btn-secondary">
              Digital Access Info
            </NuxtLink>
          </div>
        </div>

        <!-- Sidebar / Info Card -->
        <aside class="lg:w-80">
          <div class="card-glass p-6 sticky top-24">
            <h3 class="font-serif font-bold text-lg text-stage-100 mb-4">Venue Info</h3>
            
            <div v-if="event.venue" class="space-y-4">
              <div>
                <p class="text-sm font-bold text-stage-300">{{ event.venue.name }}</p>
                <p v-if="'address' in event.venue" class="text-sm text-stage-400">
                  {{ event.venue.address }}<br />
                  {{ event.venue.city }}, {{ event.venue.state }}
                </p>
              </div>
              <a v-if="'address' in event.venue" href="#" class="inline-block text-xs text-brand-400 hover:underline">
                View on Google Maps &rarr;
              </a>
            </div>
            <div v-else class="text-sm text-stage-400 italic">
              This is a digital-only event.
            </div>

            <div class="mt-8 pt-6 border-t border-stage-800/60">
              <h3 class="font-serif font-bold text-sm text-stage-100 mb-2">Need Help?</h3>
              <p class="text-xs text-stage-500 leading-relaxed">
                If you have questions about accessibility or ticketing for this event, please email us at
                <a href="mailto:info@fluxtheatre.org" class="text-brand-400">info@fluxtheatre.org</a>.
              </p>
            </div>
          </div>
        </aside>
      </div>
    </section>
  </article>
</template>
