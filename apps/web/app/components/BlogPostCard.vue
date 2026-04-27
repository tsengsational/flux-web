<script setup lang="ts">
import type { BlogPost, Person } from '@flux-theatre/shared';

interface Props {
  post: BlogPost;
  featured?: boolean;
  view_type?: 'light' | 'dark';
}

const props = withDefaults(defineProps<Props>(), { 
  featured: false,
  view_type: 'light'
});
const { getAssetUrl } = useDirectus();

const formattedDate = computed(() => {
  return new Date(props.post.publish_date).toLocaleDateString('en-US', {
    month: 'long',
    day: 'numeric',
    year: 'numeric',
  });
});

const authorName = computed(() => {
  const author = props.post.author;
  if (!author || typeof author === 'string') return 'Flux Theatre';
  return `${author.first_name} ${author.last_name}`;
});
</script>

<template>
  <!-- Featured (hero) variant -->
  <NuxtLink
    v-if="featured"
    :to="`/news/${post.slug}`"
    class="blog-post-card blog-post-card--featured card-glass group grid grid-cols-1 lg:grid-cols-2 overflow-hidden"
    :id="`blog-featured-${post.slug}`"
  >
    <!-- Cover image -->
    <div class="blog-post-card__image-container relative aspect-video lg:aspect-auto lg:min-h-[320px] bg-stage-800 overflow-hidden">
      <img
        v-if="post.cover_image_override || post.cover_image"
        :src="getAssetUrl(post.cover_image_override || post.cover_image, { width: 1200, quality: 80 })!"
        :alt="post.title"
        class="blog-post-card__image w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
        loading="lazy"
      />
      <div v-else class="blog-post-card__placeholder w-full h-full flex items-center justify-center bg-gradient-to-br from-stage-800 to-stage-900">
        <svg class="blog-post-card__placeholder-icon w-16 h-16 text-stage-700" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="1">
          <path stroke-linecap="round" stroke-linejoin="round" d="M12 7.5h1.5m-1.5 3h1.5m-7.5 3h7.5m-7.5 3h7.5m3-9h3.375c.621 0 1.125.504 1.125 1.125V18a2.25 2.25 0 01-2.25 2.25M16.5 7.5V18a2.25 2.25 0 002.25 2.25M16.5 7.5V4.875c0-.621-.504-1.125-1.125-1.125H4.125C3.504 3.75 3 4.254 3 4.875V18a2.25 2.25 0 002.25 2.25h13.5M6 7.5h3v3H6v-3z" />
        </svg>
      </div>
      <div class="blog-post-card__overlay absolute inset-0 bg-gradient-to-r from-transparent to-stage-950/30 lg:bg-none" />
    </div>

    <!-- Content -->
    <div class="blog-post-card__content p-6 lg:p-8 flex flex-col justify-center">
      <div class="blog-post-card__meta flex items-center gap-3 mb-3">
        <span 
          class="blog-post-card__badge px-2.5 py-1 rounded-full text-xs font-bold"
          :class="view_type === 'light' ? 'bg-brand-600 text-white' : 'bg-brand-500/20 text-brand-300'"
        >
          Featured
        </span>
        <span 
          class="blog-post-card__date text-xs"
          :class="view_type === 'light' ? 'text-stage-600' : 'text-stage-500'"
        >{{ formattedDate }}</span>
      </div>
      <h2 
        class="blog-post-card__title text-2xl lg:text-3xl font-serif font-bold group-hover:text-brand-400 transition-colors leading-tight"
        :class="view_type === 'light' ? 'text-stage-950' : 'text-stage-50'"
      >
        {{ post.title }}
      </h2>
      <p 
        v-if="post.excerpt" 
        class="blog-post-card__excerpt mt-3 leading-relaxed line-clamp-3"
        :class="view_type === 'light' ? 'text-stage-700' : 'text-stage-400'"
      >
        {{ post.excerpt }}
      </p>
      <div 
        class="blog-post-card__footer mt-4 flex items-center justify-between"
        :class="view_type === 'light' ? 'text-stage-700' : 'text-stage-500'"
      >
        <span class="blog-post-card__author text-xs">
          By 
          <NuxtLink v-if="post.author && typeof post.author !== 'string'" :to="`/people/${post.author.slug}`" class="hover:text-brand-400 transition-colors">
            {{ authorName }}
          </NuxtLink>
          <span v-else>{{ authorName }}</span>
        </span>
        <span class="blog-post-card__more text-sm text-brand-400 font-medium group-hover:translate-x-1 transition-transform">
          Read more &rarr;
        </span>
      </div>
      <div v-if="post.tags && post.tags.length" class="blog-post-card__tags mt-4 flex flex-wrap gap-2">
        <span
          v-for="tag in post.tags.slice(0, 3)"
          :key="tag.id"
          class="blog-post-card__tag text-xs px-2 py-0.5 rounded-full"
          :class="view_type === 'light' 
            ? 'bg-stage-50 text-stage-700 border border-stage-200' 
            : 'bg-stage-800/80 text-stage-400 border border-stage-700/40'"
        >
          {{ (tag.tags_id as any)?.name }}
        </span>
      </div>
    </div>
  </NuxtLink>

  <!-- Standard card variant -->
  <NuxtLink
    v-else
    :to="`/news/${post.slug}`"
    class="blog-post-card card-glass group block"
    :id="`blog-card-${post.slug}`"
  >
    <!-- Cover image -->
    <div class="blog-post-card__image-container relative aspect-video bg-stage-800 overflow-hidden">
      <img
        v-if="post.cover_image_override || post.cover_image"
        :src="getAssetUrl(post.cover_image_override || post.cover_image, { width: 800, quality: 80 })!"
        :alt="post.title"
        class="blog-post-card__image w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
        loading="lazy"
      />
      <div v-else class="blog-post-card__placeholder w-full h-full flex items-center justify-center bg-gradient-to-br from-stage-800 to-stage-900">
        <svg class="blog-post-card__placeholder-icon w-12 h-12 text-stage-700" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="1">
          <path stroke-linecap="round" stroke-linejoin="round" d="M12 7.5h1.5m-1.5 3h1.5m-7.5 3h7.5m-7.5 3h7.5m3-9h3.375c.621 0 1.125.504 1.125 1.125V18a2.25 2.25 0 01-2.25 2.25M16.5 7.5V18a2.25 2.25 0 002.25 2.25M16.5 7.5V4.875c0-.621-.504-1.125-1.125-1.125H4.125C3.504 3.75 3 4.254 3 4.875V18a2.25 2.25 0 002.25 2.25h13.5M6 7.5h3v3H6v-3z" />
        </svg>
      </div>
      <!-- Date badge -->
      <div class="blog-post-card__badge-container absolute top-3 left-3">
        <span 
          class="blog-post-card__badge px-2.5 py-1 rounded-full text-xs font-semibold backdrop-blur-sm"
          :class="view_type === 'light' ? 'bg-stage-100/90 text-stage-800' : 'bg-stage-950/80 text-stage-200'"
        >
          {{ formattedDate }}
        </span>
      </div>
    </div>

    <!-- Content -->
    <div class="blog-post-card__content p-5">
      <h3 
        class="blog-post-card__title text-lg font-serif font-bold group-hover:text-brand-400 transition-colors line-clamp-2"
        :class="view_type === 'light' ? 'text-stage-950' : 'text-stage-50'"
      >
        {{ post.title }}
      </h3>
      <p 
        v-if="post.excerpt" 
        class="blog-post-card__excerpt text-sm mt-2 leading-relaxed line-clamp-3"
        :class="view_type === 'light' ? 'text-stage-700' : 'text-stage-400'"
      >
        {{ post.excerpt }}
      </p>
      <div 
        class="blog-post-card__footer mt-4 flex items-center justify-between"
        :class="view_type === 'light' ? 'text-stage-700' : 'text-stage-500'"
      >
        <span class="blog-post-card__author text-xs">
          By 
          <NuxtLink v-if="post.author && typeof post.author !== 'string'" :to="`/people/${post.author.slug}`" class="hover:text-brand-400 transition-colors">
            {{ authorName }}
          </NuxtLink>
          <span v-else>{{ authorName }}</span>
        </span>
        <span class="blog-post-card__more text-sm text-brand-400 font-medium group-hover:translate-x-1 transition-transform">
          Read &rarr;
        </span>
      </div>
      <div v-if="post.tags && post.tags.length" class="blog-post-card__tags mt-3 flex flex-wrap gap-1.5">
        <span
          v-for="tag in post.tags.slice(0, 3)"
          :key="tag.id"
          class="blog-post-card__tag text-xs px-2 py-0.5 rounded-full"
          :class="view_type === 'light' 
            ? 'bg-stage-50 text-stage-700 border border-stage-200' 
            : 'bg-stage-800/80 text-stage-400 border border-stage-700/40'"
        >
          {{ (tag.tags_id as any)?.name }}
        </span>
      </div>
    </div>
  </NuxtLink>
</template>
