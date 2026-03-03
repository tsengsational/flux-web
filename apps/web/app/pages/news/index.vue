<script setup lang="ts">
useSeoMeta({
  title: 'News & Updates — Flux Theatre Ensemble',
  description: 'The latest announcements, behind-the-scenes stories, and updates from Flux Theatre Ensemble.',
});

// In production: const { data } = await useFetch('/items/blog_posts?sort=-publish_date')
const blogPosts = [
  {
    title: 'Flux Announces 2025–2026 Season',
    slug: 'season-announcement-2025-2026',
    excerpt: 'Three bold new productions exploring technology, identity, and the myths we tell ourselves. Artistic Director Elena Vasquez shares the vision behind each selection.',
    cover_image: null,
    publish_date: '2026-03-01',
    tags: ['Announcements', 'Season'],
    author: { first_name: 'Elena', last_name: 'Vasquez' },
  },
  {
    title: 'Open Auditions: The Tempest Reimagined',
    slug: 'auditions-tempest',
    excerpt: 'We\'re seeking adventurous actors for our spring production. All backgrounds and experience levels welcome. Equity and non-Equity.',
    cover_image: null,
    publish_date: '2026-02-15',
    tags: ['Auditions', 'The Tempest Reimagined'],
    author: { first_name: 'Jordan', last_name: 'Blake' },
  },
  {
    title: 'Behind the Scenes: Designing Neon Wilderness',
    slug: 'behind-scenes-neon-wilderness',
    excerpt: 'Scenic designer Nora Brennan walks us through the immersive set design blending urban decay with bioluminescent wonder.',
    cover_image: null,
    publish_date: '2026-02-01',
    tags: ['Behind the Scenes', 'Neon Wilderness'],
    author: { first_name: 'Nora', last_name: 'Brennan' },
  },
  {
    title: 'Five Years of Flux Sundays: A Retrospective',
    slug: 'flux-sundays-retrospective',
    excerpt: 'Looking back at five years of our monthly play-reading series — the surprises, the community, and the scripts that changed us.',
    cover_image: null,
    publish_date: '2026-01-15',
    tags: ['Community', 'Flux Sundays'],
    author: { first_name: 'Sasha', last_name: 'Williams' },
  },
  {
    title: 'Playwright Interview: Aria Chen on Neon Wilderness',
    slug: 'interview-aria-chen',
    excerpt: 'Aria Chen discusses her creative process, the politics of urban space, and why she writes for the stage in the age of streaming.',
    cover_image: null,
    publish_date: '2026-01-02',
    tags: ['Interviews', 'Neon Wilderness'],
    author: { first_name: 'Elena', last_name: 'Vasquez' },
  },
  {
    title: 'Flux Receives NEA Grant for New Work Development',
    slug: 'nea-grant-announcement',
    excerpt: 'We\'re thrilled to announce a National Endowment for the Arts grant supporting the development of three new plays over the next two years.',
    cover_image: null,
    publish_date: '2025-12-10',
    tags: ['Announcements', 'Grants'],
    author: null,
  },
  {
    title: 'Year in Review: 2025',
    slug: 'year-in-review-2025',
    excerpt: 'A look back at a transformative year — three productions, two world premieres, record community engagement, and exciting plans for the future.',
    cover_image: null,
    publish_date: '2025-12-01',
    tags: ['Year in Review'],
    author: null,
  },
];

const allTags = computed(() => {
  const tags = new Set<string>();
  blogPosts.forEach(p => p.tags.forEach(t => tags.add(t)));
  return Array.from(tags).sort();
});

const activeTag = ref<string | null>(null);

const filteredPosts = computed(() => {
  if (!activeTag.value) return blogPosts;
  return blogPosts.filter(p => p.tags.includes(activeTag.value!));
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
