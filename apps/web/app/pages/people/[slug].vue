<script setup lang="ts">
import type { Person } from '@flux-theatre/shared';

const route = useRoute();
const slug = route.params.slug as string;
const { client, readItems, getAssetUrl } = useDirectus();

// Fetch everything related to this person using separate requests for robustness
const { data: personRecord, error } = await useAsyncData(`person-full-${slug}`, async () => {
  // 1. Fetch the person (removed status filter just in case, similar to funders)
  const people = await client.request(readItems('people' as any, {
    filter: { slug: { _eq: slug } },
    limit: 1
  } as any)) as any[];
  
  if (!people.length) return null;
  const person = people[0];

  // 2. Fetch credits in parallel
  // We filter by the person's ID to get their specific credits
  const [cast, crew] = await Promise.all([
    client.request(readItems('cast_credits' as any, {
      filter: { person: { _eq: person.id } },
      fields: ['role_name', { production: ['title', 'slug', 'season', 'poster_image'] }]
    } as any)),
    client.request(readItems('crew_credits' as any, {
      filter: { person: { _eq: person.id } },
      fields: ['title', 'department', { production: ['title', 'slug', 'season', 'poster_image'] }]
    } as any))
  ]);

  return {
    ...person,
    cast: (cast || []) as any[],
    crew: (crew || []) as any[],
    posts: [] // Temporarily empty until we confirm the field name in the posts collection
  };
});

if (error.value) {
  console.error('Error fetching person data:', error.value);
  throw createError({ 
    statusCode: 500, 
    statusMessage: `Failed to fetch person data: ${error.value.message || 'Unknown error'}` 
  });
}

if (!personRecord.value) {
  throw createError({ statusCode: 404, statusMessage: 'Person not found' });
}

useSeoMeta({
  title: () => `${personRecord.value?.first_name} ${personRecord.value?.last_name} — Flux Theatre Ensemble`,
  description: () => personRecord.value?.bio?.substring(0, 160) || '',
});

const fullName = computed(() => {
  if (!personRecord.value) return '';
  return `${personRecord.value.first_name} ${personRecord.value.last_name}`;
});

const hasAnyCredits = computed(() => {
  return (personRecord.value?.cast?.length || 0) > 0 || (personRecord.value?.crew?.length || 0) > 0;
});
</script>

