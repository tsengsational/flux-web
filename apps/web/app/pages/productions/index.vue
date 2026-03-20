<script setup lang="ts">
import type { Production } from '@flux-theatre/shared';

useSeoMeta({
  title: 'Productions — Flux Theatre Ensemble',
  description: 'Browse current and past productions from Flux Theatre Ensemble in New York City.',
});

const { client, readItems } = useDirectus();

// Fetch all published productions
const { data: allProductions } = await useAsyncData<Production[]>('all-productions', () => 
  client.request(readItems('productions', {
    filter: { status: { _eq: 'published' } },
    sort: ['-opening_date'],
  }))
);

type FilterOption = 'all' | 'current' | 'past';
const activeFilter = ref<FilterOption>('all');

const filteredProductions = computed(() => {
  if (!allProductions.value) return [];
  const now = new Date();
  if (activeFilter.value === 'current') {
    return allProductions.value.filter(p => !p.closing_date || new Date(p.closing_date) >= now);
  }
  if (activeFilter.value === 'past') {
    return allProductions.value.filter(p => p.closing_date && new Date(p.closing_date) < now);
  }
  return allProductions.value;
});

const filters: { label: string; value: FilterOption }[] = [
  { label: 'All', value: 'all' },
  { label: 'Current & Upcoming', value: 'current' },
  { label: 'Past Seasons', value: 'past' },
];
</script>

<template>
  <div class="productions-page">
    <!-- Page Header -->
    <section class="productions-page__header pt-12 pb-8" id="productions-header">
      <div class="productions-page__header-container max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <p class="productions-page__subtitle text-brand-400 font-medium text-sm uppercase tracking-[0.15em] mb-2">Our Work</p>
        <h1 class="productions-page__title section-heading">Productions</h1>
        <p class="productions-page__description mt-4 text-stage-400 text-lg max-w-2xl">
          From world premieres to reimagined classics — explore the bold, adventurous work of Flux Theatre Ensemble.
        </p>
      </div>
    </section>

    <!-- Filter Tabs -->
    <section class="productions-page__filters-section pb-8" id="production-filters">
      <div class="productions-page__filters-container max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div class="productions-page__filters flex gap-2 border-b border-stage-800/60 pb-px">
          <button
            v-for="f in filters"
            :key="f.value"
            class="productions-page__filter-btn px-4 py-2.5 text-sm font-medium rounded-t-lg transition-all duration-200"
            :class="activeFilter === f.value
              ? 'productions-page__filter-btn--active text-brand-400 bg-stage-800/50 border-b-2 border-brand-400 -mb-px'
              : 'productions-page__filter-btn--inactive text-stage-400 hover:text-stage-200 hover:bg-stage-800/30'"
            @click="activeFilter = f.value"
          >
            {{ f.label }}
          </button>
        </div>
      </div>
    </section>

    <!-- Productions Grid -->
    <section class="productions-page__grid-section pb-24" id="productions-grid">
      <div class="productions-page__grid-container max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <TransitionGroup
          tag="div"
          class="productions-page__grid grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6"
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
            class="productions-page__card"
          />
        </TransitionGroup>

        <p v-if="filteredProductions.length === 0" class="productions-page__empty-text text-center text-stage-500 py-16 text-lg">
          No productions match the current filter.
        </p>
      </div>
    </section>
  </div>
</template>
