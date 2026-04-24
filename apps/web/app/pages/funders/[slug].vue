<script setup lang="ts">
import type { Funder } from '@flux-theatre/shared';

const route = useRoute();
const slug = route.params.slug as string;
const { client, readItems, getAssetUrl } = useDirectus();

// Fetch the funder and their associated items
const { data: funderRecord, error } = await useAsyncData(`funder-${slug}`, async () => {
  const f = await client.request(readItems('funder' as any, {
    filter: { slug: { _eq: slug } },
    fields: [
      '*',
      { 
        productions: ['*', { production_id: ['title', 'slug', 'season', 'poster_image'] }],
        events: ['*', { event_id: ['title', 'slug', 'start_datetime', 'cover_image'] }],
        pages: ['*', { page_id: ['title', 'slug'] }]
      }
    ] as any,
    limit: 1
  } as any)) as any[];
  
  if (!f.length) return null;
  const funder = f[0] as any;

  return {
    ...funder,
    productionsData: (funder.productions || []).map((p: any) => p.production_id).filter(Boolean),
    eventsData: (funder.events || []).map((e: any) => e.event_id).filter(Boolean),
    pagesData: (funder.pages || []).map((p: any) => p.page_id).filter(Boolean)
  };
});

if (error.value) {
  throw createError({ 
    statusCode: 500, 
    statusMessage: `Failed to fetch funder data: ${error.value.message || 'Unknown error'}` 
  });
}

if (!funderRecord.value) {
  throw createError({ statusCode: 404, statusMessage: 'Funder not found' });
}

useSeoMeta({
  title: () => `${funderRecord.value?.name} — Flux Theatre Ensemble`,
  description: () => funderRecord.value?.name || '',
});

const hasAnyConnections = computed(() => {
  return (funderRecord.value?.productionsData?.length || 0) > 0 || 
         (funderRecord.value?.eventsData?.length || 0) > 0 ||
         (funderRecord.value?.pagesData?.length || 0) > 0;
});
</script>

