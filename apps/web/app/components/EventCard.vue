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
  venue: string | { name: string } | null;
  virtual_url: string | null;
  is_free: boolean;
  price: string | null;
  rsvp_url: string | null;
  tags?: Array<{ id: string; tags_id: { name: string } | string }>;
  view_type: 'light' | 'dark';
}

const props = defineProps<{ event: EventSummary }>();
const { getAssetUrl } = useDirectus();

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
    performance: 'Performance',
  };
  return labels[props.event.category];
});

const eventTags = computed(() => {
  if (!props.event.tags) return [];
  return props.event.tags
    .map(t => typeof t.tags_id === 'object' ? t.tags_id.name : null)
    .filter(Boolean);
});
</script>

<template>
  <NuxtLink
    :to="`/events/${event.slug}`"
    class="event-card card-glass group block"
    :id="`event-card-${event.slug}`"
  >
    <!-- Cover Image -->
    <div class="event-card__image-container relative aspect-video bg-stage-800 overflow-hidden">
      <img
        v-if="event.cover_image"
        :src="getAssetUrl(event.cover_image)!"
        :alt="event.title"
        class="event-card__image w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
        loading="lazy"
      />
      <div v-else class="event-card__placeholder w-full h-full flex items-center justify-center bg-gradient-to-br from-curtain-700/20 to-stage-900">
        <svg class="event-card__placeholder-icon w-12 h-12 text-stage-600" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="1">
          <path stroke-linecap="round" stroke-linejoin="round" d="M6.75 3v2.25M17.25 3v2.25M3 18.75V7.5a2.25 2.25 0 012.25-2.25h13.5A2.25 2.25 0 0121 7.5v11.25m-18 0A2.25 2.25 0 005.25 21h13.5A2.25 2.25 0 0021 18.75m-18 0v-7.5A2.25 2.25 0 015.25 9h13.5A2.25 2.25 0 0121 11.25v7.5" />
        </svg>
      </div>

      <!-- Badges -->
      <div class="event-card__badges absolute top-3 left-3 flex gap-2">
        <span class="event-card__category px-2.5 py-1 rounded-full text-xs font-bold bg-brand-600 text-white shadow-sm">
          {{ categoryLabel }}
        </span>
        <span
          class="event-card__format px-2.5 py-1 rounded-full text-xs font-bold shadow-sm"
          :class="{
            'event-card__format--digital bg-blue-600 text-white': event.format === 'digital',
            'event-card__format--hybrid bg-purple-600 text-white': event.format === 'hybrid',
            'event-card__format--in-person bg-stage-900 text-stage-100': event.format === 'in_person',
          }"
        >
          <!-- Format icon -->
          <span class="event-card__format-label inline-flex items-center gap-1">
            <svg v-if="formatIcon === 'digital'" class="event-card__format-icon w-3 h-3" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
              <path stroke-linecap="round" stroke-linejoin="round" d="M9 17.25v1.007a3 3 0 01-.879 2.122L7.5 21h9l-.621-.621A3 3 0 0115 18.257V17.25m6-12V15a2.25 2.25 0 01-2.25 2.25H5.25A2.25 2.25 0 013 15V5.25A2.25 2.25 0 015.25 3h13.5A2.25 2.25 0 0121 5.25z" />
            </svg>
            <svg v-else class="event-card__format-icon w-3 h-3" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
              <path stroke-linecap="round" stroke-linejoin="round" d="M15 10.5a3 3 0 11-6 0 3 3 0 016 0z" />
              <path stroke-linecap="round" stroke-linejoin="round" d="M19.5 10.5c0 7.142-7.5 11.25-7.5 11.25S4.5 17.642 4.5 10.5a7.5 7.5 0 1115 0z" />
            </svg>
            {{ formatLabel }}
          </span>
        </span>
      </div>
    </div>

    <!-- Info -->
    <div class="event-card__info p-5">
      <div class="event-card__date-time flex items-center gap-2 text-xs text-brand-700 font-bold mb-2">
        <svg class="event-card__time-icon w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2.5">
          <path stroke-linecap="round" stroke-linejoin="round" d="M12 6v6h4.5m4.5 0a9 9 0 11-18 0 9 9 0 0118 0z" />
        </svg>
        {{ formattedDate }} · {{ formattedTime }}
      </div>

      <h3 class="event-card__title text-lg font-serif font-bold text-stage-950 group-hover:text-brand-400 transition-colors line-clamp-2">
        {{ event.title }}
      </h3>

      <p v-if="event.excerpt" class="event-card__excerpt text-sm text-stage-700 mt-2 leading-relaxed line-clamp-2">
        {{ event.excerpt }}
      </p>

      <!-- Tags -->
      <div v-if="eventTags.length" class="event-card__tags mt-3 flex flex-wrap gap-1.5">
        <span
          v-for="tag in eventTags"
          :key="tag"
          class="event-card__tag text-[10px] px-2 py-0.5 rounded-full bg-stage-50 text-stage-700 border border-stage-200 font-bold"
        >
          {{ tag }}
        </span>
      </div>

      <!-- Location / Price row -->
      <div class="event-card__footer mt-3 flex items-center justify-between text-xs text-stage-700 font-medium">
        <span v-if="event.venue" class="event-card__location flex items-center gap-1">
          <svg class="event-card__location-icon w-3 h-3" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
            <path stroke-linecap="round" stroke-linejoin="round" d="M15 10.5a3 3 0 11-6 0 3 3 0 016 0z" />
            <path stroke-linecap="round" stroke-linejoin="round" d="M19.5 10.5c0 7.142-7.5 11.25-7.5 11.25S4.5 17.642 4.5 10.5a7.5 7.5 0 1115 0z" />
          </svg>
          {{ typeof event.venue === 'string' ? event.venue : event.venue.name }}
        </span>
        <span v-else-if="event.format === 'digital'" class="event-card__online flex items-center gap-1 text-blue-400">
          <svg class="event-card__online-icon w-3 h-3" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
            <path stroke-linecap="round" stroke-linejoin="round" d="M13.19 8.688a4.5 4.5 0 011.242 7.244l-4.5 4.5a4.5 4.5 0 01-6.364-6.364l1.757-1.757m9.86-2.63a4.5 4.5 0 00-6.364-6.364L4.5 8.257" />
          </svg>
          Online
        </span>
        <span class="event-card__price">
          {{ event.is_free ? 'Free' : event.price || 'See Details' }}
        </span>
      </div>
    </div>
  </NuxtLink>
</template>
