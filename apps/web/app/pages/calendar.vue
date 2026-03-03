<script setup lang="ts">
import type { CalendarEntry, EventCategory, EventFormat } from '@flux-theatre/shared';

useSeoMeta({
  title: 'Calendar — Flux Theatre Ensemble',
  description: 'See all upcoming performances, events, workshops, and readings from Flux Theatre Ensemble in one place.',
});

// In production these would be fetched and merged from /items/showtimes + /items/events
const calendarEntries: CalendarEntry[] = [
  // Production showtimes
  { id: 'st-1', title: 'The Tempest Reimagined', datetime: '2026-04-10T20:00:00', end_datetime: null, type: 'showtime', slug: 'the-tempest-reimagined', venue_name: 'The 4th Street Theatre', is_sold_out: false, notes: 'Opening Night' },
  { id: 'st-2', title: 'The Tempest Reimagined', datetime: '2026-04-11T20:00:00', end_datetime: null, type: 'showtime', slug: 'the-tempest-reimagined', venue_name: 'The 4th Street Theatre', is_sold_out: false, notes: null },
  { id: 'st-3', title: 'The Tempest Reimagined', datetime: '2026-04-12T14:00:00', end_datetime: null, type: 'showtime', slug: 'the-tempest-reimagined', venue_name: 'The 4th Street Theatre', is_sold_out: false, notes: 'Matinee' },
  { id: 'st-4', title: 'The Tempest Reimagined', datetime: '2026-04-12T20:00:00', end_datetime: null, type: 'showtime', slug: 'the-tempest-reimagined', venue_name: 'The 4th Street Theatre', is_sold_out: true, notes: null },
  { id: 'st-5', title: 'The Tempest Reimagined', datetime: '2026-04-17T20:00:00', end_datetime: null, type: 'showtime', slug: 'the-tempest-reimagined', venue_name: 'The 4th Street Theatre', is_sold_out: false, notes: 'Pay-What-You-Can' },
  { id: 'st-6', title: 'The Tempest Reimagined', datetime: '2026-04-18T20:00:00', end_datetime: null, type: 'showtime', slug: 'the-tempest-reimagined', venue_name: 'The 4th Street Theatre', is_sold_out: false, notes: null },
  { id: 'st-7', title: 'The Tempest Reimagined', datetime: '2026-04-24T20:00:00', end_datetime: null, type: 'showtime', slug: 'the-tempest-reimagined', venue_name: 'The 4th Street Theatre', is_sold_out: false, notes: null },
  { id: 'st-8', title: 'The Tempest Reimagined', datetime: '2026-05-02T20:00:00', end_datetime: null, type: 'showtime', slug: 'the-tempest-reimagined', venue_name: 'The 4th Street Theatre', is_sold_out: false, notes: 'Closing Night' },
  // Standalone events
  { id: 'ev-1', title: 'Flux Sundays: New Play Readings', datetime: '2026-03-16T14:00:00', end_datetime: '2026-03-16T17:00:00', type: 'event', slug: 'flux-sundays-march-2026', category: 'reading', format: 'in_person', venue_name: 'The 4th Street Theatre' },
  { id: 'ev-2', title: 'Playwriting Masterclass with Aria Chen', datetime: '2026-03-22T10:00:00', end_datetime: '2026-03-22T12:00:00', type: 'event', slug: 'masterclass-aria-chen', category: 'masterclass', format: 'hybrid', venue_name: 'Flux Studio' },
  { id: 'ev-3', title: 'Virtual Talkback: Directing The Tempest Today', datetime: '2026-04-02T19:00:00', end_datetime: '2026-04-02T20:30:00', type: 'event', slug: 'talkback-directing-tempest', category: 'talkback', format: 'digital' },
  { id: 'ev-4', title: 'Annual Spring Fundraiser Gala', datetime: '2026-04-25T18:30:00', end_datetime: '2026-04-25T22:00:00', type: 'event', slug: 'spring-gala-2026', category: 'fundraiser', format: 'in_person', venue_name: 'The Green Room NYC' },
  { id: 'ev-5', title: 'Open Auditions: Neon Wilderness', datetime: '2026-05-10T10:00:00', end_datetime: '2026-05-10T17:00:00', type: 'event', slug: 'auditions-neon-wilderness', category: 'audition', format: 'in_person', venue_name: 'Flux Studio' },
  { id: 'ev-6', title: 'Community Workshop: Devising from Dream', datetime: '2026-05-17T13:00:00', end_datetime: '2026-05-17T16:00:00', type: 'event', slug: 'workshop-devising-dream', category: 'workshop', format: 'in_person', venue_name: 'The 4th Street Theatre' },
  { id: 'ev-7', title: 'Neon Wilderness', datetime: '2026-06-05T20:00:00', end_datetime: null, type: 'showtime', slug: 'neon-wilderness', venue_name: 'TBD', is_sold_out: false, notes: 'Opening Night' },
];

