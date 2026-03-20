<script setup lang="ts">
import type { BlogPost } from '@flux-theatre/shared';

useSeoMeta({
  title: 'News & Updates — Flux Theatre Ensemble',
  description: 'The latest announcements, behind-the-scenes stories, and updates from Flux Theatre Ensemble.',
});

const { client, readItems } = useDirectus();

// Fetch all published blog posts with tag details
const { data: blogPosts, error } = await useAsyncData<BlogPost[]>('all-news', () => 
  client.request(readItems('posts' as any, {
    filter: { status: { _eq: 'published' } },
    sort: ['-publish_date'],
    fields: ['*', { tags: [{ tags_id: ['name'] }] }] as any,
  } as any) as any)
);

const allTags = computed(() => {
  const posts = blogPosts.value;
  if (!posts) return [];
  const tags = new Set<string>();
  posts.forEach((p: BlogPost) => {
    // Handle Directus M2M structure: p.tags is [{ tags_id: { name: '...' } }, ...]
    (p.tags as any)?.forEach((t: any) => {
      if (t.tags_id?.name) tags.add(t.tags_id.name);
    });
  });
  return Array.from(tags).sort();
});

const activeTag = ref<string | null>(null);

const filteredPosts = computed(() => {
  const posts = blogPosts.value;
  if (!posts) return [];
  if (!activeTag.value) return posts;
  return posts.filter((p: BlogPost) => 
    (p.tags as any)?.some((t: any) => t.tags_id?.name === activeTag.value)
  );
});

const featuredPost = computed(() => filteredPosts.value[0] || null);
const remainingPosts = computed(() => filteredPosts.value.slice(1));
</script>

<template>
  <div>
    <!-- Page Header -->
    <section class="pt-12 pb-6" id="news-header">
      <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <p class="text-brand-400 font-medium text-sm uppercase tracking-[0.15em] mb-2">From the Company</p>
        <h1 class="section-heading">News & Updates</h1>
        <p class="mt-4 text-stage-400 text-lg max-w-2xl">
          Announcements, behind-the-scenes stories, interviews, and dispatches from the Flux ensemble.
        </p>
      </div>
    </section>

    <!-- Tag Filter -->
    <section class="pb-8" id="news-tags">
      <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div class="flex flex-wrap gap-2">
          <button
            class="px-3 py-1.5 rounded-full text-xs font-medium transition-all duration-200"
            :class="!activeTag
              ? 'bg-brand-500 text-stage-950'
              : 'bg-stage-800/60 text-stage-400 hover:text-stage-200 border border-stage-700/40'"
            @click="activeTag = null"
          >
            All Posts
          </button>
          <button
            v-for="tag in allTags"
            :key="tag"
            class="px-3 py-1.5 rounded-full text-xs font-medium transition-all duration-200"
            :class="activeTag === tag
              ? 'bg-brand-500 text-stage-950'
              : 'bg-stage-800/60 text-stage-400 hover:text-stage-200 border border-stage-700/40'"
            @click="activeTag = tag"
          >
            {{ tag }}
          </button>
        </div>
      </div>
    </section>

    <!-- Content -->
    <section class="pb-24" id="news-content">
      <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <!-- Featured Post -->
        <BlogPostCard
          v-if="featuredPost"
          :post="featuredPost"
          featured
          class="mb-8"
        />

        <!-- Posts Grid -->
        <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          <BlogPostCard
            v-for="post in remainingPosts"
            :key="post.slug"
            :post="post"
          />
        </div>

        <!-- Load More -->
        <div v-if="filteredPosts.length > 4" class="mt-12 text-center">
          <button class="btn-secondary" id="load-more-posts">
            Load More Posts
          </button>
        </div>

        <p v-if="filteredPosts.length === 0" class="text-center text-stage-500 py-16 text-lg">
          No posts match the selected tag.
        </p>
      </div>
    </section>
  </div>
</template>
