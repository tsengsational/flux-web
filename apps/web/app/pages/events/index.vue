<script setup lang="ts">
import type { EventFormat, EventCategory } from '@flux-theatre/shared';

useSeoMeta({
  title: 'Events — Flux Theatre Ensemble',
  description: 'Workshops, readings, talkbacks, fundraisers, and community events from Flux Theatre Ensemble — in person and online.',
});

const events = [
  {
    title: 'Flux Sundays: New Play Readings',
    slug: 'flux-sundays-march-2026',
    excerpt: 'Join us for our monthly reading series featuring two new short plays by emerging playwrights, followed by a community talkback.',
    cover_image: null,
    start_datetime: '2026-03-16T14:00:00',
    end_datetime: '2026-03-16T17:00:00',
    format: 'in_person' as EventFormat,
    category: 'reading' as EventCategory,
    venue: { name: 'The 4th Street Theatre' },
    virtual_url: null,
    is_free: true,
    price: null,
    rsvp_url: '#',
  },
  {
    title: 'Playwriting Masterclass with Aria Chen',
    slug: 'masterclass-aria-chen',
    excerpt: 'A two-hour intensive on structure, voice, and the politics of place in contemporary playwriting. Limited to 20 participants.',
    cover_image: null,
    start_datetime: '2026-03-22T10:00:00',
    end_datetime: '2026-03-22T12:00:00',
    format: 'hybrid' as EventFormat,
    category: 'masterclass' as EventCategory,
    venue: { name: 'Flux Studio' },
    virtual_url: '#',
    is_free: false,
    price: '$35 / Pay-What-You-Can',
    rsvp_url: '#',
  },
  {
    title: 'Virtual Talkback: Directing The Tempest Today',
    slug: 'talkback-directing-tempest',
    excerpt: 'Director Elena Vasquez discusses her approach to reimagining Shakespeare for a contemporary audience. Q&A included.',
    cover_image: null,
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
    excerpt: 'An evening of performances, cocktails, and celebration supporting Flux\'s mission of adventurous theatre. Includes a silent auction.',
    cover_image: null,
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
    excerpt: 'Seeking actors for Aria Chen\'s bold new work. All ethnicities and gender expressions welcome. Please prepare a contemporary monologue.',
    cover_image: null,
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
    excerpt: 'A free workshop exploring dream-based devising techniques. No experience necessary — bring a journal and an open mind.',
    cover_image: null,
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

type FormatFilter = 'all' | EventFormat;
type CategoryFilter = 'all' | EventCategory;

const activeFormat = ref<FormatFilter>('all');
const activeCategory = ref<CategoryFilter>('all');

const filteredEvents = computed(() => {
  return events.filter(e => {
    if (activeFormat.value !== 'all' && e.format !== activeFormat.value) return false;
    if (activeCategory.value !== 'all' && e.category !== activeCategory.value) return false;
    return true;
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
            class="events-page__filter-btn px-3 py-1.5 rounded-full text-xs font-medium transition-all duration-200"
            :class="activeFormat === f.value
              ? 'bg-brand-500 text-stage-950'
              : 'bg-stage-800/60 text-stage-400 hover:text-stage-200 border border-stage-700/40'"
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
            class="events-page__filter-btn px-3 py-1.5 rounded-full text-xs font-medium transition-all duration-200"
            :class="activeCategory === c.value
              ? 'bg-brand-500 text-stage-950'
              : 'bg-stage-800/60 text-stage-400 hover:text-stage-200 border border-stage-700/40'"
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
            :event="ev"
            class="events-page__card"
          />
        </TransitionGroup>

        <p v-if="filteredEvents.length === 0" class="events-page__empty-text text-center text-stage-500 py-16 text-lg">
          No events match the current filters.
        </p>

        <!-- Calendar link -->
        <div class="events-page__footer mt-12 text-center">
          <NuxtLink to="/calendar" class="events-page__calendar-btn btn-secondary" id="go-to-calendar">
            View Full Calendar
          </NuxtLink>
        </div>
      </div>
    </section>
  </div>
</template>
