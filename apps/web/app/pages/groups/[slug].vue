<script setup lang="ts">
import type { Group } from '@flux-theatre/shared';

const route = useRoute();
const slug = route.params.slug as string;
const { client, readItems, getAssetUrl } = useDirectus();

// Fetch the group details
const { data: groupData, error } = await useAsyncData(`group-${slug}`, () => 
  client.request(readItems('groups', {
    filter: { slug: { _eq: slug }, status: { _eq: 'published' } },
    fields: ['*', 'tag_label', { tags: [{ tags_id: ['id', 'name'] }] }] as any,
    limit: 1
  })) as any
);

const group = computed(() => groupData.value?.[0] as Group | null);

// Handle 404
if (!group.value && !error.value) {
  // Nuxt 3 error handling in setup
}

const tagIds = computed(() => {
  if (!group.value?.tags) return [];
  return group.value.tags.map((t: any) => t.tags_id?.id).filter(Boolean);
});

const pageSize = 16;
const currentPage = ref(1);
const allDocuments = ref<any[]>([]);
const hasMore = ref(true);
const isLoadingMore = ref(false);

// Helper to fetch a specific page of related documents
const fetchDocuments = async (page: number) => {
  const ids = tagIds.value;
  if (!ids || ids.length === 0) return [];

  const offset = (page - 1) * pageSize;

  // Parallel fetch for collections that support tags (Events, Blog Posts, and People)
  const [events, posts, people] = await Promise.all([
    client.request(readItems('events', {
      filter: {
        status: { _eq: 'published' },
        tags: { tags_id: { id: { _in: ids } } }
      },
      fields: ['*', { tags: [{ tags_id: ['name'] }] }, { venue: ['name'] }] as any,
      limit: pageSize,
      offset
    })).catch(() => []),
    client.request(readItems('posts', {
      filter: {
        status: { _eq: 'published' },
        tags: { tags_id: { id: { _in: ids } } }
      },
      fields: ['*', { tags: [{ tags_id: ['name'] }] }, { author: ['first_name', 'last_name'] }] as any,
      limit: pageSize,
      offset
    })).catch(() => []),
    client.request(readItems('people', {
      filter: {
        status: { _eq: 'published' },
        tags: { tags_id: { id: { _in: ids } } }
      },
      fields: ['*', { tags: [{ tags_id: ['name'] }] }] as any,
      limit: 24,
      offset: (page - 1) * 24
    })).catch(() => [])
  ]);

  const newItems = [
    ...(events as any[]).map(e => ({ type: 'event', data: e })),
    ...(posts as any[]).map(p => ({ type: 'post', data: p })),
    ...(people as any[]).map(p => ({ type: 'person', data: p }))
  ];

  // If any collection returned its full set, there might be more items
  hasMore.value = events.length === pageSize || posts.length === pageSize || people.length === 24;


  return newItems;
};

// Initial fetch
const { data: initialDocs } = await useAsyncData(`group-docs-${slug}`, async () => {
  return await fetchDocuments(1);
}, { watch: [tagIds] });

// Initialize allDocuments with the data from useAsyncData (works on both server and client)
if (initialDocs.value) {
  allDocuments.value = [...initialDocs.value];
}

// Watch for changes in initialDocs (e.g. when tagIds change) to update the list
watch(initialDocs, (newItems) => {
  if (newItems) {
    allDocuments.value = [...newItems];
    currentPage.value = 1; // Reset pagination
  }
});

const loadMore = async () => {
  if (isLoadingMore.value || !hasMore.value) return;
  
  isLoadingMore.value = true;
  currentPage.value++;
  
  const nextItems = await fetchDocuments(currentPage.value);
  allDocuments.value = [...allDocuments.value, ...nextItems];
  isLoadingMore.value = false;
};

// Unified sorted list of all fetched documents
const sortedDocuments = computed(() => {
  if (!allDocuments.value) return [];
  return [...allDocuments.value].sort((a, b) => {
    const dateA = a.data.start_datetime || a.data.publish_date || a.data.date_created || '';
    const dateB = b.data.start_datetime || b.data.publish_date || b.data.date_created || '';
    return new Date(dateB).getTime() - new Date(dateA).getTime();
  });
});




useSeoMeta({
  title: () => `${group.value?.title || 'Group'} — Flux Theatre Ensemble`,
  description: () => group.value?.subtitle || '',
});
</script>

