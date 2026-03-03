<script setup lang="ts">
import type { EventFormat, EventCategory } from '@flux-theatre/shared';

interface EventSummary {
  title: string;
  slug: string;
  excerpt: string | null;
  cover_image: string | null;
  start_datetime: string;
  end_datetime: string | null;
  format: EventFormat;
  category: EventCategory;
  venue: { name: string } | null;
  virtual_url: string | null;
  is_free: boolean;
  price: string | null;
  rsvp_url: string | null;
}

const props = defineProps<{ event: EventSummary }>();

const formattedDate = computed(() => {
  const d = new Date(props.event.start_datetime);
  return d.toLocaleDateString('en-US', { weekday: 'short', month: 'short', day: 'numeric' });
});

const formattedTime = computed(() => {
  const d = new Date(props.event.start_datetime);
  return d.toLocaleTimeString('en-US', { hour: 'numeric', minute: '2-digit' });
});

const formatLabel = computed(() => {
  const labels: Record<EventFormat, string> = {
    in_person: 'In Person',
    digital: 'Digital',
    hybrid: 'Hybrid',
  };
  return labels[props.event.format];
});

const formatIcon = computed(() => {
  if (props.event.format === 'digital') return 'digital';
  if (props.event.format === 'hybrid') return 'hybrid';
  return 'in_person';
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
  return labels[props.event.category];
});
</script>

<template>
  <NuxtLink
    :to="`/events/${event.slug}`"
    class="card-glass group block"
    :id="`event-card-${event.slug}`"
  >
    <!-- Cover Image -->
    <div class="relative aspect-video bg-stage-800 overflow-hidden">
      <img
        v-if="event.cover_image"
        :src="event.cover_image"
        :alt="event.title"
        class="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
        loading="lazy"
      />
      <div v-else class="w-full h-full flex items-center justify-center bg-gradient-to-br from-curtain-700/20 to-stage-900">
        <svg class="w-12 h-12 text-stage-600" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="1">
          <path stroke-linecap="round" stroke-linejoin="round" d="M6.75 3v2.25M17.25 3v2.25M3 18.75V7.5a2.25 2.25 0 012.25-2.25h13.5A2.25 2.25 0 0121 7.5v11.25m-18 0A2.25 2.25 0 005.25 21h13.5A2.25 2.25 0 0021 18.75m-18 0v-7.5A2.25 2.25 0 015.25 9h13.5A2.25 2.25 0 0121 11.25v7.5" />
        </svg>
      </div>

      <!-- Badges -->
      <div class="absolute top-3 left-3 flex gap-2">
        <span class="px-2.5 py-1 rounded-full text-xs font-semibold bg-brand-500/90 text-stage-950 backdrop-blur-sm">
          {{ categoryLabel }}
        </span>
        <span
          class="px-2.5 py-1 rounded-full text-xs font-semibold backdrop-blur-sm"
          :class="event.format === 'digital'
            ? 'bg-blue-500/80 text-white'
            : event.format === 'hybrid'
              ? 'bg-purple-500/80 text-white'
              : 'bg-stage-950/70 text-stage-200'"
        >
          <!-- Format icon -->
          <span class="inline-flex items-center gap-1">
            <svg v-if="formatIcon === 'digital'" class="w-3 h-3" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
              <path stroke-linecap="round" stroke-linejoin="round" d="M9 17.25v1.007a3 3 0 01-.879 2.122L7.5 21h9l-.621-.621A3 3 0 0115 18.257V17.25m6-12V15a2.25 2.25 0 01-2.25 2.25H5.25A2.25 2.25 0 013 15V5.25A2.25 2.25 0 015.25 3h13.5A2.25 2.25 0 0121 5.25z" />
            </svg>
            <svg v-else class="w-3 h-3" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
              <path stroke-linecap="round" stroke-linejoin="round" d="M15 10.5a3 3 0 11-6 0 3 3 0 016 0z" />
              <path stroke-linecap="round" stroke-linejoin="round" d="M19.5 10.5c0 7.142-7.5 11.25-7.5 11.25S4.5 17.642 4.5 10.5a7.5 7.5 0 1115 0z" />
            </svg>
            {{ formatLabel }}
          </span>
        </span>
      </div>
    </div>

    <!-- Info -->
    <div class="p-5">
      <div class="flex items-center gap-2 text-xs text-brand-400/80 font-medium mb-2">
        <svg class="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
          <path stroke-linecap="round" stroke-linejoin="round" d="M12 6v6h4.5m4.5 0a9 9 0 11-18 0 9 9 0 0118 0z" />
        </svg>
        {{ formattedDate }} · {{ formattedTime }}
      </div>

      <h3 class="text-lg font-serif font-bold text-stage-50 group-hover:text-brand-400 transition-colors line-clamp-2">
        {{ event.title }}
      </h3>

      <p v-if="event.excerpt" class="text-sm text-stage-400 mt-2 leading-relaxed line-clamp-2">
        {{ event.excerpt }}
      </p>

      <!-- Location / Price row -->
      <div class="mt-3 flex items-center justify-between text-xs text-stage-500">
        <span v-if="event.venue" class="flex items-center gap-1">
          <svg class="w-3 h-3" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
            <path stroke-linecap="round" stroke-linejoin="round" d="M15 10.5a3 3 0 11-6 0 3 3 0 016 0z" />
            <path stroke-linecap="round" stroke-linejoin="round" d="M19.5 10.5c0 7.142-7.5 11.25-7.5 11.25S4.5 17.642 4.5 10.5a7.5 7.5 0 1115 0z" />
          </svg>
          {{ event.venue.name }}
        </span>
        <span v-else-if="event.format === 'digital'" class="flex items-center gap-1 text-blue-400">
          <svg class="w-3 h-3" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
            <path stroke-linecap="round" stroke-linejoin="round" d="M13.19 8.688a4.5 4.5 0 011.242 7.244l-4.5 4.5a4.5 4.5 0 01-6.364-6.364l1.757-1.757m9.86-2.63a4.5 4.5 0 00-6.364-6.364L4.5 8.257" />
          </svg>
          Online
        </span>
        <span>
          {{ event.is_free ? 'Free' : event.price || 'See Details' }}
        </span>
      </div>
    </div>
  </NuxtLink>
</template>
