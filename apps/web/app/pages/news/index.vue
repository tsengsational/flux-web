<script setup lang="ts">
import type { BlogPost } from '@flux-theatre/shared';

useSeoMeta({
  title: 'News & Updates — Flux Theatre Ensemble',
  description: 'The latest announcements, behind-the-scenes stories, and updates from Flux Theatre Ensemble.',
});

const { client, readItems } = useDirectus();

// Fetch all published blog posts with tag details
const { data: blogPosts, error } = await useAsyncData<BlogPost[]>('all-news', () => 
  client.request(readItems('posts', {
    filter: { status: { _eq: 'published' } },
    sort: ['-publish_date'],
    fields: ['*', { tags: [{ tags_id: ['name'] }] }] as any,
  })) as any
);

const allTags = computed(() => {
  const posts = blogPosts.value;
  if (!posts) return [];
  const tags = new Set<string>();
  posts.forEach((p: BlogPost) => {
    // Handle Directus M2M structure: p.tags is PostTag[]
    p.tags?.forEach((t) => {
      const tagName = (t.tags_id as any)?.name;
      if (tagName) tags.add(tagName);
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
    p.tags?.some((t) => (t.tags_id as any)?.name === activeTag.value)
  );
});

const featuredPost = computed(() => filteredPosts.value[0] || null);
const remainingPosts = computed(() => filteredPosts.value.slice(1));
</script>

<template>
  <div class="news-page">
    <!-- Page Header -->
    <section class="news-page__header pt-12 pb-6" id="news-header">
      <div class="news-page__header-container max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <p class="news-page__subtitle text-brand-400 font-medium text-sm uppercase tracking-[0.15em] mb-2">From the Company</p>
        <h1 class="news-page__title section-heading">News & Updates</h1>
        <p class="news-page__description mt-4 text-stage-400 text-lg max-w-2xl">
          Announcements, behind-the-scenes stories, interviews, and dispatches from the Flux ensemble.
        </p>
      </div>
    </section>

    <!-- Tag Filter -->
    <section class="news-page__tags-section pb-8" id="news-tags">
      <div class="news-page__tags-container max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div class="news-page__tags flex flex-wrap gap-2">
          <button
            class="news-page__tag-btn px-3 py-1.5 rounded-full text-xs font-medium transition-all duration-200"
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
            class="news-page__tag-btn px-3 py-1.5 rounded-full text-xs font-medium transition-all duration-200"
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
    <section class="news-page__content-section pb-24" id="news-content">
      <div class="news-page__content-container max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <!-- Featured Post -->
        <BlogPostCard
          v-if="featuredPost"
          :post="featuredPost"
          featured
          view_type="light"
          class="news-page__featured-post mb-8"
        />

        <!-- Posts Grid -->
        <div class="news-page__grid grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          <BlogPostCard
            v-for="post in remainingPosts"
            :key="post.slug"
            :post="post"
            view_type="light"
            class="news-page__card"
          />
        </div>

        <!-- Load More -->
        <div v-if="filteredPosts.length > 4" class="news-page__footer mt-12 text-center">
          <button class="news-page__load-more btn-secondary" id="load-more-posts">
            Load More Posts
          </button>
        </div>

        <p v-if="filteredPosts.length === 0" class="news-page__empty-text text-center text-stage-500 py-16 text-lg">
          No posts match the selected tag.
        </p>
      </div>
    </section>
  </div>
</template>