<template>
  <div v-if="group" class="group-page">
    <!-- Hero Section -->
    <header class="group-page__hero relative h-[50vh] min-h-[400px] flex items-end pb-16 overflow-hidden">
      <!-- Background Image -->
      <img
        v-if="group.hero_image"
        :src="getAssetUrl(group.hero_image)!"
        class="absolute inset-0 w-full h-full object-cover"
        alt=""
      />
      <div v-else class="absolute inset-0 bg-gradient-to-br from-stage-900 to-stage-950" />
      
      <!-- Overlays -->
      <div class="absolute inset-0 bg-gradient-to-t from-stage-950 via-stage-950/60 to-transparent" />
      <div class="absolute inset-0 bg-stage-950/20" />

      <div class="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full">
        <NuxtLink to="/groups" class="text-xs text-brand-400 hover:text-brand-300 transition-colors mb-6 inline-flex items-center gap-2 group/back">
          <span class="group-hover/back:-translate-x-1 transition-transform">&larr;</span> Back to Groups
        </NuxtLink>
        
        <div class="max-w-4xl">
          <p v-if="group.subtitle" class="text-brand-400 font-medium text-lg mb-2 font-serif italic animate-fade-in">
            {{ group.subtitle }}
          </p>
          <h1 class="text-4xl sm:text-5xl lg:text-7xl font-serif font-bold text-stage-50 leading-tight tracking-tight animate-slide-up">
            {{ group.title }}
          </h1>
          
          <div v-if="group.tags && group.tags.length" class="mt-8 flex flex-wrap gap-2 animate-slide-up" style="animation-delay: 0.1s">
            <span
              v-for="tag in group.tags"
              :key="tag.id"
              class="text-xs px-4 py-1.5 rounded-full bg-brand-500 text-stage-950 font-bold uppercase tracking-wider shadow-lg"
            >
              {{ (tag.tags_id as any)?.name }}
            </span>
          </div>
        </div>
      </div>
    </header>

    <!-- Main Content Section -->
    <section class="group-page__content py-24 bg-stage-950">
      <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div class="max-w-4xl mx-auto">
          <!-- Description -->
          <div class="prose prose-invert prose-lg max-w-none text-stage-100">
            <BlockRenderer :content="group.content" />
          </div>
        </div>
      </div>
    </section>


    <!-- Related Documents Section -->
    <section class="group-page__documents py-24 bg-stage-900/20 border-t border-stage-800/40" id="related-content">
      <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div class="flex flex-col md:flex-row md:items-end justify-between mb-16 gap-4">
          <div>
            <h2 class="text-3xl sm:text-4xl font-serif font-bold text-stage-50">{{ group.tag_label || 'Related Documents' }}</h2>

            <div class="h-1 w-20 bg-brand-500 mt-4 rounded-full" />
          </div>
        </div>

        <div v-if="sortedDocuments.length > 0" class="group-page__documents-grid-wrapper">
          <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            <template v-for="doc in sortedDocuments" :key="`${doc.type}-${doc.data.id}`">
              <EventCard v-if="doc.type === 'event'" :event="{ ...doc.data, view_type: 'dark' }" />
              <BlogPostCard v-else-if="doc.type === 'post'" :post="doc.data" view_type="dark" />
              <PersonCard v-else-if="doc.type === 'person'" :person="doc.data" />
            </template>
          </div>

          <!-- Pagination / Load More -->
          <div v-if="hasMore" class="mt-16 flex justify-center">
            <button 
              @click="loadMore" 
              class="btn-secondary group/more px-8 py-3 text-brand-500 flex items-center gap-3"
              :disabled="isLoadingMore"
            >
              <span v-if="isLoadingMore" class="animate-spin h-4 w-4 border-2 text-brand-500 border-brand-500 border-t-transparent rounded-full" />
              {{ isLoadingMore ? 'Loading...' : 'Show More' }}
              <svg v-if="!isLoadingMore" class="w-4 h-4 transition-transform group-hover/more:translate-y-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 9l-7 7-7-7" />
              </svg>
            </button>
          </div>
        </div>


        
        <div v-else class="text-center py-32 card-glass rounded-3xl border border-dashed border-stage-800/60">
          <div class="max-w-xs mx-auto">
            <svg class="w-12 h-12 text-stage-700 mx-auto mb-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1" d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
            </svg>
            <p class="text-stage-500 font-medium italic">No related documents have been tagged with this group's focus areas yet.</p>
          </div>
        </div>
      </div>
    </section>
  </div>
</template>

<style scoped>
.group-page {
  @apply bg-stage-950 min-h-screen;
}

.animate-fade-in {
  animation: fadeIn 1s ease-out forwards;
}

.animate-slide-up {
  opacity: 0;
  transform: translateY(20px);
  animation: slideUp 0.8s ease-out forwards;
}

@keyframes fadeIn {
  from { opacity: 0; }
  to { opacity: 1; }
}

@keyframes slideUp {
  to {
    opacity: 1;
    transform: translateY(0);
  }
}
</style>
