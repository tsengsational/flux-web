<script setup lang="ts">
import type { Page } from '@flux-theatre/shared';

const route = useRoute();
const { client, readItems } = useDirectus();

const { data: page, error } = await useAsyncData(`page-${route.params.slug}`, async () => {
  try {
    const colName = 'pages';
    const response = await client.request(readItems(colName as any, {
      filter: { slug: { _eq: route.params.slug } },
      fields: ['title', 'body', 'meta_title', 'meta_description']
    } as any));
    
    if (!response || response.length === 0) {
      return null;
    }
    
    return response[0] as Page;
  } catch (err: any) {
    throw err;
  }
});

if (error.value || !page.value) {
  throw createError({ statusCode: 404, statusMessage: 'Page not found' });
}

useHead({
  title: page.value.meta_title || page.value.title,
  meta: [
    { name: 'description', content: page.value.meta_description || '' }
  ]
});
</script>

<template>
  <main v-if="page" class="page-detail min-h-screen pt-24 pb-16 bg-stage-50 text-stage-950">
    <div class="page-detail__container max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
      <h1 class="page-detail__title text-4xl sm:text-5xl font-serif font-bold text-stage-950 mb-8">
        {{ page.title }}
      </h1>
      
      <div 
        class="page-detail__content prose prose-invert prose-brand max-w-none"
        v-html="page.body"
      />
    </div>
  </main>
</template>

<style scoped>
.prose h2 {
  @apply text-2xl font-serif font-bold text-stage-100 mt-12 mb-6;
}
.prose p {
  @apply text-stage-300 leading-relaxed mb-6;
}
</style>
