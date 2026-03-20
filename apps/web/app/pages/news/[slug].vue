<script setup lang="ts">
import type { BlogPost } from '@flux-theatre/shared';

const route = useRoute();
const slug = route.params.slug as string;
const { client, readItems, getAssetUrl } = useDirectus();

// Fetch the post from Directus based on slug
const { data: posts, error } = await useAsyncData<BlogPost[]>(`post-${slug}`, () => 
  client.request(readItems('posts', {
    filter: { slug: { _eq: slug }, status: { _eq: 'published' } },
    fields: ['*', { author: ['first_name', 'last_name', 'bio'], tags: [{ tags_id: ['name'] }] }, 'gallery'] as any,
    limit: 1
  })) as any
);

const post = computed(() => posts.value?.[0] || null);

// Handle 404 if post not found
if (!post.value && !error.value) {
  throw createError({ statusCode: 404, statusMessage: 'Post not found' });
}

useSeoMeta({
  title: () => `${post.value?.title || 'News'} — Flux Theatre Ensemble`,
  description: () => post.value?.excerpt || '',
});

const formattedDate = computed(() => {
  if (!post.value?.publish_date) return '';
  return new Date(post.value.publish_date).toLocaleDateString('en-US', {
    weekday: 'long',
    month: 'long',
    day: 'numeric',
    year: 'numeric',
  });
});

const authorName = computed(() => {
  const author = post.value?.author;
  if (!author || typeof author === 'string') return 'Flux Theatre Ensemble';
  return `${author.first_name} ${author.last_name}`;
});

const authorInitials = computed(() => {
  const author = post.value?.author;
  if (!author || typeof author === 'string') return 'F';
  return `${author.first_name[0]}${author.last_name[0]}`;
});

const postTags = computed(() => {
  if (!post.value?.tags) return [];
  return (post.value.tags as any).map((t: any) => t.tags_id?.name).filter(Boolean);
});
</script>

<template>
  <article class="news-post pb-24">
    <!-- Cover Image Hero -->
    <div v-if="post" class="news-post__hero relative h-64 sm:h-80 lg:h-96 bg-stage-900 overflow-hidden" id="post-hero">
      <img
        v-if="post.cover_image"
        :src="getAssetUrl(post.cover_image)!"
        :alt="post.title"
        class="news-post__hero-image w-full h-full object-cover"
      />
      <div v-else class="news-post__hero-placeholder w-full h-full bg-gradient-to-br from-curtain-700/20 via-stage-900 to-brand-900/10" />
      <div class="news-post__hero-gradient absolute inset-0 bg-gradient-to-t from-stage-950 via-stage-950/50 to-transparent" />
    </div>

    <!-- Content -->
    <div v-if="post" class="news-post__container max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 -mt-24 relative z-10">
      <!-- Meta -->
      <div class="news-post__meta flex flex-wrap items-center gap-3 mb-4">
        <NuxtLink to="/news" class="news-post__back-link text-xs text-stage-400 hover:text-brand-400 transition-colors">
          &larr; All News
        </NuxtLink>
        <span class="news-post__meta-divider w-px h-3 bg-stage-700" />
        <span class="news-post__date text-xs text-stage-500">{{ formattedDate }}</span>
      </div>

      <!-- Title -->
      <h1 class="news-post__title text-3xl sm:text-4xl lg:text-5xl font-serif font-bold text-stage-50 leading-tight tracking-tight">
        {{ post.title }}
      </h1>

      <!-- Author -->
      <div class="news-post__author mt-6 flex items-center gap-3 pb-8 border-b border-stage-800/60">
        <div class="news-post__author-avatar w-10 h-10 rounded-full bg-gradient-to-br from-brand-400 to-brand-600 flex items-center justify-center flex-shrink-0">
          <span class="news-post__author-initials text-stage-950 font-sans text-sm font-bold">
            {{ authorInitials }}
          </span>
        </div>
        <div class="news-post__author-info">
          <p class="news-post__author-name text-sm font-medium text-stage-200">{{ authorName }}</p>
          <p v-if="typeof post.author !== 'string' && post.author?.bio" class="news-post__author-bio text-xs text-stage-500 line-clamp-1">
            {{ post.author.bio }}
          </p>
        </div>
      </div>

      <!-- Tags -->
      <div v-if="postTags.length" class="news-post__tags mt-6 flex flex-wrap gap-2">
        <span
          v-for="tag in postTags"
          :key="tag"
          class="news-post__tag text-xs px-2.5 py-1 rounded-full bg-stage-800/80 text-stage-400 border border-stage-700/40"
        >
          {{ tag }}
        </span>
      </div>

      <!-- Body -->
      <div class="news-post__body mt-8" id="post-body">
        <BlockRenderer :content="post.body" />
      </div>
      
      <!-- Gallery -->
      <div v-if="post.gallery?.length" class="news-post__gallery mt-16" id="post-gallery">
        <h2 class="news-post__gallery-title text-2xl font-serif font-bold text-stage-50 mb-6">Gallery</h2>
        <div class="news-post__gallery-grid grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          <div v-for="fileId in post.gallery" :key="fileId" class="news-post__gallery-item card-glass aspect-square overflow-hidden group">
            <img 
              :src="getAssetUrl(fileId)!" 
              class="news-post__gallery-image w-full h-full object-cover transition-transform duration-500 group-hover:scale-110" 
              alt="Gallery image"
              loading="lazy"
            />
          </div>
        </div>
      </div>

      <!-- Share / Actions -->
      <div class="news-post__footer mt-12 pt-8 border-t border-stage-800/60 flex items-center justify-between">
        <NuxtLink to="/news" class="news-post__back-btn btn-secondary text-sm" id="back-to-news">
          &larr; Back to News
        </NuxtLink>
        <div class="news-post__share flex gap-2 text-stage-500 text-xs">
          <span class="news-post__share-label">Share:</span>
          <a href="#" class="news-post__share-link hover:text-brand-400 transition-colors">Twitter</a>
          <span class="news-post__share-divider">·</span>
          <a href="#" class="news-post__share-link hover:text-brand-400 transition-colors">Facebook</a>
        </div>
      </div>
    </div>
  </article>
</template>
