<script setup lang="ts">
import type { Group } from '@flux-theatre/shared';

interface Props {
  group: Group;
  view_type?: 'light' | 'dark';
}

const props = withDefaults(defineProps<Props>(), {
  view_type: 'light'
});

const { getAssetUrl } = useDirectus();
</script>

<template>
  <NuxtLink
    :to="`/groups/${group.slug}`"
    class="group-card card-glass group block overflow-hidden h-full"
    :id="`group-card-${group.slug}`"
  >
    <!-- Hero image -->
    <div class="group-card__image-container relative aspect-[16/9] bg-stage-800 overflow-hidden">
      <img
        v-if="group.hero_image"
        :src="getAssetUrl(group.hero_image)!"
        :alt="group.title"
        class="group-card__image w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
        loading="lazy"
      />
      <div v-else class="group-card__placeholder w-full h-full flex items-center justify-center bg-gradient-to-br from-stage-800 to-stage-900">
        <svg class="group-card__placeholder-icon w-12 h-12 text-stage-700" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="1">
          <path stroke-linecap="round" stroke-linejoin="round" d="M18 18.72a9.094 9.094 0 003.741-.479 3 3 0 00-4.682-2.72m.94 3.198l.001.031c0 .225-.012.447-.037.666A11.944 11.944 0 0112 21c-2.17 0-4.207-.576-5.963-1.584A6.062 6.062 0 016 18.719m12 0a5.971 5.971 0 00-.941-3.197m0 0A5.995 5.995 0 0012 12.75a5.995 5.995 0 00-5.058 2.772m0 0a5.97 5.97 0 00-.94 3.197M15 6.75a3 3 0 11-6 0 3 3 0 016 0zm6 3a2.25 2.25 0 11-4.5 0 2.25 2.25 0 014.5 0zm-13.5 0a2.25 2.25 0 11-4.5 0 2.25 2.25 0 014.5 0z" />
        </svg>
      </div>
      <div class="absolute inset-0 bg-gradient-to-t from-stage-950/60 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
    </div>

    <!-- Content -->
    <div class="group-card__content p-5 flex flex-col h-[calc(100%-aspect-ratio)]">
      <h3
        class="group-card__title text-xl font-serif font-bold group-hover:text-brand-400 transition-colors"
        :class="view_type === 'light' ? 'text-stage-950' : 'text-stage-50'"
      >
        {{ group.title }}
      </h3>
      <p
        v-if="group.subtitle"
        class="group-card__subtitle text-xs mt-1 font-semibold text-brand-500 uppercase tracking-widest"
      >
        {{ group.subtitle }}
      </p>
      
      <div v-if="group.tags && group.tags.length" class="group-card__tags mt-4 flex flex-wrap gap-1.5">
        <span
          v-for="tag in group.tags"
          :key="tag.id"
          class="group-card__tag text-[10px] px-2 py-0.5 rounded-full uppercase tracking-wider font-bold"
          :class="view_type === 'light' 
            ? 'bg-stage-100 text-stage-600 border border-stage-200' 
            : 'bg-stage-800/80 text-stage-400 border border-stage-700/40'"
        >
          {{ (tag.tags_id as any)?.name }}
        </span>
      </div>

      <div class="mt-auto pt-6 flex items-center justify-end">
        <span class="text-sm font-medium text-brand-400 group-hover:translate-x-1 transition-transform">
          Explore Group &rarr;
        </span>
      </div>
    </div>
  </NuxtLink>
</template>

<style scoped>
.group-card {
  transition: transform 0.3s ease, box-shadow 0.3s ease;
}
.group-card:hover {
  transform: translateY(-4px);
}
</style>
