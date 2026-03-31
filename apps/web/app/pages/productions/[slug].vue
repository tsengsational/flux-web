<script setup lang="ts">
import type { Production } from '@flux-theatre/shared';

const route = useRoute();
const slug = route.params.slug as string;
const { client, readItems, getAssetUrl } = useDirectus();

const isLightboxOpen = ref(false);

// Fetch the production from Directus based on slug
const { data: productions, error } = await useAsyncData<Production[]>(`production-${slug}`, () => 
  client.request(readItems('productions' as any, {
    filter: { slug: { _eq: slug }, status: { _eq: 'published' } },
    fields: [
      '*', 
      { 
        venue: ['name', 'city', 'maps_url'],
        showtimes: ['*'],
        Cast: ['role_name', 'content', { person: ['first_name', 'last_name', 'slug', 'headshot', 'bio', 'pronouns'] }],
        Crew: ['title', 'content', { person: ['first_name', 'last_name', 'slug', 'headshot', 'bio', 'pronouns'] }]
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

// Map cast with bio override (Credit Bio > Master Bio)
const cast = computed(() => {
  return (production.value?.Cast || [])
    .filter(c => c && typeof (c.person as any) !== 'string')
    .map(c => ({
      ...c,
      person: {
        ...(c.person as any),
        // Override master bio with credit content if present
        bio: (c as any).content || (c.person as any).bio
      }
    }));
});

// Map crew with bio override
const crew = computed(() => {
  return (production.value?.Crew || [])
    .filter(c => c && typeof (c.person as any) !== 'string')
    .map(c => ({
      ...c,
      person: {
        ...(c.person as any),
        bio: (c as any).content || (c.person as any).bio
      }
    }));
});
</script>

<template>
  <div class="production-detail">
    <!-- ═══ Hero ═══ -->
    <section v-if="production" class="production-detail__hero relative pt-8 pb-16" id="production-hero">
      <div class="production-detail__hero-bg absolute inset-0 bg-black" />
      <div class="production-detail__hero-container relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div class="production-detail__hero-layout flex flex-col lg:flex-row gap-10">
          <!-- Poster -->
          <div class="production-detail__poster-wrapper lg:w-80 flex-shrink-0">
            <button 
              @click="isLightboxOpen = true"
              class="production-detail__poster-btn block w-full group relative"
              :aria-label="`View ${production.title} poster larger`"
            >
              <div class="production-detail__poster-card card-glass aspect-[3/4] overflow-hidden transition-transform duration-300 group-hover:scale-[1.02]">
                <img
                  v-if="production.poster_image"
                  :src="getAssetUrl(production.poster_image)!"
                  :alt="`${production.title} poster`"
                  class="production-detail__poster-image w-full h-full object-contain"
                />
                <div v-else class="production-detail__poster-placeholder w-full h-full flex items-center justify-center bg-gradient-to-br from-stage-800 to-stage-900">
                  <span class="production-detail__placeholder-text text-stage-600 font-serif text-8xl">F</span>
                </div>
                <!-- Hover Overlay -->
                <div class="absolute inset-0 bg-brand-500/10 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                  <div class="p-2 rounded-full bg-stage-900/80 text-brand-400">
                    <svg class="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
                      <path stroke-linecap="round" stroke-linejoin="round" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0zM10 7v3m0 0v3m0-3h3m-3 0H7" />
                    </svg>
                  </div>
                </div>
              </div>
            </button>
          </div>

          <!-- Details -->
          <div class="production-detail__info flex-1 pt-2">
            <div class="production-detail__meta flex items-center gap-3 mb-4">
              <span class="production-detail__season px-3 py-1 rounded-full text-xs font-semibold bg-brand-500/90 text-stage-950">
                {{ production.season }}
              </span>
              <NuxtLink to="/productions" class="production-detail__back-link text-xs text-stage-400 hover:text-brand-400 transition-colors">
                &larr; All Productions
              </NuxtLink>
            </div>
            <h1 class="production-detail__title text-4xl sm:text-5xl lg:text-6xl font-serif font-bold text-stage-50 tracking-tight leading-[1.1]">
              {{ production.title }}
            </h1>
            <p class="production-detail__tagline text-xl text-stage-300 mt-3 font-serif italic">
              {{ production.tagline }}
            </p>
            <p class="production-detail__creators text-stage-400 mt-4">
              by <span class="production-detail__creator-name text-stage-200 font-medium">{{ production.playwright }}</span>
              <template v-if="production.director">
                &nbsp;·&nbsp; directed by <span class="production-detail__creator-name text-stage-200 font-medium">{{ production.director }}</span>
              </template>
            </p>

            <!-- Venue & Dates -->
            <div class="production-detail__location mt-6 flex flex-wrap gap-4 text-sm">
              <div v-if="typeof production.venue === 'object'" class="production-detail__venue flex items-center gap-2 text-stage-300">
                <svg class="production-detail__location-icon w-4 h-4 text-brand-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="1.5">
                  <path stroke-linecap="round" stroke-linejoin="round" d="M15 10.5a3 3 0 11-6 0 3 3 0 016 0z" />
                  <path stroke-linecap="round" stroke-linejoin="round" d="M19.5 10.5c0 7.142-7.5 11.25-7.5 11.25S4.5 17.642 4.5 10.5a7.5 7.5 0 1115 0z" />
                </svg>
                <a :href="production.venue.maps_url || '#'" target="_blank" class="production-detail__venue-link hover:text-brand-400 transition-colors">
                  {{ production.venue.name }}, {{ production.venue.city }}
                </a>
              </div>
            </div>

            <!-- Description -->
            <div class="production-detail__description mt-8 text-stage-300 leading-relaxed max-w-none">
              <BlockRenderer :content="production.description" />
            </div>
          </div>
        </div>
      </div>
    </section>

    <!-- ═══ Showtimes ═══ -->
    <section v-if="production && production.showtimes?.length" class="production-showtimes py-16 bg-stage-900/40" id="showtimes">
      <div class="production-showtimes__container max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <h2 class="production-showtimes__title section-heading mb-8">Showtimes & Tickets</h2>
        <div class="production-showtimes__grid grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <div
            v-for="show in production.showtimes"
            :key="show.id"
            class="production-showtimes__card card-glass p-4 flex flex-col"
          >
            <div class="production-showtimes__card-header flex items-center justify-between mb-2">
              <span class="production-showtimes__date text-stage-100 font-medium text-sm">{{ formatShowtime(show.datetime).date }}</span>
              <span v-if="show.notes" class="production-showtimes__notes text-xs px-2 py-0.5 rounded-full bg-brand-500/20 text-brand-300 font-medium">
                {{ show.notes }}
              </span>
            </div>
            <span class="production-showtimes__time text-stage-400 text-sm">{{ formatShowtime(show.datetime).time }}</span>
            <div class="production-showtimes__card-footer mt-auto pt-3">
              <a
                v-if="!show.is_sold_out"
                :href="show.ticket_url || '#'"
                class="production-showtimes__ticket-btn btn-primary w-full text-center text-xs py-2"
              >
                Get Tickets
              </a>
              <span v-else class="production-showtimes__sold-out block text-center text-xs py-2 px-4 rounded-lg bg-stage-800 text-stage-500 font-medium">
                Sold Out
              </span>
            </div>
          </div>
        </div>
      </div>
    </section>

    <!-- ═══ Cast ═══ -->
    <section class="production-cast py-16" id="cast-section">
      <div class="production-cast__container max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <h2 class="production-cast__title section-heading mb-8">Cast</h2>
        <div class="production-cast__grid grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4">
          <PersonCard
            v-for="credit in cast"
            :key="credit.person.slug"
            :person="credit.person"
            :role="credit.role_name"
            class="production-cast__person-card"
            compact
          />
        </div>
      </div>
    </section>

    <!-- ═══ Creative Team ═══ -->
    <section class="production-crew py-16 bg-stage-900/40" id="crew-section">
      <div class="production-crew__container max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <h2 class="production-crew__title section-heading mb-8">Creative Team</h2>
        <div class="production-crew__grid grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4">
          <PersonCard
            v-for="credit in crew"
            :key="credit.person.slug"
            :person="credit.person"
            :role="credit.title"
            class="production-crew__person-card"
            compact
          />
        </div>
      </div>
    </section>
    <!-- ═══ Lightbox ═══ -->
    <Teleport to="body">
      <Transition
        enter-active-class="transition-all duration-300 ease-out"
        enter-from-class="opacity-0"
        enter-to-class="opacity-100"
        leave-active-class="transition-all duration-200 ease-in"
        leave-from-class="opacity-100"
        leave-to-class="opacity-0"
      >
        <div 
          v-if="isLightboxOpen" 
          class="fixed inset-0 z-[200] flex items-center justify-center p-4 md:p-12"
          @click="isLightboxOpen = false"
        >
          <div class="absolute inset-0 bg-black/95 backdrop-blur-md" />
          
          <button 
            class="absolute top-6 right-6 text-stage-400 hover:text-white transition-colors z-[210] p-2 bg-stage-900/50 rounded-full"
            @click="isLightboxOpen = false"
          >
            <svg class="w-8 h-8" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2.5">
              <path stroke-linecap="round" stroke-linejoin="round" d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>

          <div class="relative max-w-full max-h-full flex items-center justify-center z-[205]">
            <img 
              v-if="production.poster_image"
              :src="getAssetUrl(production.poster_image)!" 
              :alt="production.title"
              class="max-w-full max-h-[90vh] object-contain shadow-2xl animate-scale-in"
              @click.stop
            />
          </div>
        </div>
      </Transition>
    </Teleport>
  </div>
</template>
