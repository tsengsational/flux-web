<script setup lang="ts">
import { RRule } from 'rrule';
import type { Event, EventFormat, EventCategory } from '@flux-theatre/shared';

const route = useRoute();
const slug = route.params.slug as string;
const { client, readItems } = useDirectus();

// Fetch the event from Directus based on slug
const { data: events, error } = await useAsyncData<Event[]>(`event-${slug}`, () => 
  client.request(readItems('events' as any, {
    filter: { slug: { _eq: slug }, status: { _eq: 'published' } },
    fields: ['*', 'is_recurring', 'recurrence_rule', { venue: ['*'] }, { funders: ['*', { funder_id: ['name', 'slug', 'image', 'url'] }] }] as any,
    limit: 1
  } as any)) as any
);

const event = computed(() => events.value?.[0] || null);

// Handle 404 if event not found
if (!event.value && !error.value) {
  throw createError({ statusCode: 404, statusMessage: 'Event not found' });
}

useSeoMeta({
  title: () => `${event.value?.title || 'Event'} — Flux Theatre Ensemble`,
  description: () => event.value?.excerpt || '',
});

const formattedDate = computed(() => {
  if (!event.value) return '';
  const d = new Date(event.value.start_datetime);
  return d.toLocaleDateString('en-US', { weekday: 'long', month: 'long', day: 'numeric', year: 'numeric' });
});

const recurrenceText = computed(() => {
  if (!event.value?.is_recurring || !event.value?.recurrence_rule) return null;
  try {
    const rule = RRule.fromString(`RRULE:${event.value.recurrence_rule}`);
    return rule.toText().charAt(0).toUpperCase() + rule.toText().slice(1);
  } catch (e) {
    return 'Recurring event';
  }
});

const upcomingDates = computed(() => {
  if (!event.value?.is_recurring || !event.value?.recurrence_rule) return [];
  try {
    const dtstart = new Date(event.value.start_datetime);
    const rule = RRule.fromString(`DTSTART:${dtstart.toISOString().replace(/[-:]/g, '').split('.')[0]}Z\nRRULE:${event.value.recurrence_rule}`);
    return rule.after(new Date(), true) ? rule.all((date, i) => i < 5) : [];
  } catch (e) {
    return [];
  }
});

const formattedTime = computed(() => {
  if (!event.value) return '';
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
  if (!event.value) return 'Event';
  const labels: Record<EventCategory, string> = {
    workshop: 'Workshop',
    reading: 'Reading',
    talkback: 'Talkback',
    fundraiser: 'Fundraiser',
    social: 'Social',
    audition: 'Audition',
    masterclass: 'Masterclass',
    community: 'Community',
    performance: 'Performance',
    other: 'Event',
  };
  return labels[event.value.category];
});
const { getAssetUrl } = useDirectus();
const funders = computed(() => {
  return (event.value?.funders || [])
    .map((f: any) => f.funder_id)
    .filter(Boolean);
});
</script>

