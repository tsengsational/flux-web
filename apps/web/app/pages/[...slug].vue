<script setup lang="ts">
import type { Page } from '@flux-theatre/shared';

const route = useRoute();
const { client, readItems } = useDirectus();

const slugParam = route.params.slug;
const slug = Array.isArray(slugParam) ? slugParam.join('/') : slugParam;

// Fetch the page content with fallback support
const { data: pages, error } = await useAsyncData<Page[]>(`page-${slug}`, async () => {
  const result = await client.request(readItems('pages', {
    filter: { slug: { _eq: slug }, status: { _eq: 'published' } },
    fields: ['*', 'content', { funders: ['*', { funder_id: ['name', 'slug', 'image', 'url'] }] }] as any,
    limit: 1
  })) as any;
  
  if (process.server) {
    console.log(`[SSR Fetch] Slug: ${slug} | Found: ${Array.isArray(result) && result.length > 0}`);
  }
  
  return result;
});

const page = computed(() => pages.value?.[0] || null);

if (!page.value && !error.value) {
  // If useAsyncData fails or page is not found
  throw createError({ statusCode: 404, statusMessage: `Page "${slug}" not found in Directus`, fatal: true });
}

const { getAssetUrl } = useDirectus();
const funders = computed(() => {
  return (page.value?.funders || [])
    .map((f: any) => f.funder_id)
    .filter(Boolean);
});

useHead({
  title: page.value?.meta_title || page.value?.title || 'Page',
  meta: [
    { name: 'description', content: page.value?.meta_description || '' }
  ]
});
</script>

<template>
  <main v-if="page" class="page-detail prose-custom py-16 sm:py-24">
    <div class="page-detail__container max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
      <h1 class="page-detail__title text-4xl sm:text-5xl font-serif font-bold text-stage-950 mb-12">
        {{ page.title }}
      </h1>
      
      <div class="page-detail__content">
        <!-- Renders Block Editor content if present, fallback to HTML 'body' -->
        <BlockRenderer :content="page.content || page.body" />
      </div>
      
      <!-- Funders -->
      <div v-if="funders.length" class="page-detail__funders mt-24 pt-12 border-t border-stage-200">
        <h2 class="text-xl font-serif font-bold text-stage-950 mb-8 text-center uppercase tracking-widest">Supported By</h2>
        <div class="flex flex-wrap items-center justify-center gap-10">
          <NuxtLink
            v-for="funder in funders"
            :key="funder.slug"
            :to="`/funders/${funder.slug}`"
            class="group flex flex-col items-center gap-3 transition-transform hover:scale-105"
          >
            <div class="w-24 h-24 bg-white rounded-lg shadow-md p-4 flex items-center justify-center overflow-hidden border border-stage-200 group-hover:border-brand-500/30 transition-colors">
              <img
                v-if="funder.image"
                :src="getAssetUrl(funder.image)!"
                :alt="funder.name"
                class="w-full h-full object-contain grayscale group-hover:grayscale-0 transition-all duration-500"
              />
              <span v-else class="text-stage-900 font-serif font-bold text-sm text-center">{{ funder.name }}</span>
            </div>
          </NuxtLink>
        </div>
      </div>
    </div>
  </main>
</template>

<style scoped>
/* Optional: Additional spacing for headers inside the page content */
:deep(.block-renderer h2) {
  @apply mt-12 mb-6;
}
</style>
