<script setup lang="ts">
import type { Event, EventFormat, EventCategory } from '@flux-theatre/shared';

useSeoMeta({
  title: 'Events — Flux Theatre Ensemble',
  description: 'Workshops, readings, talkbacks, fundraisers, and community events from Flux Theatre Ensemble — in person and online.',
});

const { client, readItems } = useDirectus();

const { data: cmsEvents, error } = await useAsyncData<Event[]>('events-list-v1', () => 
  client.request(readItems('events', {
    filter: { 
      status: { _eq: 'published' }
    },
    fields: [
      '*', 
      { venue: ['name'] },
      { tags: ['*', { tags_id: ['*'] }] }
    ] as any,
    sort: ['start_datetime']
  }))
);

const events = computed(() => cmsEvents.value || []);

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
  <div class="events-page">
    <!-- Page Header -->
    <section class="events-page__header pt-12 pb-6" id="events-header">
      <div class="events-page__header-container max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <p class="events-page__subtitle text-brand-400 font-medium text-sm uppercase tracking-[0.15em] mb-2">Get Involved</p>
        <h1 class="events-page__title section-heading">Events</h1>
        <p class="events-page__description mt-4 text-stage-400 text-lg max-w-2xl">
          Workshops, readings, talkbacks, fundraisers, and more — in person and online.
        </p>
      </div>
    </section>

    <!-- Filters -->
    <section class="events-page__filters-section pb-8" id="event-filters">
      <div class="events-page__filters-container max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-4">
        <!-- Format filter -->
        <div class="events-page__filter-group events-page__filter-group--format flex flex-wrap gap-2">
          <button
            v-for="f in formatFilters"
            :key="f.value"
            class="events-page__filter-btn px-3 py-1.5 rounded-full text-xs font-medium transition-all duration-200 text-stage-50"
            :class="activeFormat === f.value
              ? 'bg-brand-500 text-stage-950'
              : 'bg-stage-600/60 text-stage-300 hover:text-stage-200 border border-stage-700/40'"
            @click="activeFormat = f.value"
          >
            {{ f.label }}
          </button>
        </div>
        <!-- Category filter -->
        <div class="events-page__filter-group events-page__filter-group--category flex flex-wrap gap-2">
          <button
            v-for="c in categoryFilters"
            :key="c.value"
            class="events-page__filter-btn px-3 py-1.5 rounded-full text-xs font-medium transition-all duration-200 text-stage-50"
            :class="activeCategory === c.value
              ? 'bg-brand-500 text-stage-950'
              : 'bg-stage-600/60 text-stage-300 hover:text-stage-200 border border-stage-700/40'"
            @click="activeCategory = c.value"
          >
            {{ c.label }}
          </button>
        </div>
      </div>
    </section>

    <!-- Events Grid -->
    <section class="events-page__grid-section pb-24" id="events-grid">
      <div class="events-page__grid-container max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div class="text-[10px] text-stage-600 mb-2 whitespace-pre-wrap">
          DEBUG: {{ Array.isArray(cmsEvents) ? cmsEvents.length : 'Not an array' }} items. 
          Raw: {{ JSON.stringify(cmsEvents)?.substring(0, 100) }}
          Error: {{ error }}
        </div>
        <TransitionGroup
          tag="div"
          class="events-page__grid grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6"
          enter-active-class="transition-all duration-300 ease-out"
          enter-from-class="opacity-0 scale-95"
          enter-to-class="opacity-100 scale-100"
          leave-active-class="transition-all duration-200 ease-in"
          leave-from-class="opacity-100 scale-100"
          leave-to-class="opacity-0 scale-95"
        >
          <EventCard
            v-for="ev in filteredEvents"
            :key="ev.slug"
            :event="{ ...ev, view_type: 'light' }"
            class="events-page__card"
          />
        </TransitionGroup>

        <p v-if="filteredEvents.length === 0" class="events-page__empty-text text-center text-stage-500 py-16 text-lg">
          No events match the current filters.
        </p>

        <!-- Calendar link -->
        <div class="events-page__footer mt-12 flex flex-col sm:flex-row items-center justify-center gap-4">
          <NuxtLink to="/calendar" class="events-page__calendar-btn btn-secondary" id="go-to-calendar">
            View Full Calendar
          </NuxtLink>
          <NuxtLink to="/events/past" class="events-page__past-btn text-sm text-stage-500 hover:text-brand-400 transition-colors" id="view-past-events">
            View Past Events
          </NuxtLink>
        </div>
      </div>
    </section>
  </div>
</template>
