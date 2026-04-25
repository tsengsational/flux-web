<script setup lang="ts">
import type { Page, Person } from '@flux-theatre/shared';

const route = useRoute();
const { client, readItems } = useDirectus();

const slugParam = route.params.slug;
const slug = Array.isArray(slugParam) ? slugParam.join('/') : slugParam;

// Fetch the page content with fallback support
const { data: pages, error } = await useAsyncData<Page[]>(`page-${slug}`, async () => {
  const result = await client.request(readItems('pages', {
    filter: { slug: { _eq: slug }, status: { _eq: 'published' } },
    fields: [
      '*', 
      'content', 
      { 
        funders: ['*', { funder_id: ['name', 'slug', 'image', 'url'] }], 
        gallery: [{ directus_files_id: ['id'] }],
        people: ['sort', { people_id: ['first_name', 'last_name', 'slug', 'headshot', 'bio', 'pronouns'] }]
      }
    ] as any,
    limit: 1
  })) as any;
  
  return result;
});

const page = computed(() => pages.value?.[0] || null);

if (!page.value && !error.value) {
  // If it's a request for a system file (like a source map), don't throw a fatal error
  const isSystemFile = slug.includes('.') || slug.includes('_nuxt');
  
  if (!isSystemFile) {
    throw createError({ statusCode: 404, statusMessage: `Page "${slug}" not found in Directus`, fatal: true });
  }
}

const { getAssetUrl } = useDirectus();

const people = computed(() => {
  return (page.value?.people || [])
    .filter(p => p && typeof (p.people_id as any) !== 'string')
    .sort((a, b) => (a.sort || 0) - (b.sort || 0))
    .map(p => p.people_id as unknown as Person);
});

const funders = computed(() => {
  return (page.value?.funders || [])
    .map((f: any) => f.funder_id)
    .filter(Boolean);
});

const galleryIds = computed(() => {
  const rawGallery = page.value?.gallery;
  if (!rawGallery || !Array.isArray(rawGallery)) return [];
  
  return rawGallery.map((item: any) => {
    const id = item.directus_files_id?.id || item.directus_files_id;
    return typeof id === 'string' ? id : null;
  }).filter(Boolean) as string[];
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

      <!-- People Section -->
      <section v-if="people.length" class="page-detail__people mt-24 pt-12 border-t border-stage-200">
        <h2 class="text-xl font-serif font-bold text-stage-950 mb-8 text-center uppercase tracking-widest">
          {{ page.people_label || 'People' }}
        </h2>
        <div class="grid grid-cols-2 sm:grid-cols-3 gap-6">
          <PersonCard
            v-for="person in people"
            :key="person.slug"
            :person="person"
            compact
          />
        </div>
      </section>

      <!-- Media Gallery -->
      <div v-if="galleryIds.length > 0" class="page-detail__gallery mt-24">
        <MediaGallery :images="galleryIds" title="Gallery" viewtype="light" />
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