<template>
  <div v-if="funderRecord" class="funder-page pb-24">
    <!-- Header Section -->
    <section class="funder-page__hero pt-16 pb-12 bg-stage-950 border-b border-stage-800/30" id="funder-hero">
      <div class="funder-page__hero-container max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
        <div class="funder-page__layout flex flex-col md:flex-row gap-8 lg:gap-12 items-center md:items-start">
          <!-- Logo/Image -->
          <div class="funder-page__image-col w-48 md:w-1/3 lg:w-1/4">
            <div class="funder-page__image-wrapper aspect-square rounded-2xl overflow-hidden border border-stage-700/50 shadow-2xl bg-white p-6 flex items-center justify-center">
              <img
                v-if="funderRecord.image"
                :src="getAssetUrl(funderRecord.image)!"
                :alt="funderRecord.name"
                class="funder-page__image w-full h-full object-contain"
              />
              <div v-else class="funder-page__image-placeholder w-full h-full flex items-center justify-center text-stage-200">
                <span class="text-4xl font-serif font-bold text-stage-600">{{ funderRecord.name.charAt(0) }}</span>
              </div>
            </div>
          </div>

          <!-- Info -->
          <div class="funder-page__info-col flex-1 text-center md:text-left">
            <div class="funder-page__meta mb-4">
              <a
                v-if="funderRecord.url"
                :href="funderRecord.url"
                target="_blank"
                class="funder-page__website text-xs font-bold uppercase tracking-widest text-brand-400 hover:text-brand-300 transition-colors flex items-center justify-center md:justify-start gap-1"
              >
                Visit Website
                <svg class="w-3 h-3" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
                  <path stroke-linecap="round" stroke-linejoin="round" d="M13.5 6H5.25A2.25 2.25 0 003 8.25v10.5A2.25 2.25 0 005.25 21h10.5A2.25 2.25 0 0018 18.75V10.5M13.5 6L21 3m0 0h-5.25M21 3v5.25" />
                </svg>
              </a>
            </div>

            <h1 class="funder-page__name text-4xl sm:text-5xl font-serif font-bold text-stage-50 mb-6">
              {{ funderRecord.name }}
            </h1>

            <div v-if="funderRecord.description" class="funder-page__description prose prose-invert prose-lg max-w-none text-stage-300">
              <BlockRenderer :content="funderRecord.description" />
            </div>
          </div>
        </div>
      </div>
    </section>

    <!-- Supported Work Section -->
    <section v-if="hasAnyConnections" class="funder-page__connections py-20" id="funder-connections">
      <div class="funder-page__connections-container max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
        <h2 class="funder-page__section-title text-2xl font-serif font-bold text-stage-100 mb-10 pb-4 border-b border-stage-800">
          Supported Work & Initiatives
        </h2>

        <div class="funder-page__connections-grid grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          <!-- Productions -->
          <div v-if="funderRecord.productionsData.length" class="funder-page__group lg:col-span-1">
            <h3 class="funder-page__group-title text-xs font-bold uppercase tracking-[0.2em] text-stage-500 mb-6">
              Productions
            </h3>
            <ul class="space-y-4">
              <li v-for="prod in funderRecord.productionsData" :key="prod.slug">
                <NuxtLink :to="`/productions/${prod.slug}`" class="flex items-center gap-4 group">
                  <div class="w-12 h-16 bg-stage-800 rounded overflow-hidden flex-shrink-0">
                    <img v-if="prod.poster_image" :src="getAssetUrl(prod.poster_image)!" class="w-full h-full object-cover" />
                  </div>
                  <div>
                    <p class="text-sm font-bold text-stage-100 group-hover:text-brand-400 transition-colors">{{ prod.title }}</p>
                    <p class="text-xs text-stage-500">{{ prod.season }}</p>
                  </div>
                </NuxtLink>
              </li>
            </ul>
          </div>

          <!-- Events -->
          <div v-if="funderRecord.eventsData.length" class="funder-page__group lg:col-span-1">
            <h3 class="funder-page__group-title text-xs font-bold uppercase tracking-[0.2em] text-stage-500 mb-6">
              Events
            </h3>
            <ul class="space-y-4">
              <li v-for="event in funderRecord.eventsData" :key="event.slug">
                <NuxtLink :to="`/events/${event.slug}`" class="flex items-center gap-4 group">
                  <div class="w-12 h-12 bg-stage-800 rounded overflow-hidden flex-shrink-0">
                    <img v-if="event.cover_image" :src="getAssetUrl(event.cover_image)!" class="w-full h-full object-cover" />
                  </div>
                  <div>
                    <p class="text-sm font-bold text-stage-100 group-hover:text-brand-400 transition-colors">{{ event.title }}</p>
                    <p class="text-xs text-stage-500">{{ new Date(event.start_datetime).getFullYear() }}</p>
                  </div>
                </NuxtLink>
              </li>
            </ul>
          </div>

          <!-- Pages -->
          <div v-if="funderRecord.pagesData.length" class="funder-page__group lg:col-span-1">
            <h3 class="funder-page__group-title text-xs font-bold uppercase tracking-[0.2em] text-stage-500 mb-6">
              Programs & Initiatives
            </h3>
            <ul class="space-y-4">
              <li v-for="page in funderRecord.pagesData" :key="page.slug">
                <NuxtLink :to="`/${page.slug}`" class="block p-3 rounded-lg border border-stage-800 hover:border-brand-500/50 hover:bg-brand-500/5 transition-all group">
                  <p class="text-sm font-bold text-stage-100 group-hover:text-brand-400 transition-colors">{{ page.title }}</p>
                </NuxtLink>
              </li>
            </ul>
          </div>
        </div>
      </div>
    </section>

    <!-- Support CTA -->
    <section class="funder-page__cta py-20 border-t border-stage-800/40">
      <div class="max-w-3xl mx-auto px-4 text-center">
        <h2 class="text-2xl font-serif font-bold text-stage-900 mb-4">Support Collective Care</h2>
        <p class="text-stage-400 mb-8 leading-relaxed">
          Flux Theatre Ensemble is profoundly grateful for our institutional funders. 
          Your support ensures we can continue to produce transformative, artist-centered work.
        </p>
        <NuxtLink to="/donate" class="btn-primary text-brand-400">Donate to Flux</NuxtLink>
      </div>
    </section>
  </div>
</template>

<style scoped>
.funder-page__image-wrapper {
  transition: transform 0.3s ease;
}
.funder-page__image-wrapper:hover {
  transform: scale(1.02);
}
</style>
