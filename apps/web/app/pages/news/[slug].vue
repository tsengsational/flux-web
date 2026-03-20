<script setup lang="ts">
import type { BlogPost } from '@flux-theatre/shared';

const route = useRoute();
const slug = route.params.slug as string;
const { client, readItems, getAssetUrl } = useDirectus();

// Fetch the post from Directus based on slug
const { data: posts, error } = await useAsyncData<BlogPost[]>(`post-${slug}`, () => 
  client.request(readItems('posts' as any, {
    filter: { slug: { _eq: slug }, status: { _eq: 'published' } },
    fields: ['*', { author: ['first_name', 'last_name', 'bio'], tags: [{ tags_id: ['name'] }] }] as any,
    limit: 1
  } as any) as any)
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
  <article class="pb-24">
    <!-- Cover Image Hero -->
    <div v-if="post" class="relative h-64 sm:h-80 lg:h-96 bg-stage-900 overflow-hidden" id="post-hero">
      <img
        v-if="post.cover_image"
        :src="getAssetUrl(post.cover_image)!"
        :alt="post.title"
        class="w-full h-full object-cover"
      />
      <div v-else class="w-full h-full bg-gradient-to-br from-curtain-700/20 via-stage-900 to-brand-900/10" />
      <div class="absolute inset-0 bg-gradient-to-t from-stage-950 via-stage-950/50 to-transparent" />
    </div>

    <!-- Content -->
    <div v-if="post" class="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 -mt-24 relative z-10">
      <!-- Meta -->
      <div class="flex flex-wrap items-center gap-3 mb-4">
        <NuxtLink to="/news" class="text-xs text-stage-400 hover:text-brand-400 transition-colors">
          &larr; All News
        </NuxtLink>
        <span class="w-px h-3 bg-stage-700" />
        <span class="text-xs text-stage-500">{{ formattedDate }}</span>
      </div>

      <!-- Title -->
      <h1 class="text-3xl sm:text-4xl lg:text-5xl font-serif font-bold text-stage-50 leading-tight tracking-tight">
        {{ post.title }}
      </h1>

      <div class="mt-6 flex items-center gap-3 pb-8 border-b border-stage-800/60">
        <div class="w-10 h-10 rounded-full bg-gradient-to-br from-brand-400 to-brand-600 flex items-center justify-center flex-shrink-0">
          <span class="text-stage-950 font-sans text-sm font-bold">
            {{ authorInitials }}
          </span>
        </div>
        <div>
          <p class="text-sm font-medium text-stage-200">{{ authorName }}</p>
          <p v-if="typeof post.author !== 'string' && post.author?.bio" class="text-xs text-stage-500 line-clamp-1">
            {{ post.author.bio }}
          </p>
        </div>
      </div>

      <!-- Tags -->
      <div v-if="postTags.length" class="mt-6 flex flex-wrap gap-2">
        <span
          v-for="tag in postTags"
          :key="tag"
          class="text-xs px-2.5 py-1 rounded-full bg-stage-800/80 text-stage-400 border border-stage-700/40"
        >
          {{ tag }}
        </span>
      </div>

      <!-- Body -->
      <div
        class="mt-8 prose prose-invert prose-lg max-w-none
               prose-headings:font-serif prose-headings:text-stage-50
               prose-p:text-stage-300 prose-p:leading-relaxed
               prose-a:text-brand-400 prose-a:no-underline hover:prose-a:underline
               prose-blockquote:border-l-brand-500 prose-blockquote:text-stage-200 prose-blockquote:font-serif prose-blockquote:not-italic
               prose-strong:text-stage-100
               prose-em:text-stage-200"
        v-html="post.body"
        id="post-body"
      />

      <!-- Share / Back -->
      <div class="mt-12 pt-8 border-t border-stage-800/60 flex items-center justify-between">
        <NuxtLink to="/news" class="btn-secondary text-sm" id="back-to-news">
          &larr; Back to News
        </NuxtLink>
        <div class="flex gap-2 text-stage-500 text-xs">
          Share:
          <a href="#" class="hover:text-brand-400 transition-colors">Twitter</a>
          ·
          <a href="#" class="hover:text-brand-400 transition-colors">Facebook</a>
        </div>
      </div>
    </div>
  </article>
</template>
