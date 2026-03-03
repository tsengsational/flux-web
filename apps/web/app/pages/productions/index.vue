<script setup lang="ts">
useSeoMeta({
  title: 'Productions — Flux Theatre Ensemble',
  description: 'Browse current and past productions from Flux Theatre Ensemble in New York City.',
});

const allProductions = [
  {
    title: 'The Tempest Reimagined',
    slug: 'the-tempest-reimagined',
    tagline: 'A storm is coming. So is the reckoning.',
    poster_image: null,
    season: '2025–2026',
    playwright: 'William Shakespeare',
    opening_date: '2026-04-10',
    closing_date: '2026-05-02',
  },
  {
    title: 'Neon Wilderness',
    slug: 'neon-wilderness',
    tagline: 'Where does the city end and the self begin?',
    poster_image: null,
    season: '2025–2026',
    playwright: 'Aria Chen',
    opening_date: '2026-06-05',
    closing_date: '2026-06-28',
  },
  {
    title: 'After the Applause',
    slug: 'after-the-applause',
    tagline: 'The show must go on — but should it?',
    poster_image: null,
    season: '2025–2026',
    playwright: 'Marcus Hall',
    opening_date: '2026-09-11',
    closing_date: '2026-10-04',
  },
  {
    title: 'Glass Menagerie: Unboxed',
    slug: 'glass-menagerie-unboxed',
    tagline: 'Memory is a living thing.',
    poster_image: null,
    season: '2024–2025',
    playwright: 'Tennessee Williams',
    opening_date: '2025-03-14',
    closing_date: '2025-04-05',
  },
  {
    title: 'Signal Fire',
    slug: 'signal-fire',
    tagline: 'A new play about old wounds and blue flames.',
    poster_image: null,
    season: '2024–2025',
    playwright: 'Jasmine Torres',
    opening_date: '2025-06-20',
    closing_date: '2025-07-12',
  },
  {
    title: 'The Cherry Orchard: Redux',
    slug: 'cherry-orchard-redux',
    tagline: 'What do we lose when the trees come down?',
    poster_image: null,
    season: '2024–2025',
    playwright: 'Anton Chekhov',
    opening_date: '2025-10-03',
    closing_date: '2025-10-25',
  },
];

type FilterOption = 'all' | 'current' | 'past';
const activeFilter = ref<FilterOption>('all');

const filteredProductions = computed(() => {
  const now = new Date();
  if (activeFilter.value === 'current') {
    return allProductions.filter(p => !p.closing_date || new Date(p.closing_date) >= now);
  }
  if (activeFilter.value === 'past') {
    return allProductions.filter(p => p.closing_date && new Date(p.closing_date) < now);
  }
  return allProductions;
});

const filters: { label: string; value: FilterOption }[] = [
  { label: 'All', value: 'all' },
  { label: 'Current & Upcoming', value: 'current' },
  { label: 'Past Seasons', value: 'past' },
];
</script>

<template>
  <div>
    <!-- Page Header -->
    <section class="pt-12 pb-8" id="productions-header">
      <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <p class="text-brand-400 font-medium text-sm uppercase tracking-[0.15em] mb-2">Our Work</p>
        <h1 class="section-heading">Productions</h1>
        <p class="mt-4 text-stage-400 text-lg max-w-2xl">
          From world premieres to reimagined classics — explore the bold, adventurous work of Flux Theatre Ensemble.
        </p>
      </div>
    </section>

    <!-- Filter Tabs -->
    <section class="pb-8" id="production-filters">
      <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div class="flex gap-2 border-b border-stage-800/60 pb-px">
          <button
            v-for="f in filters"
            :key="f.value"
            class="px-4 py-2.5 text-sm font-medium rounded-t-lg transition-all duration-200"
            :class="activeFilter === f.value
              ? 'text-brand-400 bg-stage-800/50 border-b-2 border-brand-400 -mb-px'
              : 'text-stage-400 hover:text-stage-200 hover:bg-stage-800/30'"
            @click="activeFilter = f.value"
          >
            {{ f.label }}
          </button>
        </div>
      </div>
    </section>

    <!-- Productions Grid -->
    <section class="pb-24" id="productions-grid">
      <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <TransitionGroup
          tag="div"
          class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6"
          enter-active-class="transition-all duration-300 ease-out"
          enter-from-class="opacity-0 scale-95"
          enter-to-class="opacity-100 scale-100"
          leave-active-class="transition-all duration-200 ease-in"
          leave-from-class="opacity-100 scale-100"
          leave-to-class="opacity-0 scale-95"
        >
          <ProductionCard
            v-for="prod in filteredProductions"
            :key="prod.slug"
            :production="prod"
          />
        </TransitionGroup>

        <p v-if="filteredProductions.length === 0" class="text-center text-stage-500 py-16 text-lg">
          No productions match the current filter.
        </p>
      </div>
    </section>
  </div>
</template>
