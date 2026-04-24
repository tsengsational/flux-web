<script setup lang="ts">
import type { Group } from '@flux-theatre/shared';

useSeoMeta({
  title: 'Groups — Flux Theatre Ensemble',
  description: 'Explore our artistic groups, collectives, and community initiatives.',
});

const { client, readItems } = useDirectus();

// Fetch all published groups
const { data: groups, error } = await useAsyncData<Group[]>('all-groups', () => 
  client.request(readItems('groups', {
    filter: { status: { _eq: 'published' } },
    fields: ['*', { tags: [{ tags_id: ['name'] }] }] as any,
  })) as any
);

const allTags = computed(() => {
  const items = groups.value;
  if (!items) return [];
  const tags = new Set<string>();
  items.forEach((g: Group) => {
    g.tags?.forEach((t) => {
      const tagName = (t.tags_id as any)?.name;
      if (tagName) tags.add(tagName);
    });
  });
  return Array.from(tags).sort();
});

const activeTag = ref<string | null>(null);

const filteredGroups = computed(() => {
  const items = groups.value;
  if (!items) return [];
  if (!activeTag.value) return items;
  return items.filter((g: Group) => 
    g.tags?.some((t) => (t.tags_id as any)?.name === activeTag.value)
  );
});
</script>

<template>
  <div class="groups-page">
    <!-- Page Header -->
    <section class="groups-page__header pt-12 pb-6" id="groups-header">
      <div class="groups-page__header-container max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <p class="groups-page__subtitle text-brand-400 font-medium text-sm uppercase tracking-[0.15em] mb-2">Our Community</p>
        <h1 class="groups-page__title section-heading">Groups & Collectives</h1>
        <p class="groups-page__description mt-4 text-stage-400 text-lg max-w-2xl">
          Discover the various groups and artistic collectives that make up the Flux ecosystem.
        </p>
      </div>
    </section>

    <!-- Tag Filter -->
    <section class="groups-page__tags-section pb-8" id="groups-tags">
      <div class="groups-page__tags-container max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div class="groups-page__tags flex flex-wrap gap-2">
          <button
            class="groups-page__tag-btn px-3 py-1.5 rounded-full text-xs font-medium transition-all duration-200"
            :class="!activeTag
              ? 'bg-brand-500 text-stage-950'
              : 'bg-stage-800/60 text-stage-400 hover:text-stage-200 border border-stage-700/40'"
            @click="activeTag = null"
          >
            All Groups
          </button>
          <button
            v-for="tag in allTags"
            :key="tag"
            class="groups-page__tag-btn px-3 py-1.5 rounded-full text-xs font-medium transition-all duration-200"
            :class="activeTag === tag
              ? 'bg-brand-500 text-stage-950'
              : 'bg-stage-800/60 text-stage-400 hover:text-stage-200 border border-stage-700/40'"
            @click="activeTag = tag"
          >
            {{ tag }}
          </button>
        </div>
      </div>
    </section>

    <!-- Content -->
    <section class="groups-page__content-section pb-24" id="groups-content">
      <div class="groups-page__content-container max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <!-- Groups Grid -->
        <div v-if="filteredGroups.length > 0" class="groups-page__grid grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          <GroupCard
            v-for="group in filteredGroups"
            :key="group.id"
            :group="group"
            view_type="light"
            class="groups-page__card"
          />
        </div>

        <p v-else class="groups-page__empty-text text-center text-stage-500 py-16 text-lg">
          No groups match the selected tag.
        </p>
      </div>
    </section>
  </div>
</template>
