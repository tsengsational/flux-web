<script setup lang="ts">
interface BlogPostSummary {
  title: string;
  slug: string;
  excerpt: string | null;
  cover_image: string | null;
  publish_date: string;
  tags: string[];
  author: { first_name: string; last_name: string } | null;
}

interface Props {
  post: BlogPostSummary;
  featured?: boolean;
}

const props = withDefaults(defineProps<Props>(), { featured: false });

const formattedDate = computed(() => {
  return new Date(props.post.publish_date).toLocaleDateString('en-US', {
    month: 'long',
    day: 'numeric',
    year: 'numeric',
  });
});

const authorName = computed(() => {
  if (!props.post.author) return 'Flux Theatre';
  return `${props.post.author.first_name} ${props.post.author.last_name}`;
});
</script>

<template>
  <!-- Featured (hero) variant -->
  <NuxtLink
    v-if="featured"
    :to="`/news/${post.slug}`"
    class="card-glass group grid grid-cols-1 lg:grid-cols-2 overflow-hidden"
    :id="`blog-featured-${post.slug}`"
  >
    <!-- Cover image -->
    <div class="relative aspect-video lg:aspect-auto lg:min-h-[320px] bg-stage-800 overflow-hidden">
      <img
        v-if="post.cover_image"
        :src="post.cover_image"
        :alt="post.title"
        class="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
        loading="lazy"
      />
      <div v-else class="w-full h-full flex items-center justify-center bg-gradient-to-br from-stage-800 to-stage-900">
        <svg class="w-16 h-16 text-stage-700" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="1">
          <path stroke-linecap="round" stroke-linejoin="round" d="M12 7.5h1.5m-1.5 3h1.5m-7.5 3h7.5m-7.5 3h7.5m3-9h3.375c.621 0 1.125.504 1.125 1.125V18a2.25 2.25 0 01-2.25 2.25M16.5 7.5V18a2.25 2.25 0 002.25 2.25M16.5 7.5V4.875c0-.621-.504-1.125-1.125-1.125H4.125C3.504 3.75 3 4.254 3 4.875V18a2.25 2.25 0 002.25 2.25h13.5M6 7.5h3v3H6v-3z" />
        </svg>
      </div>
      <div class="absolute inset-0 bg-gradient-to-r from-transparent to-stage-950/30 lg:bg-none" />
    </div>

    <!-- Content -->
    <div class="p-6 lg:p-8 flex flex-col justify-center">
      <div class="flex items-center gap-3 mb-3">
        <span class="px-2.5 py-1 rounded-full text-xs font-semibold bg-brand-500/20 text-brand-300">
          Featured
        </span>
        <span class="text-xs text-stage-500">{{ formattedDate }}</span>
      </div>
      <h2 class="text-2xl lg:text-3xl font-serif font-bold text-stage-50 group-hover:text-brand-400 transition-colors leading-tight">
        {{ post.title }}
      </h2>
      <p v-if="post.excerpt" class="mt-3 text-stage-400 leading-relaxed line-clamp-3">
        {{ post.excerpt }}
      </p>
      <div class="mt-4 flex items-center justify-between">
        <span class="text-xs text-stage-500">By {{ authorName }}</span>
        <span class="text-sm text-brand-400 font-medium group-hover:translate-x-1 transition-transform">
          Read more &rarr;
        </span>
      </div>
      <div v-if="post.tags.length" class="mt-4 flex flex-wrap gap-2">
        <span
          v-for="tag in post.tags.slice(0, 3)"
          :key="tag"
          class="text-xs px-2 py-0.5 rounded-full bg-stage-800/80 text-stage-400 border border-stage-700/40"
        >
          {{ tag }}
        </span>
      </div>
    </div>
  </NuxtLink>

  <!-- Standard card variant -->
  <NuxtLink
    v-else
    :to="`/news/${post.slug}`"
    class="card-glass group block"
    :id="`blog-card-${post.slug}`"
  >
    <!-- Cover image -->
    <div class="relative aspect-video bg-stage-800 overflow-hidden">
      <img
        v-if="post.cover_image"
        :src="post.cover_image"
        :alt="post.title"
        class="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
        loading="lazy"
      />
      <div v-else class="w-full h-full flex items-center justify-center bg-gradient-to-br from-stage-800 to-stage-900">
        <svg class="w-12 h-12 text-stage-700" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="1">
          <path stroke-linecap="round" stroke-linejoin="round" d="M12 7.5h1.5m-1.5 3h1.5m-7.5 3h7.5m-7.5 3h7.5m3-9h3.375c.621 0 1.125.504 1.125 1.125V18a2.25 2.25 0 01-2.25 2.25M16.5 7.5V18a2.25 2.25 0 002.25 2.25M16.5 7.5V4.875c0-.621-.504-1.125-1.125-1.125H4.125C3.504 3.75 3 4.254 3 4.875V18a2.25 2.25 0 002.25 2.25h13.5M6 7.5h3v3H6v-3z" />
        </svg>
      </div>
      <!-- Date badge -->
      <div class="absolute top-3 left-3">
        <span class="px-2.5 py-1 rounded-full text-xs font-semibold bg-stage-950/80 text-stage-200 backdrop-blur-sm">
          {{ formattedDate }}
        </span>
      </div>
    </div>

    <!-- Content -->
    <div class="p-5">
      <h3 class="text-lg font-serif font-bold text-stage-50 group-hover:text-brand-400 transition-colors line-clamp-2">
        {{ post.title }}
      </h3>
      <p v-if="post.excerpt" class="text-sm text-stage-400 mt-2 leading-relaxed line-clamp-3">
        {{ post.excerpt }}
      </p>
      <div class="mt-4 flex items-center justify-between">
        <span class="text-xs text-stage-500">{{ authorName }}</span>
        <span class="text-sm text-brand-400 font-medium group-hover:translate-x-1 transition-transform">
          Read &rarr;
        </span>
      </div>
      <div v-if="post.tags.length" class="mt-3 flex flex-wrap gap-1.5">
        <span
          v-for="tag in post.tags.slice(0, 3)"
          :key="tag"
          class="text-xs px-2 py-0.5 rounded-full bg-stage-800/80 text-stage-400 border border-stage-700/40"
        >
          {{ tag }}
        </span>
      </div>
    </div>
  </NuxtLink>
</template>
