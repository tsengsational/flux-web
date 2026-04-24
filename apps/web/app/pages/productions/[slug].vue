<script setup lang="ts">
import type { Production } from '@flux-theatre/shared';

const route = useRoute();
const slug = route.params.slug as string;
const { client, readItems, getAssetUrl } = useDirectus();

const isLightboxOpen = ref(false);

// Fetch the production from Directus based on slug
const { data: productions, error } = await useAsyncData(`production-${slug}`, async () => {
  return await client.request(readItems('productions' as any, {
    filter: { slug: { _eq: slug }, status: { _eq: 'published' } },
    fields: [
      '*', 
      { 
        Venue: [{ venues_id: ['*'] }],
        events: ['*', { tags: ['*', { tags_id: ['*'] }] }],
        Cast: ['role_name', 'content', 'sort', { person: ['first_name', 'last_name', 'slug', 'headshot', 'bio', 'pronouns'] }],
        Crew: ['title', 'content', 'sort', { person: ['first_name', 'last_name', 'slug', 'headshot', 'bio', 'pronouns'] }],
        funders: ['*', { funder_id: ['name', 'slug', 'image', 'url'] }]
      }
    ] as any,
    deep: {
      Cast: { _sort: ['sort'] },
      Crew: { _sort: ['sort'] }
    } as any,
    limit: 1
  } as any)) as any;

});

const production = computed(() => {
  if (!productions.value || !productions.value[0]) return null;
  const prod = productions.value[0] as any;
  // Map the M2M Venue array to a single venue object for simpler template access
  const primaryVenue = prod.Venue?.[0]?.venues_id;
  return {
    ...prod,
    venueData: typeof primaryVenue === 'object' ? primaryVenue : null
  };
});



useSeoMeta({
  title: () => `${production.value?.title || 'Production'} — Flux Theatre Ensemble`,
  description: () => production.value?.meta_description || production.value?.tagline || '',
});

// ── View States ──
type ViewMode = 'calendar' | 'list';
const viewMode = ref<ViewMode>('list');

// ── Calendar Logic (Scoped to this production's performances) ──
const today = new Date();
const currentMonth = ref(today.getMonth());
const currentYear = ref(today.getFullYear());

// Set initial calendar view to opening date if available
onMounted(() => {
  if (production.value?.opening_date) {
    const opening = new Date(production.value.opening_date);
    currentMonth.value = opening.getMonth();
    currentYear.value = opening.getFullYear();
  }
});

const monthLabel = computed(() => {
  return new Date(currentYear.value, currentMonth.value).toLocaleDateString('en-US', {
    month: 'long',
    year: 'numeric',
  });
});

function prevMonth() {
  if (currentMonth.value === 0) {
    currentMonth.value = 11;
    currentYear.value--;
  } else {
    currentMonth.value--;
  }
}

function nextMonth() {
  if (currentMonth.value === 11) {
    currentMonth.value = 0;
    currentYear.value++;
  } else {
    currentMonth.value++;
  }
}

const calendarDays = computed(() => {
  const firstDay = new Date(currentYear.value, currentMonth.value, 1);
  const startOffset = firstDay.getDay(); // 0 = Sunday
  const daysInMonth = new Date(currentYear.value, currentMonth.value + 1, 0).getDate();
  const daysInPrevMonth = new Date(currentYear.value, currentMonth.value, 0).getDate();

  const days: { date: number; month: 'prev' | 'current' | 'next'; fullDate: string; isToday: boolean }[] = [];

  for (let i = startOffset - 1; i >= 0; i--) {
    const d = daysInPrevMonth - i;
    const m = currentMonth.value === 0 ? 11 : currentMonth.value - 1;
    const y = currentMonth.value === 0 ? currentYear.value - 1 : currentYear.value;
    days.push({
      date: d,
      month: 'prev',
      fullDate: `${y}-${String(m + 1).padStart(2, '0')}-${String(d).padStart(2, '0')}`,
      isToday: false,
    });
  }

  for (let d = 1; d <= daysInMonth; d++) {
    const fullDate = `${currentYear.value}-${String(currentMonth.value + 1).padStart(2, '0')}-${String(d).padStart(2, '0')}`;
    const isToday = d === today.getDate() && currentMonth.value === today.getMonth() && currentYear.value === today.getFullYear();
    days.push({ date: d, month: 'current', fullDate, isToday });
  }

  const remaining = 42 - days.length;
  for (let d = 1; d <= remaining; d++) {
    const m = currentMonth.value === 11 ? 0 : currentMonth.value + 1;
    const y = currentMonth.value === 11 ? currentYear.value + 1 : currentYear.value;
    days.push({
      date: d,
      month: 'next',
      fullDate: `${y}-${String(m + 1).padStart(2, '0')}-${String(d).padStart(2, '0')}`,
      isToday: false,
    });
  }
  return days;
});

