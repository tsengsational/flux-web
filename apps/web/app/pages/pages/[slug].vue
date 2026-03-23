<script setup lang="ts">
import type { Page } from '@flux-theatre/shared';

const route = useRoute();
const { client, readItems } = useDirectus();

const slug = route.params.slug as string;

// Fetch the page content with fallback support
const { data: pages, error } = await useAsyncData<Page[]>(`page-${slug}`, () => 
  client.request(readItems('pages', {
    filter: { slug: { _eq: slug }, status: { _eq: 'published' } },
    fields: ['*', 'content'] as any,
    limit: 1
  })) as any
);

const page = computed(() => pages.value?.[0] || null);

if (error.value || !page.value) {
  // If useAsyncData fails or page is not found
  if (!process.server) {
    throw createError({ statusCode: 404, statusMessage: 'Page not found' });
  }
}

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
    </div>
  </main>
</template>

<style scoped>
/* Optional: Additional spacing for headers inside the page content */
:deep(.block-renderer h2) {
  @apply mt-12 mb-6;
}
</style>
