<script setup lang="ts">
import { toZonedTime, fromZonedTime, formatInTimeZone } from 'date-fns-tz';

const timeZone = 'America/New_York';

const route = useRoute();
const slug = route.params.slug as string;
const { client, readItems } = useDirectus();

// Fetch the event from Directus based on slug
const { data: events, error } = await useAsyncData<Event[]>(`event-${slug}`, () => 
  client.request(readItems('events' as any, {
    filter: { slug: { _eq: slug }, status: { _eq: 'published' } },
    fields: ['*', 'is_recurring', 'recurrence_rule', { venue: ['*'] }, { related_production: ['title', 'slug', 'poster_image'] }, { funders: ['*', { funder_id: ['name', 'slug', 'image', 'url'] }] }] as any,
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

const nyDateLabel = computed(() => {
  if (!event.value) return '';
  return formatInTimeZone(new Date(event.value.start_datetime), timeZone, 'EEEE, MMMM d, yyyy');
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
    const dtstart = toZonedTime(new Date(event.value.start_datetime), timeZone);
    const year = dtstart.getFullYear();
    const month = dtstart.getMonth() + 1;
    const day = dtstart.getDate();
    const hour = dtstart.getHours();
    const min = dtstart.getMinutes();
    const sec = dtstart.getSeconds();
    
    const pad = (n: number) => n.toString().padStart(2, '0');
    const dtstartStr = `${year}${pad(month)}${pad(day)}T${pad(hour)}${pad(min)}${pad(sec)}`;
    
    const rule = RRule.fromString(`DTSTART:${dtstartStr}\nRRULE:${event.value.recurrence_rule}`);
    
    const occurrences = rule.after(new Date(), true) ? rule.all((date, i) => i < 5) : [];
    return occurrences.map(d => fromZonedTime(d, timeZone));
  } catch (e) {
    return [];
  }
});

const eventTimes = computed(() => {
  if (!event.value) return null;
  const start = new Date(event.value.start_datetime);
  const end = event.value.end_datetime ? new Date(event.value.end_datetime) : null;
  
  const nyStart = formatInTimeZone(start, timeZone, 'h:mm a');
  const nyEnd = end ? formatInTimeZone(end, timeZone, 'h:mm a') : null;
  
  let localStart = null;
  let localEnd = null;
  let localTz = '';
  
  if (import.meta.client) {
    localStart = start.toLocaleTimeString('en-US', { hour: 'numeric', minute: '2-digit' });
    localEnd = end ? end.toLocaleTimeString('en-US', { hour: 'numeric', minute: '2-digit' }) : null;
    localTz = start.toLocaleTimeString('en-US', { timeZoneName: 'short' }).split(' ').pop();
  }
  
  const showLocal = localStart && localStart !== nyStart;
  const nyFull = nyEnd ? `${nyStart} – ${nyEnd} ET` : `${nyStart} ET`;
  const localFull = localEnd ? `${localStart} – ${localEnd} ${localTz}` : `${localStart} ${localTz}`;
  
  return { nyFull, localFull, showLocal };
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
const { getAssetUrl, getImageProps } = useDirectus();
const funders = computed(() => {
  return (event.value?.funders || [])
    .map((f: any) => f.funder_id)
    .filter(Boolean);
});
</script>

<template>
  <article v-if="event" class="event-detail pb-24">
    <!-- Hero / Header -->
    <section class="event-detail__hero relative pt-8 pb-16 bg-stage-900 overflow-hidden" id="event-detail-hero">
      <!-- Background Ambient Glow -->
      <div v-if="event.cover_image" class="absolute inset-0 opacity-20 blur-3xl pointer-events-none">
        <img v-bind="getImageProps(event.cover_image, { sm: 100 }, { quality: 10 })" class="w-full h-full object-cover scale-150" alt="" />
      </div>

      <div class="event-detail__hero-container relative max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
        <div class="flex flex-col lg:flex-row gap-12 lg:items-center">
          <div class="flex-1">
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
                  <p v-else class="event-detail__info-value text-sm font-medium">{{ nyDateLabel }}</p>
                  <div class="event-detail__info-subtext text-xs text-stage-300 mt-0.5 flex flex-col">
                    <span class="font-bold">{{ eventTimes?.nyFull }}</span>
                    <ClientOnly>
                      <span v-if="eventTimes?.showLocal" class="opacity-60 italic mt-0.5">{{ eventTimes?.localFull }}</span>
                    </ClientOnly>
                  </div>
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

            <div class="event-detail__actions mt-10 flex flex-wrap gap-4">
              <a 
                :href="event.rsvp_url || event.ticket_url || '#'" 
                target="_blank"
                class="event-detail__rsvp-btn btn-primary group flex items-center bg-brand-500 gap-3 px-8 py-4 text-base text-stage-100 shadow-2xl shadow-brand-500/40 hover:text-stage-50 hover:scale-[1.02] active:scale-[0.98] transition-all duration-300"
              >
                <span class="font-bold tracking-widest">{{ event.ticket_url ? 'GET TICKETS' : 'RSVP NOW' }}</span>
                <svg class="w-5 h-5 transition-transform duration-300 group-hover:translate-x-1.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2.5">
                  <path stroke-linecap="round" stroke-linejoin="round" d="M13.5 4.5L21 12m0 0l-7.5 7.5M21 12H3" />
                </svg>
              </a>
              <NuxtLink v-if="event.format === 'digital' || event.format === 'hybrid'" to="#" class="event-detail__digital-btn btn-secondary flex items-center px-6 py-4">
                Digital Access Info
              </NuxtLink>
            </div>

          </div>

          <!-- Hero Image -->
          <div v-if="event.cover_image" class="lg:w-[400px] flex-shrink-0">
            <div class="event-detail__hero-image-wrapper relative group aspect-video lg:aspect-[4/5] rounded-3xl overflow-hidden shadow-2xl border border-stage-800/60">
              <img 
                v-bind="getImageProps(event.cover_image, { sm: 600, md: 800, lg: 1200 }, { quality: 90 })" 
                :alt="event.title"
                class="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
              />
              <div class="absolute inset-0 bg-gradient-to-t from-stage-950/60 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
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
              <span class="text-[10px] font-bold text-brand-400 uppercase">{{ formatInTimeZone(date, timeZone, 'MMM') }}</span>
              <span class="text-lg font-serif font-bold text-stage-50">{{ formatInTimeZone(date, timeZone, 'd') }}</span>
              <span class="text-[10px] text-stage-500 uppercase">{{ formatInTimeZone(date, timeZone, 'EEE') }}</span>
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
          

        </div>

        <!-- Sidebar / Info Card -->
        <aside class="event-detail__sidebar lg:w-80 space-y-6">
          <!-- Production Link -->
          <div v-if="event.related_production" class="event-detail__production-card card-glass p-4 border-l-4 border-brand-500">
            <h3 class="text-xs font-bold text-stage-500 uppercase tracking-widest mb-3">Part Of</h3>
            <NuxtLink :to="`/productions/${event.related_production.slug}`" class="group flex items-center gap-3">
              <div class="w-12 h-16 bg-stage-800 rounded overflow-hidden flex-shrink-0 shadow-md flex items-center justify-center">
                <img 
                  v-if="event.related_production.poster_image"
                  v-bind="getImageProps(event.related_production.poster_image, { sm: 100 }, { quality: 70 })" 
                  :alt="event.related_production.title"
                  class="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                />
                <div v-else class="text-stage-600">
                  <svg class="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 002-2H4a2 2 0 00-2 2v12a2 2 0 002 2z" /></svg>
                </div>
              </div>
              <div class="flex-1 min-w-0">
                <h4 class="text-sm font-bold text-stage-100 group-hover:text-brand-400 transition-colors line-clamp-2 leading-snug">
                  {{ event.related_production.title }}
                </h4>
                <span class="text-[10px] text-brand-500 font-bold uppercase mt-1 inline-block">View Production &rarr;</span>
              </div>
            </NuxtLink>
          </div>

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
                v-bind="getImageProps(funder.image, { sm: 240 }, { quality: 80 })"
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
