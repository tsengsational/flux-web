<script setup lang="ts">
import { RRule } from 'rrule';
import type { Event, EventFormat, EventCategory } from '@flux-theatre/shared';

useSeoMeta({
  title: 'Events — Flux Theatre Ensemble',
  description: 'Workshops, readings, talkbacks, fundraisers, and community events from Flux Theatre Ensemble — in person and online.',
});

const { client, readItems } = useDirectus();

import { toZonedTime, fromZonedTime } from 'date-fns-tz';

const timeZone = 'America/New_York';

const { data: cmsEvents, error } = await useAsyncData<Event[]>('events-list-v1', () => 
  client.request(readItems('events', {
    filter: { 
      status: { _eq: 'published' }
    },
    fields: [
      '*', 
      'is_recurring',
      'recurrence_rule',
      { venue: ['name'] },
      { tags: ['*', { tags_id: ['*'] }] }
    ] as any,
    sort: ['start_datetime']
  }))
);

const events = computed(() => {
  if (!cmsEvents.value) return [];
  
  const expanded: any[] = [];
  const now = new Date();
  const threeMonthsLater = new Date(now.getTime() + 90 * 24 * 60 * 60 * 1000);

  cmsEvents.value.forEach((ev: any) => {
    if (ev.is_recurring && ev.recurrence_rule) {
      try {
        // Convert the UTC start date to New York time for rule calculation
        const dtstart = toZonedTime(new Date(ev.start_datetime), timeZone);
        
        // Use local NY components for the RRule start date
        const year = dtstart.getFullYear();
        const month = dtstart.getMonth() + 1;
        const day = dtstart.getDate();
        const hour = dtstart.getHours();
        const min = dtstart.getMinutes();
        const sec = dtstart.getSeconds();
        
        const pad = (n: number) => n.toString().padStart(2, '0');
        const dtstartStr = `${year}${pad(month)}${pad(day)}T${pad(hour)}${pad(min)}${pad(sec)}`;
        
        const rule = RRule.fromString(`DTSTART:${dtstartStr}\nRRULE:${ev.recurrence_rule}`);
        
        // Get occurrences relative to the New York start time
        const occurrences = rule.between(dtstart > now ? dtstart : now, threeMonthsLater, true);
        
        occurrences.forEach((date) => {
          // Convert the calculated NY date back to a real UTC Date object
          const utcDate = fromZonedTime(date, timeZone);
          
          expanded.push({
            ...ev,
            id: `${ev.id}-${utcDate.getTime()}`,
            start_datetime: utcDate.toISOString(),
            // Calculate end date based on original duration
            end_datetime: ev.end_datetime ? new Date(utcDate.getTime() + (new Date(ev.end_datetime).getTime() - new Date(ev.start_datetime).getTime())).toISOString() : null
          });
        });
      } catch (e) {
        console.error('RRule Error:', e);
        expanded.push(ev);
      }
    } else {
      // For non-recurring, only show if it's in the future
      if (new Date(ev.start_datetime) >= now) {
        expanded.push(ev);
      }
    }
  });

  return expanded.sort((a, b) => new Date(a.start_datetime).getTime() - new Date(b.start_datetime).getTime());
});

type FormatFilter = 'all' | EventFormat;
type CategoryFilter = 'all' | EventCategory;

const activeFormat = ref<FormatFilter>('all');
const activeCategory = ref<CategoryFilter>('all');

const filteredEvents = computed(() => {
  return events.value.filter((e: any) => {
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

const viewMode = ref<'grid' | 'calendar'>('calendar');
</script>

<template>
  <div class="events-page">
    <!-- Page Header -->
    <section class="events-page__header pt-12 pb-6" id="events-header">
      <div class="events-page__header-container max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col md:flex-row md:items-end justify-between gap-6">
        <div>
          <p class="events-page__subtitle text-brand-400 font-medium text-sm uppercase tracking-[0.15em] mb-2">Get Involved</p>
          <h1 class="events-page__title section-heading">Events</h1>
          <p class="events-page__description mt-4 text-stage-400 text-lg max-w-2xl">
            Workshops, readings, talkbacks, fundraisers, and more — in person and online.
          </p>
        </div>

        <!-- View Toggle -->
        <div class="events-page__view-toggle flex bg-stage-800/40 p-1 rounded-xl border border-stage-800/60 w-fit self-start">
          <button 
            @click="viewMode = 'grid'"
            class="px-4 py-2 rounded-lg text-xs font-bold transition-all flex items-center gap-2"
            :class="viewMode === 'grid' ? 'bg-brand-500 text-stage-950 shadow-lg' : 'text-stage-400 hover:text-stage-200'"
          >
            <svg class="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2V6zM14 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2V6zM4 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2v-2zM14 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2v-2z" /></svg>
            Grid
          </button>
          <button 
            @click="viewMode = 'calendar'"
            class="px-4 py-2 rounded-lg text-xs font-bold transition-all flex items-center gap-2"
            :class="viewMode === 'calendar' ? 'bg-brand-500 text-stage-950 shadow-lg' : 'text-stage-400 hover:text-stage-200'"
          >
            <svg class="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" /></svg>
            Calendar
          </button>
        </div>
      </div>
    </section>

    <!-- Filters (Only for Grid Mode) -->
    <section v-if="viewMode === 'grid'" class="events-page__filters-section pb-8" id="event-filters">
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

    <!-- Main View Section -->
    <section class="events-page__main-section pb-24" id="events-content">
      <div class="events-page__main-container max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        <!-- Grid View -->
        <div v-if="viewMode === 'grid'">
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
              :key="ev.id"
              :event="{ ...ev, view_type: 'light' }"
              class="events-page__card"
            />
          </TransitionGroup>

          <p v-if="filteredEvents.length === 0" class="events-page__empty-text text-center text-stage-500 py-16 text-lg">
            No events match the current filters.
          </p>
        </div>

        <!-- Calendar View -->
        <div v-else class="events-page__calendar-wrapper">
          <CalendarView :events="events" />
        </div>

        <!-- Footer -->
        <div class="events-page__footer mt-12 flex flex-col sm:flex-row items-center justify-center gap-4">
          <NuxtLink to="/events/past" class="events-page__past-btn text-sm text-stage-500 hover:text-brand-400 transition-colors" id="view-past-events">
            Looking for something else? View Past Events
          </NuxtLink>
        </div>
      </div>
    </section>
  </div>
</template>