// ── Calendar Logic ──

type TypeFilter = 'all' | 'showtime' | 'event';
const activeType = ref<TypeFilter>('all');

const today = new Date();
const currentMonth = ref(today.getMonth());
const currentYear = ref(today.getFullYear());

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

function goToToday() {
  currentMonth.value = today.getMonth();
  currentYear.value = today.getFullYear();
}

// Build the calendar grid (6 weeks × 7 days)
const calendarDays = computed(() => {
  const firstDay = new Date(currentYear.value, currentMonth.value, 1);
  const startOffset = firstDay.getDay(); // 0 = Sunday
  const daysInMonth = new Date(currentYear.value, currentMonth.value + 1, 0).getDate();
  const daysInPrevMonth = new Date(currentYear.value, currentMonth.value, 0).getDate();

  const days: { date: number; month: 'prev' | 'current' | 'next'; fullDate: string; isToday: boolean }[] = [];

  // Previous month padding
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

  // Current month
  for (let d = 1; d <= daysInMonth; d++) {
    const fullDate = `${currentYear.value}-${String(currentMonth.value + 1).padStart(2, '0')}-${String(d).padStart(2, '0')}`;
    const isToday = d === today.getDate() && currentMonth.value === today.getMonth() && currentYear.value === today.getFullYear();
    days.push({ date: d, month: 'current', fullDate, isToday });
  }

  // Next month padding (fill to 42 cells = 6 rows)
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

// Get entries for a specific date
function getEntriesForDate(fullDate: string): CalendarEntry[] {
  return calendarEntries
    .filter(e => {
      if (activeType.value !== 'all' && e.type !== activeType.value) return false;
      return e.datetime.startsWith(fullDate);
    })
    .sort((a, b) => new Date(a.datetime).getTime() - new Date(b.datetime).getTime());
}

// Upcoming list view (next 30 days from today)
const upcomingEntries = computed(() => {
  const now = new Date();
  const thirtyDays = new Date(now.getTime() + 30 * 24 * 60 * 60 * 1000);
  return calendarEntries
    .filter(e => {
      const d = new Date(e.datetime);
      if (d < now || d > thirtyDays) return false;
      if (activeType.value !== 'all' && e.type !== activeType.value) return false;
      return true;
    })
    .sort((a, b) => new Date(a.datetime).getTime() - new Date(b.datetime).getTime());
});

type ViewMode = 'calendar' | 'list';
const viewMode = ref<ViewMode>('calendar');

function formatEntryTime(iso: string) {
  return new Date(iso).toLocaleTimeString('en-US', { hour: 'numeric', minute: '2-digit' });
}

function formatEntryDate(iso: string) {
  return new Date(iso).toLocaleDateString('en-US', { weekday: 'short', month: 'short', day: 'numeric' });
}

function entryLink(entry: CalendarEntry) {
  return entry.type === 'showtime' ? `/productions/${entry.slug}` : `/events/${entry.slug}`;
}

const weekDays = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
</script>

<template>
  <div>
    <!-- Page Header -->
    <section class="pt-12 pb-6" id="calendar-header">
      <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <p class="text-brand-400 font-medium text-sm uppercase tracking-[0.15em] mb-2">What's On</p>
        <h1 class="section-heading">Calendar</h1>
        <p class="mt-4 text-stage-400 text-lg max-w-2xl">
          Performances, workshops, readings, and more — everything happening at Flux, all in one place.
        </p>
      </div>
    </section>

    <!-- Controls Bar -->
    <section class="pb-6" id="calendar-controls">
      <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div class="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <!-- Type filter -->
          <div class="flex gap-2">
            <button
              v-for="f in ([
                { label: 'All', value: 'all' },
                { label: 'Performances', value: 'showtime' },
                { label: 'Events', value: 'event' },
              ] as { label: string; value: TypeFilter }[])"
              :key="f.value"
              class="px-3 py-1.5 rounded-full text-xs font-medium transition-all duration-200"
              :class="activeType === f.value
                ? 'bg-brand-500 text-stage-950'
                : 'bg-stage-800/60 text-stage-400 hover:text-stage-200 border border-stage-700/40'"
              @click="activeType = f.value"
            >
              {{ f.label }}
            </button>
          </div>

          <!-- View toggle -->
          <div class="flex items-center gap-2">
            <button
              class="px-3 py-1.5 rounded-lg text-xs font-medium transition-all"
              :class="viewMode === 'calendar' ? 'bg-stage-800 text-stage-100' : 'text-stage-500 hover:text-stage-300'"
              @click="viewMode = 'calendar'"
              id="view-calendar"
            >
              <svg class="w-4 h-4 inline-block mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="1.5">
                <path stroke-linecap="round" stroke-linejoin="round" d="M6.75 3v2.25M17.25 3v2.25M3 18.75V7.5a2.25 2.25 0 012.25-2.25h13.5A2.25 2.25 0 0121 7.5v11.25m-18 0A2.25 2.25 0 005.25 21h13.5A2.25 2.25 0 0021 18.75m-18 0v-7.5A2.25 2.25 0 015.25 9h13.5A2.25 2.25 0 0121 11.25v7.5" />
              </svg>
              Calendar
            </button>
            <button
              class="px-3 py-1.5 rounded-lg text-xs font-medium transition-all"
              :class="viewMode === 'list' ? 'bg-stage-800 text-stage-100' : 'text-stage-500 hover:text-stage-300'"
              @click="viewMode = 'list'"
              id="view-list"
            >
              <svg class="w-4 h-4 inline-block mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="1.5">
                <path stroke-linecap="round" stroke-linejoin="round" d="M8.25 6.75h12M8.25 12h12m-12 5.25h12M3.75 6.75h.007v.008H3.75V6.75zm.375 0a.375.375 0 11-.75 0 .375.375 0 01.75 0zM3.75 12h.007v.008H3.75V12zm.375 0a.375.375 0 11-.75 0 .375.375 0 01.75 0zm-.375 5.25h.007v.008H3.75v-.008zm.375 0a.375.375 0 11-.75 0 .375.375 0 01.75 0z" />
              </svg>
              List
            </button>
          </div>
        </div>
      </div>
    </section>

    <!-- ═══ CALENDAR VIEW ═══ -->
    <section v-if="viewMode === 'calendar'" class="pb-24" id="calendar-grid">
      <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <!-- Month Navigation -->
        <div class="flex items-center justify-between mb-6">
          <button
            @click="prevMonth"
            class="p-2 rounded-lg text-stage-400 hover:text-stage-100 hover:bg-stage-800/50 transition-all"
            aria-label="Previous month"
          >
            <svg class="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
              <path stroke-linecap="round" stroke-linejoin="round" d="M15.75 19.5L8.25 12l7.5-7.5" />
            </svg>
          </button>
          <div class="text-center">
            <h2 class="text-2xl font-serif font-bold text-stage-50">{{ monthLabel }}</h2>
            <button
              @click="goToToday"
              class="text-xs text-brand-400 hover:text-brand-300 transition-colors mt-1"
            >
              Today
            </button>
          </div>
          <button
            @click="nextMonth"
            class="p-2 rounded-lg text-stage-400 hover:text-stage-100 hover:bg-stage-800/50 transition-all"
            aria-label="Next month"
          >
            <svg class="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
              <path stroke-linecap="round" stroke-linejoin="round" d="M8.25 4.5l7.5 7.5-7.5 7.5" />
            </svg>
          </button>
        </div>

        <!-- Calendar Grid -->
        <div class="card-glass overflow-hidden">
          <!-- Weekday headers -->
          <div class="grid grid-cols-7 border-b border-stage-700/30">
            <div
              v-for="day in weekDays"
              :key="day"
              class="py-3 text-center text-xs font-semibold uppercase tracking-wider text-stage-400"
            >
              {{ day }}
            </div>
          </div>

          <!-- Day cells -->
          <div class="grid grid-cols-7">
            <div
              v-for="(day, idx) in calendarDays"
              :key="idx"
              class="min-h-[100px] lg:min-h-[120px] p-1.5 border-b border-r border-stage-800/30 transition-colors"
              :class="{
                'bg-stage-900/30': day.month !== 'current',
                'bg-brand-500/5': day.isToday,
              }"
            >
              <!-- Day number -->
              <div class="flex items-center justify-between mb-1">
                <span
                  class="text-xs font-medium w-6 h-6 flex items-center justify-center rounded-full"
                  :class="{
                    'text-stage-500': day.month !== 'current',
                    'text-stage-300': day.month === 'current' && !day.isToday,
                    'bg-brand-500 text-stage-950 font-bold': day.isToday,
                  }"
                >
                  {{ day.date }}
                </span>
              </div>

              <!-- Entries for this day -->
              <div class="space-y-0.5">
                <NuxtLink
                  v-for="entry in getEntriesForDate(day.fullDate).slice(0, 3)"
                  :key="entry.id"
                  :to="entryLink(entry)"
                  class="block px-1.5 py-0.5 rounded text-[10px] lg:text-xs font-medium truncate transition-colors"
                  :class="entry.type === 'showtime'
                    ? 'bg-curtain-500/20 text-curtain-500 hover:bg-curtain-500/30 border-l-2 border-curtain-500'
                    : 'bg-brand-500/15 text-brand-400 hover:bg-brand-500/25 border-l-2 border-brand-500'"
                  :title="`${entry.title} — ${formatEntryTime(entry.datetime)}`"
                >
                  {{ formatEntryTime(entry.datetime) }} {{ entry.title }}
                </NuxtLink>
                <span
                  v-if="getEntriesForDate(day.fullDate).length > 3"
                  class="block px-1.5 text-[10px] text-stage-500"
                >
                  +{{ getEntriesForDate(day.fullDate).length - 3 }} more
                </span>
              </div>
            </div>
          </div>
        </div>

        <!-- Legend -->
        <div class="mt-4 flex items-center gap-6 text-xs text-stage-500">
          <div class="flex items-center gap-2">
            <span class="w-3 h-3 rounded bg-curtain-500/30 border-l-2 border-curtain-500" />
            Performances
          </div>
          <div class="flex items-center gap-2">
            <span class="w-3 h-3 rounded bg-brand-500/20 border-l-2 border-brand-500" />
            Events
          </div>
        </div>
      </div>
    </section>

    <!-- ═══ LIST VIEW ═══ -->
    <section v-else class="pb-24" id="calendar-list">
      <div class="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <h2 class="text-lg font-serif font-semibold text-stage-200 mb-6">Upcoming (Next 30 Days)</h2>

        <div v-if="upcomingEntries.length" class="space-y-3">
          <NuxtLink
            v-for="entry in upcomingEntries"
            :key="entry.id"
            :to="entryLink(entry)"
            class="card-glass p-4 flex items-center gap-4 group"
          >
            <!-- Date block -->
            <div class="w-14 h-14 flex-shrink-0 rounded-lg flex flex-col items-center justify-center"
              :class="entry.type === 'showtime' ? 'bg-curtain-500/20' : 'bg-brand-500/15'"
            >
              <span class="text-xs font-bold uppercase" :class="entry.type === 'showtime' ? 'text-curtain-500' : 'text-brand-400'">
                {{ new Date(entry.datetime).toLocaleDateString('en-US', { month: 'short' }) }}
              </span>
              <span class="text-lg font-bold" :class="entry.type === 'showtime' ? 'text-curtain-500' : 'text-brand-400'">
                {{ new Date(entry.datetime).getDate() }}
              </span>
            </div>

            <!-- Details -->
            <div class="flex-1 min-w-0">
              <div class="flex items-center gap-2 mb-1">
                <span
                  class="px-2 py-0.5 rounded-full text-[10px] font-semibold uppercase tracking-wider"
                  :class="entry.type === 'showtime'
                    ? 'bg-curtain-500/20 text-curtain-500'
                    : 'bg-brand-500/20 text-brand-400'"
                >
                  {{ entry.type === 'showtime' ? 'Performance' : (entry.category || 'Event') }}
                </span>
                <span v-if="entry.notes" class="text-[10px] text-stage-500">{{ entry.notes }}</span>
                <span v-if="entry.is_sold_out" class="text-[10px] text-red-400 font-semibold">Sold Out</span>
              </div>
              <h3 class="text-sm font-semibold text-stage-100 group-hover:text-brand-400 transition-colors truncate">
                {{ entry.title }}
              </h3>
              <div class="flex items-center gap-3 text-xs text-stage-500 mt-1">
                <span>{{ formatEntryTime(entry.datetime) }}</span>
                <span v-if="entry.venue_name">· {{ entry.venue_name }}</span>
                <span v-if="entry.format === 'digital'" class="text-blue-400">· Online</span>
              </div>
            </div>

            <!-- Arrow -->
            <svg class="w-4 h-4 text-stage-600 group-hover:text-brand-400 group-hover:translate-x-1 transition-all flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
              <path stroke-linecap="round" stroke-linejoin="round" d="M8.25 4.5l7.5 7.5-7.5 7.5" />
            </svg>
          </NuxtLink>
        </div>

        <p v-else class="text-center text-stage-500 py-16 text-lg">
          No upcoming entries in the next 30 days.
        </p>
      </div>
    </section>
  </div>
</template>