const weekDays = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];

function formatShowtime(iso: string) {
  if (!iso) return { date: '', time: '' };
  const d = new Date(iso);
  return {
    date: d.toLocaleDateString('en-US', { weekday: 'short', month: 'short', day: 'numeric' }),
    time: d.toLocaleTimeString('en-US', { hour: 'numeric', minute: '2-digit' }),
  };
}

// Filter events to only show performances
const performances = computed(() => {
  return (production.value?.events || [])
    .filter(e => e.category === 'performance')
    .sort((a, b) => new Date(a.start_datetime).getTime() - new Date(b.start_datetime).getTime());
});

function getPerformancesForDate(fullDate: string) {
  return performances.value.filter(p => p.start_datetime.startsWith(fullDate));
}

// Map cast with bio override (Credit Bio > Master Bio)
const cast = computed(() => {
  return (production.value?.Cast || [])
    .filter(c => c && typeof (c.person as any) !== 'string')
    .map(c => ({
      ...c,
      person: {
        ...(c.person as any),
        // Override master bio with credit content if present
        bio: (c as any).content || (c.person as any).bio
      }
    }));
});

// Map crew with bio override
const crew = computed(() => {
  return (production.value?.Crew || [])
    .filter(c => c && typeof (c.person as any) !== 'string')
    .map(c => ({
      ...c,
      person: {
        ...(c.person as any),
        bio: (c as any).content || (c.person as any).bio
      }
    }));
});
// Map funders
const funders = computed(() => {
  return (production.value?.funders || [])
    .map((f: any) => f.funder_id)
    .filter(Boolean);
});
</script>