<template>
  <div v-if="personRecord" class="person-page pb-24">
    <!-- Header / Bio Section -->
    <section class="person-page__hero pt-16 pb-12 bg-stage-900" id="person-hero">
      <div class="person-page__hero-container max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
        <div class="person-page__layout flex flex-col md:flex-row gap-8 lg:gap-12">
          <!-- Headshot -->
          <div class="person-page__image-col w-full md:w-1/3 lg:w-1/4">
            <div class="person-page__image-wrapper aspect-[3/4] rounded-2xl overflow-hidden border border-stage-700/50 shadow-2xl bg-stage-800">
              <img
                v-if="personRecord.headshot"
                :src="getAssetUrl(personRecord.headshot)!"
                :alt="fullName"
                class="person-page__image w-full h-full object-cover"
              />
              <div v-else class="person-page__image-placeholder w-full h-full flex items-center justify-center text-stage-600">
                <svg class="w-16 h-16" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="1">
                  <path stroke-linecap="round" stroke-linejoin="round" d="M15.75 6a3.75 3.75 0 11-7.5 0 3.75 3.75 0 017.5 0zM4.501 20.118a7.5 7.5 0 0114.998 0A17.933 17.933 0 0112 21.75c-2.676 0-5.216-.584-7.499-1.632z" />
                </svg>
              </div>
            </div>
          </div>

          <!-- Info -->
          <div class="person-page__info-col flex-1">
            <div class="person-page__meta flex items-center gap-3 mb-4">
              <span v-if="personRecord.pronouns" class="person-page__pronouns text-xs font-bold uppercase tracking-wider text-brand-400/80">
                {{ personRecord.pronouns }}
              </span>
              <span v-if="personRecord.pronouns && personRecord.website" class="text-stage-700">•</span>
              <a
                v-if="personRecord.website"
                :href="personRecord.website"
                target="_blank"
                class="person-page__website text-xs text-stage-400 hover:text-brand-400 transition-colors flex items-center gap-1"
              >
                Website
                <svg class="w-3 h-3" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
                  <path stroke-linecap="round" stroke-linejoin="round" d="M13.5 6H5.25A2.25 2.25 0 003 8.25v10.5A2.25 2.25 0 005.25 21h10.5A2.25 2.25 0 0018 18.75V10.5M13.5 6L21 3m0 0h-5.25M21 3v5.25" />
                </svg>
              </a>
            </div>

            <h1 class="person-page__name text-4xl sm:text-5xl font-serif font-bold text-stage-50 mb-6">
              {{ fullName }}
            </h1>

            <div v-if="personRecord.bio" class="person-page__bio prose prose-invert prose-lg max-w-none text-stage-300">
              <div v-html="personRecord.bio" />
            </div>
          </div>
        </div>
      </div>
    </section>

    <!-- Credits Section -->
    <section v-if="hasAnyCredits" class="person-page__credits py-20" id="person-credits">
      <div class="person-page__credits-container max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
        <h2 class="person-page__section-title text-2xl font-serif font-bold text-stage-900 mb-10 pb-4 border-b border-stage-800">
          Production Credits
        </h2>

        <div class="person-page__credits-grid grid grid-cols-1 md:grid-cols-2 gap-12">
          <!-- Cast Credits -->
          <div v-if="personRecord.cast.length" class="person-page__cast">
            <h3 class="person-page__credit-group-title text-xs font-bold uppercase tracking-[0.2em] text-stage-500 mb-6 font-sans">
              Acting
            </h3>
            <ul class="person-page__credit-list space-y-6">
              <li v-for="credit in personRecord.cast" :key="credit.id" class="person-page__credit-item group">
                <NuxtLink v-if="credit.production" :to="`/productions/${credit.production.slug}`" class="person-page__credit-link block">
                  <div class="flex items-center gap-4">
                    <div class="person-page__credit-info flex-1">
                      <p class="person-page__credit-role text-lg font-bold text-stage-900 group-hover:text-brand-400 transition-colors">
                        {{ credit.role_name }}
                      </p>
                      <p class="person-page__credit-prod text-sm text-stage-600">
                        {{ credit.production.title }}
                      </p>
                    </div>
                    <div class="person-page__credit-meta text-right">
                      <span class="person-page__credit-season text-xs font-medium text-stage-600">
                        {{ credit.production.season }}
                      </span>
                    </div>
                  </div>
                </NuxtLink>
              </li>
            </ul>
          </div>

          <!-- Crew Credits -->
          <div v-if="personRecord.crew.length" class="person-page__crew">
            <h3 class="person-page__credit-group-title text-xs font-bold uppercase tracking-[0.2em] text-stage-500 mb-6 font-sans">
              Production & Design
            </h3>
            <ul class="person-page__credit-list space-y-6">
              <li v-for="credit in personRecord.crew" :key="credit.id" class="person-page__credit-item group">
                <NuxtLink v-if="credit.production" :to="`/productions/${credit.production.slug}`" class="person-page__credit-link block">
                  <div class="flex items-center gap-4">
                    <div class="person-page__credit-info flex-1">
                      <p class="person-page__credit-role text-lg font-bold text-stage-900 group-hover:text-brand-400 transition-colors">
                        {{ credit.title }}
                      </p>
                      <p class="person-page__credit-prod text-sm text-stage-600">
                        {{ credit.production.title }}
                      </p>
                    </div>
                    <div class="person-page__credit-meta text-right">
                      <span class="person-page__credit-season text-xs font-medium text-stage-600">
                        {{ credit.production.season }}
                      </span>
                    </div>
                  </div>
                </NuxtLink>
              </li>
            </ul>
          </div>
        </div>
      </div>
    </section>

    <!-- Latest Posts Section -->
    <section v-if="personRecord.posts && personRecord.posts.length" class="person-page__posts py-20 bg-stage-900/20" id="person-posts">
      <div class="person-page__posts-container max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
        <div class="flex items-center justify-between mb-10">
          <h2 class="person-page__section-title text-2xl font-serif font-bold text-stage-100">
            Recent Writing
          </h2>
          <NuxtLink to="/news" class="text-sm text-brand-400 hover:underline">View All News &rarr;</NuxtLink>
        </div>

        <div class="person-page__posts-grid grid grid-cols-1 md:grid-cols-3 gap-6">
          <NuxtLink
            v-for="post in personRecord.posts"
            :key="post.slug"
            :to="`/news/${post.slug}`"
            class="person-page__post-card group card-glass p-0 overflow-hidden flex flex-col h-full"
          >
            <div class="aspect-video relative overflow-hidden bg-stage-800">
              <img
                v-if="post.cover_image"
                :src="getAssetUrl(post.cover_image)!"
                class="absolute inset-0 w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
              />
            </div>
            <div class="p-5 flex-1 flex flex-col">
              <p class="text-[10px] font-bold uppercase tracking-widest text-stage-500 mb-2">
                {{ new Date(post.publish_date).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }) }}
              </p>
              <h3 class="text-lg font-serif font-bold text-stage-100 group-hover:text-brand-400 transition-colors line-clamp-2 mb-3">
                {{ post.title }}
              </h3>
              <p class="text-sm text-stage-400 line-clamp-2 mb-4 flex-1">
                {{ post.excerpt }}
              </p>
              <span class="text-xs font-bold text-stage-300 group-hover:text-brand-400 transition-colors">Read More &rarr;</span>
            </div>
          </NuxtLink>
        </div>
      </div>
    </section>

    <!-- Support CTA -->
    <section class="person-page__cta py-20 border-t border-stage-800/40">
      <div class="max-w-3xl mx-auto px-4 text-center">
        <h2 class="text-2xl font-serif font-bold text-stage-900 mb-4">Support Our Artists</h2>
        <p class="text-stage-400 mb-8 leading-relaxed">
          Flux Theatre Ensemble is a values-driven creative home for artists like {{ personRecord.first_name }}. 
          Your support ensures we can continue to produce transformative, artist-centered work.
        </p>
        <NuxtLink to="/donate" class="btn-primary text-brand-400">Support Flux</NuxtLink>
      </div>
    </section>
  </div>
</template>

<style scoped>
.person-page__credit-link {
  position: relative;
}

.person-page__credit-item {
  border-left: 2px solid theme('colors.stage.800');
  padding-left: 1.5rem;
  transition: all 0.3s ease;
}

.person-page__credit-item:hover {
  border-left-color: theme('colors.brand.500');
  background: linear-gradient(to right, rgba(234, 179, 8, 0.05), transparent);
}
</style>
