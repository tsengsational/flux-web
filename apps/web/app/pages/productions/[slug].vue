<script setup lang="ts">
import type { Production } from '@flux-theatre/shared';

const route = useRoute();
const slug = route.params.slug as string;
const { client, readItems, getAssetUrl } = useDirectus();

// Fetch the production from Directus based on slug
const { data: productions, error } = await useAsyncData<Production[]>(`production-${slug}`, () => 
  client.request(readItems('productions' as any, {
    filter: { slug: { _eq: slug }, status: { _eq: 'published' } },
    fields: [
      '*', 
      { 
        venue: ['name', 'city', 'maps_url'],
        showtimes: ['*'],
        cast: ['role_name', { person: ['first_name', 'last_name', 'slug', 'headshot', 'bio', 'pronouns'] }],
        crew: ['title', { person: ['first_name', 'last_name', 'slug', 'headshot', 'bio', 'pronouns'] }]
      }
    ] as any,
    limit: 1
  } as any) as any)
);

const production = computed(() => productions.value?.[0] || null);

// Handle 404 if production not found
if (!production.value && !error.value) {
  throw createError({ statusCode: 404, statusMessage: 'Production not found' });
}

useSeoMeta({
  title: () => `${production.value?.title || 'Production'} — Flux Theatre Ensemble`,
  description: () => production.value?.meta_description || production.value?.tagline || '',
});

function formatShowtime(iso: string) {
  if (!iso) return { date: '', time: '' };
  const d = new Date(iso);
  return {
    date: d.toLocaleDateString('en-US', { weekday: 'short', month: 'short', day: 'numeric' }),
    time: d.toLocaleTimeString('en-US', { hour: 'numeric', minute: '2-digit' }),
  };
}

// Ensure cast and crew have populated person objects
const cast = computed(() => {
  return (production.value?.cast || [])
    .filter(c => c && typeof c.person !== 'string') as any[];
});

const crew = computed(() => {
  return (production.value?.crew || [])
    .filter(c => c && typeof c.person !== 'string') as any[];
});
</script>

<template>
  <div>
    <!-- ═══ Hero ═══ -->
    <section v-if="production" class="relative pt-8 pb-16" id="production-hero">
      <div class="absolute inset-0 bg-gradient-to-b from-curtain-700/10 via-stage-950 to-stage-950" />
      <div class="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div class="flex flex-col lg:flex-row gap-10">
          <!-- Poster -->
          <div class="lg:w-80 flex-shrink-0">
            <div class="card-glass aspect-[3/4] overflow-hidden">
              <img
                v-if="production.poster_image"
                :src="getAssetUrl(production.poster_image)!"
                :alt="`${production.title} poster`"
                class="w-full h-full object-cover"
              />
              <div v-else class="w-full h-full flex items-center justify-center bg-gradient-to-br from-stage-800 to-stage-900">
                <span class="text-stage-600 font-serif text-8xl">F</span>
              </div>
            </div>
          </div>

          <!-- Details -->
          <div class="flex-1 pt-2">
            <div class="flex items-center gap-3 mb-4">
              <span class="px-3 py-1 rounded-full text-xs font-semibold bg-brand-500/90 text-stage-950">
                {{ production.season }}
              </span>
              <NuxtLink to="/productions" class="text-xs text-stage-400 hover:text-brand-400 transition-colors">
                &larr; All Productions
              </NuxtLink>
            </div>
            <h1 class="text-4xl sm:text-5xl lg:text-6xl font-serif font-bold text-stage-50 tracking-tight leading-[1.1]">
              {{ production.title }}
            </h1>
            <p class="text-xl text-stage-300 mt-3 font-serif italic">
              {{ production.tagline }}
            </p>
            <p class="text-stage-400 mt-4">
              by <span class="text-stage-200 font-medium">{{ production.playwright }}</span>
              <template v-if="production.director">
                &nbsp;·&nbsp; directed by <span class="text-stage-200 font-medium">{{ production.director }}</span>
              </template>
            </p>

            <!-- Venue & Dates -->
            <div class="mt-6 flex flex-wrap gap-4 text-sm">
              <div v-if="typeof production.venue === 'object'" class="flex items-center gap-2 text-stage-300">
                <svg class="w-4 h-4 text-brand-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="1.5">
                  <path stroke-linecap="round" stroke-linejoin="round" d="M15 10.5a3 3 0 11-6 0 3 3 0 016 0z" />
                  <path stroke-linecap="round" stroke-linejoin="round" d="M19.5 10.5c0 7.142-7.5 11.25-7.5 11.25S4.5 17.642 4.5 10.5a7.5 7.5 0 1115 0z" />
                </svg>
                <a :href="production.venue.maps_url || '#'" target="_blank" class="hover:text-brand-400 transition-colors">
                  {{ production.venue.name }}, {{ production.venue.city }}
                </a>
              </div>
            </div>

            <!-- Description -->
            <div class="mt-8 text-stage-300 leading-relaxed prose prose-invert prose-lg max-w-none" v-html="production.description" />
          </div>
        </div>
      </div>
    </section>

    <!-- ═══ Showtimes ═══ -->
    <section v-if="production && production.showtimes?.length" class="py-16 bg-stage-900/40" id="showtimes">
      <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <h2 class="section-heading mb-8">Showtimes & Tickets</h2>
        <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <div
            v-for="show in production.showtimes"
            :key="show.id"
            class="card-glass p-4 flex flex-col"
          >
            <div class="flex items-center justify-between mb-2">
              <span class="text-stage-100 font-medium text-sm">{{ formatShowtime(show.datetime).date }}</span>
              <span v-if="show.notes" class="text-xs px-2 py-0.5 rounded-full bg-brand-500/20 text-brand-300 font-medium">
                {{ show.notes }}
              </span>
            </div>
            <span class="text-stage-400 text-sm">{{ formatShowtime(show.datetime).time }}</span>
            <div class="mt-auto pt-3">
              <a
                v-if="!show.is_sold_out"
                :href="show.ticket_url || '#'"
                class="btn-primary w-full text-center text-xs py-2"
              >
                Get Tickets
              </a>
              <span v-else class="block text-center text-xs py-2 px-4 rounded-lg bg-stage-800 text-stage-500 font-medium">
                Sold Out
              </span>
            </div>
          </div>
        </div>
      </div>
    </section>

    <!-- ═══ Cast ═══ -->
    <section class="py-16" id="cast-section">
      <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <h2 class="section-heading mb-8">Cast</h2>
        <div class="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4">
          <PersonCard
            v-for="credit in cast"
            :key="credit.person.slug"
            :person="credit.person"
            :role="credit.role_name"
            compact
          />
        </div>
      </div>
    </section>

    <!-- ═══ Creative Team ═══ -->
    <section class="py-16 bg-stage-900/40" id="crew-section">
      <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <h2 class="section-heading mb-8">Creative Team</h2>
        <div class="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4">
          <PersonCard
            v-for="credit in crew"
            :key="credit.person.slug"
            :person="credit.person"
            :role="credit.title"
            compact
          />
        </div>
      </div>
    </section>
  </div>
</template>
