<script setup lang="ts">
import type { Event, EventFormat, EventCategory } from '@flux-theatre/shared';

useSeoMeta({
  title: 'Past Events — Flux Theatre Ensemble',
  description: 'A look back at our past workshops, readings, talkbacks, and community events.',
});

const { client, readItems } = useDirectus();
const route = useRoute();
const router = useRouter();

const pageSize = 12;
const currentPage = computed(() => Number(route.query.page) || 1);

const { data: cmsData } = await useAsyncData(`events-past-${currentPage.value}`, async () => {
  const [items, meta] = await Promise.all([
    client.request(readItems('events' as any, {
      filter: { 
        status: { _eq: 'published' },
        start_datetime: { _lt: new Date().toISOString() }
      },
      fields: ['*', { venue: ['name'] }] as any,
      sort: ['-start_datetime'],
      limit: pageSize,
      page: currentPage.value
    } as any)),
    client.request(readItems('events' as any, {
      filter: { 
        status: { _eq: 'published' },
        start_datetime: { _lt: new Date().toISOString() }
      },
      aggregate: { count: '*' }
    } as any))
  ]);
  
  return { 
    items: items as Event[], 
    totalCount: Number((meta as any)[0].count) 
  };
});

const events = computed(() => cmsData.value?.items || []);
const totalPages = computed(() => Math.ceil((cmsData.value?.totalCount || 0) / pageSize));

function changePage(page: number) {
  router.push({ query: { ...route.query, page } });
}

type FormatFilter = 'all' | EventFormat;
type CategoryFilter = 'all' | EventCategory;

const activeFormat = ref<FormatFilter>('all');
const activeCategory = ref<CategoryFilter>('all');

const filteredEvents = computed(() => {
  return events.value.filter((e: Event) => {
    const matchesFormat = activeFormat.value === 'all' || e.format === activeFormat.value;
    const matchesCategory = activeCategory.value === 'all' || e.category === activeCategory.value;
    return matchesFormat && matchesCategory;
  });
});

const formatFilters: { label: string; value: FormatFilter }[] = [
  { label: 'All Formats', value: 'all' },
  { label: 'In Person', value: 'in_person' },
  { label: 'Digital', value: 'digital' },
  { label: 'Hybrid', value: 'hybrid' },
];

const categoryFilters: { label: string; value: CategoryFilter }[] = [
  { label: 'All Types', value: 'all' },
  { label: 'Workshops', value: 'workshop' },
  { label: 'Readings', value: 'reading' },
  { label: 'Talkbacks', value: 'talkback' },
  { label: 'Fundraisers', value: 'fundraiser' },
  { label: 'Auditions', value: 'audition' },
  { label: 'Masterclasses', value: 'masterclass' },
  { label: 'Community', value: 'community' },
];
</script>

<template>
  <div class="events-page events-page--past">
    <!-- Page Header -->
    <section class="events-page__header pt-12 pb-6" id="past-events-header">
      <div class="events-page__header-container max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <NuxtLink to="/events" class="inline-flex items-center text-sm text-brand-400 hover:text-brand-300 transition-colors mb-4 group">
          <svg class="w-4 h-4 mr-1 transition-transform group-hover:-translate-x-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 19l-7-7 7-7" />
          </svg>
          Back to Upcoming
        </NuxtLink>
        <h1 class="events-page__title section-heading">Past Events</h1>
        <p class="events-page__description mt-4 text-stage-400 text-lg max-w-2xl">
          A history of our readings, workshops, and community gatherings.
        </p>
      </div>
    </section>

    <!-- Filters -->
    <section class="events-page__filters-section pb-8" id="past-event-filters">
      <div class="events-page__filters-container max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-4">
        <div class="flex flex-wrap gap-2">
          <button
            v-for="f in formatFilters"
            :key="f.value"
            class="px-3 py-1.5 rounded-full text-xs font-medium transition-all duration-200"
            :class="activeFormat === f.value
              ? 'bg-brand-500 text-stage-950'
              : 'bg-stage-800 text-stage-400 hover:text-stage-200 border border-stage-700/40'"
            @click="activeFormat = f.value"
          >
            {{ f.label }}
          </button>
        </div>
        <div class="flex flex-wrap gap-2">
          <button
            v-for="c in categoryFilters"
            :key="c.value"
            class="px-3 py-1.5 rounded-full text-xs font-medium transition-all duration-200"
            :class="activeCategory === c.value
              ? 'bg-brand-500 text-stage-950'
              : 'bg-stage-800 text-stage-400 hover:text-stage-200 border border-stage-700/40'"
            @click="activeCategory = c.value"
          >
            {{ c.label }}
          </button>
        </div>
      </div>
    </section>

    <!-- Events Grid -->
    <section class="events-page__grid-section pb-12" id="past-events-grid">
      <div class="events-page__grid-container max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div class="events-page__grid grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          <EventCard
            v-for="ev in filteredEvents"
            :key="ev.slug"
            :event="{ ...ev, view_type: 'light' }"
            class="events-page__card opacity-90 hover:opacity-100 grayscale hover:grayscale-0 transition-all duration-500"
          />
        </div>

        <p v-if="filteredEvents.length === 0" class="text-center text-stage-500 py-16 text-lg">
          No past events found matching these criteria.
        </p>

        <!-- Pagination -->
        <div v-if="totalPages > 1" class="events-page__pagination mt-12 flex justify-center items-center gap-2">
          <button
            :disabled="currentPage === 1"
            @click="changePage(currentPage - 1)"
            class="p-2 rounded-lg bg-stage-800 text-stage-400 disabled:opacity-30 hover:text-stage-100 transition-colors"
          >
            <svg class="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 19l-7-7 7-7" /></svg>
          </button>
          
          <div class="flex items-center gap-1">
            <button
              v-for="p in totalPages"
              :key="p"
              @click="changePage(p)"
              class="w-10 h-10 rounded-lg text-sm font-bold transition-all"
              :class="currentPage === p 
                ? 'bg-brand-500 text-stage-950' 
                : 'bg-stage-800 text-stage-400 hover:bg-stage-700'"
            >
              {{ p }}
            </button>
          </div>

          <button
            :disabled="currentPage === totalPages"
            @click="changePage(currentPage + 1)"
            class="p-2 rounded-lg bg-stage-800 text-stage-400 disabled:opacity-30 hover:text-stage-100 transition-colors"
          >
            <svg class="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5l7 7-7 7" /></svg>
          </button>
        </div>
      </div>
    </section>
  </div>
</template>