<template>
  <div class="production-detail">
    <!-- ═══ Hero ═══ -->
    <section v-if="production" class="production-detail__hero relative pt-8 pb-16" id="production-hero">
      <div class="production-detail__hero-bg absolute inset-0 bg-black" />
      <div class="production-detail__hero-container relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div class="production-detail__hero-layout flex flex-col lg:flex-row gap-10">
          <!-- Poster -->
          <div class="production-detail__poster-wrapper lg:w-80 flex-shrink-0">
            <button 
              @click="isLightboxOpen = true"
              class="production-detail__poster-btn block w-full group relative"
              :aria-label="`View ${production.title} poster larger`"
            >
              <div class="production-detail__poster-card card-glass aspect-[3/4] overflow-hidden transition-transform duration-300 group-hover:scale-[1.02]">
                <img
                  v-if="production.poster_image"
                  :src="getAssetUrl(production.poster_image)!"
                  :alt="`${production.title} poster`"
                  class="production-detail__poster-image w-full h-full object-contain"
                />
                <div v-else class="production-detail__poster-placeholder w-full h-full flex items-center justify-center bg-gradient-to-br from-stage-800 to-stage-900">
                  <span class="production-detail__placeholder-text text-stage-600 font-serif text-8xl">F</span>
                </div>
                <!-- Hover Overlay -->
                <div class="absolute inset-0 bg-brand-500/10 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                  <div class="p-2 rounded-full bg-stage-900/80 text-brand-400">
                    <svg class="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
                      <path stroke-linecap="round" stroke-linejoin="round" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0zM10 7v3m0 0v3m0-3h3m-3 0H7" />
                    </svg>
                  </div>
                </div>
              </div>
            </button>
          </div>

          <!-- Details -->
          <div class="production-detail__info flex-1 pt-2">
            <div class="production-detail__meta flex items-center gap-3 mb-4">
              <span class="production-detail__season px-3 py-1 rounded-full text-xs font-semibold bg-brand-500/90 text-stage-950">
                {{ production.season }}
              </span>
              <NuxtLink to="/productions" class="production-detail__back-link text-xs text-stage-400 hover:text-brand-400 transition-colors">
                &larr; All Productions
              </NuxtLink>
            </div>
            <h1 class="production-detail__title text-4xl sm:text-5xl lg:text-6xl font-serif font-bold text-stage-50 tracking-tight leading-[1.1]">
              {{ production.title }}
            </h1>
            <p class="production-detail__tagline text-xl text-stage-300 mt-3 font-serif italic">
              {{ production.tagline }}
            </p>
            <p class="production-detail__creators text-stage-400 mt-4">
              by <span class="production-detail__creator-name text-stage-200 font-medium">{{ production.playwright }}</span>
              <template v-if="production.director">
                &nbsp;·&nbsp; directed by <span class="production-detail__creator-name text-stage-200 font-medium">{{ production.director }}</span>
              </template>
            </p>

            <!-- Venue & Dates -->
            <div class="production-detail__location mt-6 flex flex-wrap gap-4 text-sm">
            <!-- Venue & Dates -->
            <div class="production-detail__location mt-6 flex flex-wrap gap-4 text-sm">
              <div v-if="production.venueData" class="production-detail__venue flex items-center gap-2 text-stage-300">
                <svg class="production-detail__location-icon w-4 h-4 text-brand-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="1.5">
                  <path stroke-linecap="round" stroke-linejoin="round" d="M15 10.5a3 3 0 11-6 0 3 3 0 016 0z" />
                  <path stroke-linecap="round" stroke-linejoin="round" d="M19.5 10.5c0 7.142-7.5 11.25-7.5 11.25S4.5 17.642 4.5 10.5a7.5 7.5 0 1115 0z" />
                </svg>
                <a :href="production.venueData.maps_url || '#'" target="_blank" class="production-detail__venue-link hover:text-brand-400 transition-colors">
                  {{ production.venueData.name }}, {{ production.venueData.city }}
                </a>
              </div>
            </div>
            </div>

            <!-- Description -->
            <div class="production-detail__description mt-8 text-stage-300 leading-relaxed max-w-none prose prose-invert prose-sm sm:prose-base">
              <BlockRenderer :content="production.description" />
            </div>
          </div>
        </div>
      </div>
    </section>

    <!-- ═══ Showtimes ═══ -->
    <section v-if="production && performances.length" class="production-showtimes production-section py-16" id="showtimes">
      <div class="production-showtimes__container max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div class="production-showtimes__header flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-8">
          <h2 class="production-showtimes__title section-heading md:text-xl mb-0">Showtimes & Tickets</h2>
          
          <!-- View Toggle -->
          <div class="production-showtimes__view-toggle flex items-center bg-stage-900/50 p-1 rounded-lg border border-stage-800/50">
            <button 
              @click="viewMode = 'calendar'"
              class="px-3 py-1.5 rounded-md text-xs font-medium transition-all flex items-center gap-2"
              :class="viewMode === 'calendar' ? 'bg-stage-800 text-brand-300 shadow-sm' : 'text-stage-300 hover:text-stage-100'"
            >
              <svg class="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" d="M6.75 3v2.25M17.25 3v2.25M3 18.75V7.5a2.25 2.25 0 012.25-2.25h13.5A2.25 2.25 0 0121 7.5v11.25m-18 0A2.25 2.25 0 005.25 21h13.5A2.25 2.25 0 0021 18.75m-18 0v-7.5A2.25 2.25 0 015.25 9h13.5A2.25 2.25 0 0121 11.25v7.5" />
              </svg>
              Calendar
            </button>
            <button 
              @click="viewMode = 'list'"
              class="px-3 py-1.5 rounded-md text-xs font-medium transition-all flex items-center gap-2"
              :class="viewMode === 'list' ? 'bg-stage-800 text-brand-300 shadow-sm' : 'text-stage-300 hover:text-stage-100'"
            >
              <svg class="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" d="M8.25 6.75h12M8.25 12h12m-12 5.25h12M3.75 6.75h.007v.008H3.75V6.75zm.375 0a.375.375 0 11-.75 0 .375.375 0 01.75 0zM3.75 12h.007v.008H3.75V12zm.375 0a.375.375 0 11-.75 0 .375.375 0 01.75 0zm-.375 5.25h.007v.008H3.75v-.008zm.375 0a.375.375 0 11-.75 0 .375.375 0 01.75 0z" />
              </svg>
              List
            </button>
          </div>
        </div>

        <!-- ═══ List View ═══ -->
        <div v-if="viewMode === 'list'" class="production-showtimes__grid grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <div
            v-for="show in performances"
            :key="show.id"
            class="production-showtimes__card card-glass p-5 border-l-4 transition-all hover:translate-y-[-2px]"
            :class="show.ticket_url ? 'border-brand-500/50' : 'border-stage-700/50'"
          >
            <div class="production-showtimes__card-header flex items-center justify-between mb-3">
              <div class="flex flex-col">
                <span class="production-showtimes__date text-stage-950 font-bold text-base leading-tight">{{ formatShowtime(show.start_datetime).date }}</span>
                <span class="production-showtimes__time text-brand-700 text-sm font-bold">{{ formatShowtime(show.start_datetime).time }}</span>
              </div>
              <span v-if="show.is_sold_out" class="production-showtimes__status-badge px-2 py-0.5 rounded text-[10px] font-bold uppercase bg-red-100 text-red-700 border border-red-200">
                Sold Out
              </span>
            </div>

            <!-- Tags -->
            <div v-if="show.tags?.length" class="production-showtimes__tags flex flex-wrap gap-1.5 mb-4">
              <span 
                v-for="tag in show.tags" 
                :key="tag.id"
                class="text-[11px] px-2 py-0.5 rounded bg-stage-50 text-stage-700 border border-stage-200 font-bold"
              >
                {{ tag.tags_id?.name || tag.tags_id }}
              </span>
            </div>

            <div class="production-showtimes__card-footer mt-auto pt-2">
              <a
                v-if="show.ticket_url && !show.is_sold_out"
                :href="show.ticket_url"
                target="_blank"
                class="production-showtimes__ticket-btn btn-primary w-full text-center text-xs py-2 block"
              >
                Get Tickets
              </a>
              <div v-else-if="show.is_sold_out" class="production-showtimes__sold-out block text-center text-xs py-2 px-4 rounded-lg bg-stage-50 text-stage-500 font-bold border border-stage-200">
                Sold Out
              </div>
              <div v-else class="production-showtimes__pending block text-center text-xs py-2 px-4 rounded-lg bg-stage-50 text-stage-500 font-bold border border-stage-200 italic">
                Tickets Coming Soon
              </div>
            </div>
          </div>
        </div>

        <!-- ═══ Calendar View ═══ -->
        <div v-if="viewMode === 'calendar'" class="production-showtimes__calendar">
          <div class="production-showtimes__calendar-wrapper card-glass p-6 md:p-8">
            <!-- Nav -->
            <div class="flex items-center justify-between mb-8">
               <button @click="prevMonth" class="p-2 rounded-lg hover:bg-stage-100 text-stage-600 transition-colors">
                 <svg class="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 19l-7-7 7-7" /></svg>
               </button>
               <h3 class="text-xl font-serif font-bold text-stage-900">{{ monthLabel }}</h3>
               <button @click="nextMonth" class="p-2 rounded-lg hover:bg-stage-100 text-stage-600 transition-colors">
                 <svg class="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5l7 7-7 7" /></svg>
               </button>
            </div>

            <!-- Grid -->
            <div class="grid grid-cols-7 gap-px bg-stage-800/30 border border-stage-800/50 rounded-lg overflow-hidden">
               <div v-for="day in weekDays" :key="day" class="py-3 text-center text-[11px] uppercase tracking-wider font-bold text-stage-600 bg-stage-50/50 border-b border-stage-200">
                 {{ day }}
               </div>
               <div 
                 v-for="day in calendarDays" 
                 :key="day.fullDate"
                 class="min-h-[80px] md:min-h-[100px] p-2 flex flex-col transition-colors border-t border-r border-stage-800/50"
                 :class="[
                   day.month !== 'current' ? 'bg-stage-50/50 opacity-40 text-stage-400' : 'bg-white text-stage-700',
                   day.isToday ? 'ring-1 ring-inset ring-brand-500/20 bg-brand-500/5' : ''
                 ]"
               >
                 <span class="text-xs font-bold mb-1" :class="day.isToday ? 'text-brand-700' : 'text-stage-900'">{{ day.date }}</span>
                 
                 <!-- Performance indicators -->
                 <div class="flex flex-col gap-1.5 mt-1">
                   <a 
                     v-for="perf in getPerformancesForDate(day.fullDate)" 
                     :key="perf.id"
                     :href="perf.ticket_url || '#'"
                     :target="perf.ticket_url ? '_blank' : '_self'"
                     class="group relative flex flex-col p-1.5 rounded transition-all border-l-2"
                     :class="[
                       perf.ticket_url && !perf.is_sold_out 
                         ? 'bg-brand-50 border-brand-200 hover:bg-brand-100' 
                         : 'bg-stage-50 border-stage-200 opacity-90'
                     ]"
                     :title="`${formatShowtime(perf.start_datetime).time}${perf.is_sold_out ? ' (Sold Out)' : ''}`"
                   >
                     <div class="flex items-center justify-between gap-1 mb-0.5">
                       <span class="text-[9px] md:text-[10px] font-bold text-stage-950">{{ formatShowtime(perf.start_datetime).time }}</span>
                       <span v-if="perf.ticket_url && !perf.is_sold_out" class="text-[8px] md:text-[9px] uppercase font-black text-brand-700 group-hover:text-brand-900 transition-colors">Tickets</span>
                       <span v-else-if="perf.is_sold_out" class="text-[8px] md:text-[9px] uppercase font-black text-red-700">Sold Out</span>
                     </div>
                     
                     <!-- Mini Tags -->
                     <div v-if="perf.tags?.length" class="flex flex-wrap gap-0.5">
                       <span 
                         v-for="tag in perf.tags.slice(0, 1)" 
                         :key="tag.id"
                         class="text-[8px] md:text-[9px] px-1 py-0.5 rounded-sm bg-stage-50 text-stage-700 border border-stage-200 font-bold truncate max-w-full"
                       >
                         {{ tag.tags_id?.name || tag.tags_id }}
                       </span>
                     </div>
                   </a>
                 </div>
               </div>
            </div>
          </div>
        </div>
      </div>
    </section>

    <!-- ═══ Overview / Content ═══ -->
    <section v-if="production && production.content" class="production-content py-16 production-section" id="overview">
      <div class="production-content__container max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div class="production-content__body prose prose-invert prose-lg max-w-none">
          <BlockRenderer :content="production.content" />
        </div>
      </div>
    </section>

    <!-- ═══ Cast ═══ -->
    <section v-if="cast.length" class="production-cast  production-section py-16" id="cast-section">
      <div class="production-cast__container max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <h2 class="production-cast__title section-heading mb-8 md:text-xl">Cast</h2>
        <div class="production-cast__grid grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4">
          <PersonCard
            v-for="credit in cast"
            :key="credit.person.slug"
            :person="credit.person"
            :role="credit.role_name"
            class="production-cast__person-card"
            compact
          />
        </div>
      </div>
    </section>

    <!-- ═══ Creative Team ═══ -->
    <section v-if="crew.length" class="production-crew py-16 production-section" id="crew-section">
      <div class="production-crew__container max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <h2 class="production-crew__title section-heading mb-8 md:text-xl">Creative Team</h2>
        <div class="production-crew__grid grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4">
          <PersonCard
            v-for="credit in crew"
            :key="credit.person.slug"
            :person="credit.person"
            :role="credit.title"
            class="production-crew__person-card"
            compact
          />
        </div>
      </div>
    </section>
    
    <!-- ═══ Funders ═══ -->
    <section v-if="funders.length" class="production-funders py-16 production-section" id="funders-section">
      <div class="production-funders__container max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <h2 class="production-funders__title section-heading mb-8 md:text-xl">Our Funders</h2>
        <div class="production-funders__grid flex flex-wrap items-center justify-center gap-12">
          <NuxtLink
            v-for="funder in funders"
            :key="funder.slug"
            :to="`/funders/${funder.slug}`"
            class="production-funders__item group flex flex-col items-center gap-4 transition-all hover:scale-105"
            :title="funder.name"
          >
            <div class="production-funders__logo-wrapper w-32 h-32 bg-white rounded-xl shadow-lg border border-stage-800/20 p-5 flex items-center justify-center overflow-hidden group-hover:border-brand-500/50 transition-colors">
              <img
                v-if="funder.image"
                :src="getAssetUrl(funder.image)!"
                :alt="funder.name"
                class="production-funders__logo w-full h-full object-contain grayscale group-hover:grayscale-0 transition-all duration-500"
              />
              <span v-else class="text-stage-900 font-serif font-bold text-xl">{{ funder.name }}</span>
            </div>
          </NuxtLink>
        </div>
      </div>
    </section>
    <!-- ═══ Lightbox ═══ -->
    <Teleport to="body">
      <Transition
        enter-active-class="transition-all duration-300 ease-out"
        enter-from-class="opacity-0"
        enter-to-class="opacity-100"
        leave-active-class="transition-all duration-200 ease-in"
        leave-from-class="opacity-100"
        leave-to-class="opacity-0"
      >
        <div 
          v-if="isLightboxOpen && production" 
          class="fixed inset-0 z-[200] flex items-center justify-center p-4 md:p-12"
          @click="isLightboxOpen = false"
        >
          <div class="absolute inset-0 bg-black/95 backdrop-blur-md" />
          
          <button 
            class="absolute top-6 right-6 text-stage-400 hover:text-white transition-colors z-[210] p-2 bg-stage-900/50 rounded-full"
            @click="isLightboxOpen = false"
          >
            <svg class="w-8 h-8" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2.5">
              <path stroke-linecap="round" stroke-linejoin="round" d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>

          <div class="relative max-w-full max-h-full flex items-center justify-center z-[205]">
            <img 
              v-if="production.poster_image"
              :src="getAssetUrl(production.poster_image)!" 
              :alt="production.title"
              class="max-w-full max-h-[90vh] object-contain shadow-2xl animate-scale-in"
              @click.stop
            />
          </div>
        </div>
      </Transition>
    </Teleport>
  </div>
</template>

<style lang="scss" scoped>
  .production-section {
    @apply relative;
    &::after {
      content: '';
      /* Fix: Anchor to left/right and use mx-auto to center based on max-width */
      @apply absolute bottom-0 left-0 right-0 mx-auto;
      @apply h-px w-full max-w-7xl;
      /* Matching your inner container's padding so the line doesn't hit the screen edges */
      @apply px-4 sm:px-6 lg:px-8;
      /* Decorative styling */
      /* Using a subtle stage color + horizontal gradient for a more "theatrical" look */
      background: linear-gradient(
        to right, 
        transparent, 
        theme('colors.stage.800' / 40%) 15%, 
        theme('colors.stage.800' / 40%) 85%, 
        transparent
      );
    }
  }
  /* Remove the divider from the very last section to keep the footer clean */
  .production-section:last-of-type::after {
    content: none;
  }
</style>