<template>
  <article v-if="event" class="event-detail pb-24">
    <!-- Hero / Header -->
    <section class="event-detail__hero relative pt-8 pb-16 bg-stage-900" id="event-detail-hero">
      <div class="event-detail__hero-container relative max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
        <div class="event-detail__meta flex flex-wrap items-center gap-3 mb-6">
          <NuxtLink to="/events" class="event-detail__back-link text-xs text-stage-400 hover:text-brand-400 transition-colors">
            &larr; All Events
          </NuxtLink>
          <span class="event-detail__divider w-px h-3 bg-stage-700" />
          <span class="event-detail__category px-2.5 py-0.5 rounded-full text-xs font-semibold bg-brand-500/90 text-stage-950">
            {{ categoryLabel }}
          </span>
        </div>

        <h1 class="event-detail__title text-3xl sm:text-5xl lg:text-6xl font-serif font-bold text-stage-50 tracking-tight leading-tight">
          {{ event.title }}
        </h1>

        <div class="event-detail__info-bar mt-8 flex flex-col sm:flex-row sm:items-center gap-6 text-stage-300">
          <!-- Date -->
          <div class="event-detail__info-item flex items-center gap-3">
            <div class="event-detail__info-icon w-10 h-10 rounded-lg bg-stage-800 flex items-center justify-center text-brand-400">
              <svg class="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="1.5">
                <path stroke-linecap="round" stroke-linejoin="round" d="M6.75 3v2.25M17.25 3v2.25M3 18.75V7.5a2.25 2.25 0 012.25-2.25h13.5A2.25 2.25 0 0121 7.5v11.25m-18 0A2.25 2.25 0 005.25 21h13.5A2.25 2.25 0 0021 18.75m-18 0v-7.5A2.25 2.25 0 015.25 9h13.5A2.25 2.25 0 0121 11.25v7.5" />
              </svg>
            </div>
            <div class="event-detail__info-text">
              <p class="event-detail__info-label text-xs text-stage-500 uppercase font-bold tracking-wider">Date & Time</p>
              <p v-if="event.is_recurring" class="event-detail__info-value text-sm font-medium text-brand-400">{{ recurrenceText }}</p>
              <p v-else class="event-detail__info-value text-sm font-medium">{{ formattedDate }}</p>
              <p class="event-detail__info-subtext text-xs text-stage-400">{{ formattedTime }}</p>
            </div>
          </div>

          <!-- Location -->
          <div class="event-detail__info-item flex items-center gap-3">
            <div class="event-detail__info-icon w-10 h-10 rounded-lg bg-stage-800 flex items-center justify-center text-brand-400">
              <svg v-if="event.format === 'digital'" class="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="1.5">
                <path stroke-linecap="round" stroke-linejoin="round" d="M9 17.25v1.007a3 3 0 01-.879 2.122L7.5 21h9l-.621-.621A3 3 0 0115 18.257V17.25m6-12V15a2.25 2.25 0 01-2.25 2.25H5.25A2.25 2.25 0 013 15V5.25A2.25 2.25 0 015.25 3h13.5A2.25 2.25 0 0121 5.25z" />
              </svg>
              <svg v-else class="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="1.5">
                <path stroke-linecap="round" stroke-linejoin="round" d="M15 10.5a3 3 0 11-6 0 3 3 0 016 0z" />
                <path stroke-linecap="round" stroke-linejoin="round" d="M19.5 10.5c0 7.142-7.5 11.25-7.5 11.25S4.5 17.642 4.5 10.5a7.5 7.5 0 1115 0z" />
              </svg>
            </div>
            <div class="event-detail__info-text">
              <p class="event-detail__info-label text-xs text-stage-500 uppercase font-bold tracking-wider">Location</p>
              <p class="event-detail__info-value text-sm font-medium">
                {{ (event.venue && typeof event.venue !== 'string') ? event.venue.name : (event.venue || 'Online') }}
              </p>
              <p v-if="event.format === 'hybrid'" class="event-detail__info-subtext text-xs text-stage-400">In person & digital</p>
            </div>
          </div>

          <!-- Admission -->
          <div class="event-detail__info-item flex items-center gap-3">
            <div class="event-detail__info-icon w-10 h-10 rounded-lg bg-stage-800 flex items-center justify-center text-brand-400">
              <svg class="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="1.5">
                <path stroke-linecap="round" stroke-linejoin="round" d="M16.5 6v.75m0 3v.75m0 3v.75m0 3V18m-9-5.25h5.25M7.5 15h3M3.375 5.25c-.621 0-1.125.504-1.125 1.125v3.026a2.999 2.999 0 010 5.198v3.026c0 .621.504 1.125 1.125 1.125h17.25c.621 0 1.125-.504 1.125-1.125v-3.026a2.999 2.999 0 010-5.198V6.375c0-.621-.504-1.125-1.125-1.125H3.375z" />
              </svg>
            </div>
            <div class="event-detail__info-text">
              <p class="event-detail__info-label text-xs text-stage-500 uppercase font-bold tracking-wider">Admission</p>
              <p class="event-detail__info-value text-sm font-medium">{{ event.is_free ? 'Free' : (event.price || 'Ticketed') }}</p>
            </div>
          </div>
        </div>

        <!-- Recurring Dates List -->
        <div v-if="event.is_recurring && upcomingDates.length > 0" class="event-detail__recurring-dates mt-10 p-6 rounded-2xl bg-stage-800/40 border border-stage-700/30">
          <h3 class="text-xs font-bold text-stage-400 uppercase tracking-widest mb-4">Upcoming Occurrences</h3>
          <div class="flex flex-wrap gap-3">
            <div 
              v-for="date in upcomingDates" 
              :key="date.toISOString()"
              class="px-3 py-2 rounded-lg bg-stage-900 border border-stage-700/50 flex flex-col items-center min-w-[100px]"
            >
              <span class="text-[10px] font-bold text-brand-400 uppercase">{{ date.toLocaleDateString('en-US', { month: 'short' }) }}</span>
              <span class="text-lg font-serif font-bold text-stage-50">{{ date.getDate() }}</span>
              <span class="text-[10px] text-stage-500 uppercase">{{ date.toLocaleDateString('en-US', { weekday: 'short' }) }}</span>
            </div>
          </div>
        </div>
      </div>
    </section>

    <!-- Main Content -->
    <section class="event-detail__main py-16 max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
      <div class="event-detail__layout flex flex-col lg:flex-row gap-12">
        <!-- Body Text -->
        <div class="event-detail__content flex-1">
          <div
            v-if="event.content || event.description"
            class="event-detail__body max-w-none prose prose-invert prose-lg"
          >
            <BlockRenderer :content="event.content || event.description" />
          </div>
          
          <div class="event-detail__actions mt-12 flex flex-wrap gap-4">
            <a :href="event.rsvp_url || event.ticket_url || '#'" class="event-detail__rsvp-btn btn-primary">
              {{ event.ticket_url ? 'Get Tickets' : 'RSVP' }}
            </a>
            <NuxtLink v-if="event.format === 'digital' || event.format === 'hybrid'" to="#" class="event-detail__digital-btn btn-secondary">
              Digital Access Info
            </NuxtLink>
          </div>
        </div>

        <!-- Sidebar / Info Card -->
        <aside class="event-detail__sidebar lg:w-80">
          <div class="event-detail__venue-card card-glass p-6 sticky top-24">
            <h3 class="event-detail__venue-title font-serif font-bold text-lg text-stage-100 mb-4">Venue Info</h3>
            
            <div v-if="event.venue" class="event-detail__venue-info space-y-4">
              <div class="event-detail__venue-address">
                <p class="text-sm font-bold text-stage-300">
                  {{ typeof event.venue === 'string' ? event.venue : event.venue.name }}
                </p>
                <p v-if="typeof event.venue !== 'string' && event.venue.address" class="text-sm text-stage-400">
                  {{ event.venue.address }}<br />
                  {{ event.venue.city }}, {{ event.venue.state }}
                </p>
              </div>
              <a v-if="typeof event.venue !== 'string' && event.venue.maps_url" :href="event.venue.maps_url" target="_blank" class="event-detail__map-link inline-block text-xs text-brand-400 hover:underline">
                View on Google Maps &rarr;
              </a>
            </div>
            <div v-else class="event-detail__venue-text text-sm text-stage-400 italic">
              This is a digital-only event.
            </div>

            <div class="event-detail__support mt-8 pt-6 border-t border-stage-800/60">
              <h3 class="event-detail__support-title font-serif font-bold text-sm text-stage-100 mb-2">Need Help?</h3>
              <p class="event-detail__support-text text-xs text-stage-500 leading-relaxed">
                If you have questions about accessibility or ticketing for this event, please email us at
                <a href="mailto:info@fluxtheatre.org" class="event-detail__support-link text-brand-400">info@fluxtheatre.org</a>.
              </p>
            </div>
          </div>
        </aside>
      </div>
    </section>

    <!-- Funders -->
    <section v-if="funders.length" class="event-detail__funders py-16 border-t border-stage-800/40">
      <div class="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
        <h2 class="text-xl font-serif font-bold text-stage-100 mb-8 text-center">Supported By</h2>
        <div class="flex flex-wrap items-center justify-center gap-10">
          <NuxtLink
            v-for="funder in funders"
            :key="funder.slug"
            :to="`/funders/${funder.slug}`"
            class="group flex flex-col items-center gap-3 transition-transform hover:scale-105"
          >
            <div class="w-24 h-24 bg-white rounded-lg shadow-md p-4 flex items-center justify-center overflow-hidden border border-stage-800/10 group-hover:border-brand-500/30 transition-colors">
              <img
                v-if="funder.image"
                :src="getAssetUrl(funder.image)!"
                :alt="funder.name"
                class="w-full h-full object-contain grayscale group-hover:grayscale-0 transition-all duration-500"
              />
              <span v-else class="text-stage-900 font-serif font-bold text-sm text-center">{{ funder.name }}</span>
            </div>
          </NuxtLink>
        </div>
      </div>
    </section>
  </article>
</template>
