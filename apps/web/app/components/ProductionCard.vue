<script setup lang="ts">
import type { Production } from '@flux-theatre/shared';

interface Props {
  production: Pick<Production, 'title' | 'slug' | 'tagline' | 'poster_image' | 'season' | 'playwright' | 'opening_date' | 'closing_date'>;
  view_type?: 'light' | 'dark';
}

const props = withDefaults(defineProps<Props>(), {
  view_type: 'light'
});
const { getAssetUrl } = useDirectus();

const dateRange = computed(() => {
  if (!props.production.opening_date) return null;
  const fmt = (d: string) => new Date(d).toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
  const open = fmt(props.production.opening_date);
  const close = props.production.closing_date ? fmt(props.production.closing_date) : 'TBD';
  return `${open} – ${close}`;
});
</script>

<template>
  <NuxtLink
    :to="`/productions/${production.slug}`"
    class="production-card card-glass group block"
    :id="`production-card-${production.slug}`"
  >
    <!-- Poster Image -->
    <div class="production-card__image-container relative aspect-[3/4] overflow-hidden bg-stage-800">
      <img
        v-if="production.poster_image"
        :src="getAssetUrl(production.poster_image, { width: 600, quality: 80 })!"
        :alt="`${production.title} poster`"
        class="production-card__poster w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
        loading="lazy"
      />
      <div v-else class="production-card__placeholder w-full h-full flex items-center justify-center">
        <span class="production-card__placeholder-text text-stage-600 font-serif text-6xl">F</span>
      </div>
      <!-- Overlay gradient -->
      <div class="production-card__overlay absolute inset-0 bg-gradient-to-t from-stage-950/90 via-stage-950/20 to-transparent" />

      <!-- Season badge -->
      <div class="production-card__badge absolute top-3 right-3">
        <span class="production-card__badge-text px-2.5 py-1 rounded-full text-xs font-bold bg-brand-600 text-white shadow-sm">
          {{ production.season }}
        </span>
      </div>
    </div>

    <!-- Info -->
    <div class="production-card__info p-5">
      <h3 
        class="production-card__title text-lg font-serif font-bold group-hover:text-brand-400 transition-colors line-clamp-2"
        :class="view_type === 'light' ? 'text-stage-950' : 'text-stage-50'"
      >
        {{ production.title }}
      </h3>
      <p 
        class="production-card__playwright text-sm mt-1 font-medium"
        :class="view_type === 'light' ? 'text-stage-700' : 'text-stage-200'"
      >
        by {{ production.playwright }}
      </p>
      <p 
        v-if="production.tagline" 
        class="production-card__tagline text-sm mt-2 line-clamp-2 leading-relaxed"
        :class="view_type === 'light' ? 'text-stage-600' : 'text-stage-300'"
      >
        {{ production.tagline }}
      </p>
      <p 
        v-if="dateRange" 
        class="production-card__date-range text-xs mt-3 font-bold"
        :class="view_type === 'light' ? 'text-brand-700' : 'text-brand-300'"
      >
        {{ dateRange }}
      </p>
    </div>
  </NuxtLink>
</template>
