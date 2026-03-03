<script setup lang="ts">
const route = useRoute();
const slug = route.params.slug as string;

// In production: const { data } = await useFetch(`/api/productions/${slug}`)
// Placeholder data for scaffolding:

const production = {
  title: 'The Tempest Reimagined',
  slug: 'the-tempest-reimagined',
  tagline: 'A storm is coming. So is the reckoning.',
  description: `
    <p>In this daring reimagination of Shakespeare's final masterpiece, Flux Theatre Ensemble 
    strips <em>The Tempest</em> down to its elemental core and rebuilds it as a meditation on 
    power, forgiveness, and the stories we tell to survive.</p>
    <p>Set on a fractured island that exists somewhere between memory and dream, this production 
    uses live music, movement, and immersive staging to place the audience inside Prospero's storm.</p>
  `,
  playwright: 'William Shakespeare',
  director: 'Elena Vasquez',
  poster_image: null,
  gallery: [],
  season: '2025–2026',
  opening_date: '2026-04-10',
  closing_date: '2026-05-02',
  venue: {
    name: 'The 4th Street Theatre',
    address: '83 East 4th Street',
    city: 'New York',
    state: 'NY',
    maps_url: '#',
  },
  showtimes: [
    { id: '1', datetime: '2026-04-10T20:00:00', ticket_url: '#', is_sold_out: false, notes: 'Opening Night' },
    { id: '2', datetime: '2026-04-11T20:00:00', ticket_url: '#', is_sold_out: false, notes: null },
    { id: '3', datetime: '2026-04-12T14:00:00', ticket_url: '#', is_sold_out: false, notes: 'Matinee' },
    { id: '4', datetime: '2026-04-12T20:00:00', ticket_url: '#', is_sold_out: true, notes: null },
    { id: '5', datetime: '2026-04-17T20:00:00', ticket_url: '#', is_sold_out: false, notes: 'Pay-What-You-Can' },
    { id: '6', datetime: '2026-04-18T20:00:00', ticket_url: '#', is_sold_out: false, notes: null },
    { id: '7', datetime: '2026-04-24T20:00:00', ticket_url: '#', is_sold_out: false, notes: null },
    { id: '8', datetime: '2026-05-02T20:00:00', ticket_url: '#', is_sold_out: false, notes: 'Closing Night' },
  ],
  cast: [
    { person: { first_name: 'Jordan', last_name: 'Blake', slug: 'jordan-blake', headshot: null, bio: '<p>Jordan is a NYC-based actor and teaching artist. Previous credits include <em>Hamlet</em> (Shakespeare in the Park), <em>Sweat</em> (Public Theater).</p>', pronouns: 'they/them' }, role_name: 'Prospero' },
    { person: { first_name: 'Miriam', last_name: 'Ortega', slug: 'miriam-ortega', headshot: null, bio: '<p>Miriam recently appeared in <em>In the Heights</em> (national tour) and <em>The Clean House</em> (Atlantic Theater).</p>', pronouns: 'she/her' }, role_name: 'Ariel' },
    { person: { first_name: 'David', last_name: 'Kim', slug: 'david-kim', headshot: null, bio: null, pronouns: 'he/him' }, role_name: 'Caliban' },
    { person: { first_name: 'Sasha', last_name: 'Williams', slug: 'sasha-williams', headshot: null, bio: '<p>Sasha is a founding member of Flux Theatre Ensemble.</p>', pronouns: 'she/her' }, role_name: 'Miranda' },
  ],
  crew: [
    { title: 'Director', person: { first_name: 'Elena', last_name: 'Vasquez', slug: 'elena-vasquez', headshot: null, bio: null, pronouns: 'she/her' } },
    { title: 'Stage Manager', person: { first_name: 'Chris', last_name: 'Tanaka', slug: 'chris-tanaka', headshot: null, bio: null, pronouns: 'he/they' } },
    { title: 'Scenic Designer', person: { first_name: 'Nora', last_name: 'Brennan', slug: 'nora-brennan', headshot: null, bio: null, pronouns: 'she/her' } },
    { title: 'Lighting Designer', person: { first_name: 'Leo', last_name: 'Park', slug: 'leo-park', headshot: null, bio: null, pronouns: 'he/him' } },
  ],
  meta_title: null,
  meta_description: null,
};

useSeoMeta({
  title: `${production.title} — Flux Theatre Ensemble`,
  description: production.meta_description || production.tagline || '',
});

function formatShowtime(iso: string) {
  const d = new Date(iso);
  return {
    date: d.toLocaleDateString('en-US', { weekday: 'short', month: 'short', day: 'numeric' }),
    time: d.toLocaleTimeString('en-US', { hour: 'numeric', minute: '2-digit' }),
  };
}
</script>

<template>
  <div>
    <!-- ═══ Hero ═══ -->
    <section class="relative pt-8 pb-16" id="production-hero">
      <div class="absolute inset-0 bg-gradient-to-b from-curtain-700/10 via-stage-950 to-stage-950" />
      <div class="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div class="flex flex-col lg:flex-row gap-10">
          <!-- Poster -->
          <div class="lg:w-80 flex-shrink-0">
            <div class="card-glass aspect-[3/4] overflow-hidden">
              <img
                v-if="production.poster_image"
                :src="production.poster_image"
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
    <section class="py-16 bg-stage-900/40" id="showtimes">
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
            v-for="credit in production.cast"
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
            v-for="credit in production.crew"
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
