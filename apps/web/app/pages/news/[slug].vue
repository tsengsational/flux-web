<script setup lang="ts">
const route = useRoute();
const slug = route.params.slug as string;

// In production: const { data } = await useFetch(`/items/blog_posts?filter[slug]=${slug}`)
const post = {
  title: 'Flux Announces 2025–2026 Season',
  slug: 'season-announcement-2025-2026',
  excerpt: 'Three bold new productions exploring technology, identity, and the myths we tell ourselves.',
  body: `
    <p>We are thrilled to announce the three productions that will make up Flux Theatre Ensemble's 
    <strong>2025–2026 season</strong> — our 20th year of adventurous theatre in New York City.</p>

    <h2>The Tempest Reimagined</h2>
    <p>Our spring production takes Shakespeare's final masterpiece and rebuilds it as a meditation 
    on power, forgiveness, and the stories we tell to survive. Directed by Elena Vasquez, this 
    production will use live music, movement, and immersive staging to place the audience inside 
    Prospero's storm.</p>
    <p><em>April 10 – May 2, 2026 at The 4th Street Theatre</em></p>

    <h2>Neon Wilderness</h2>
    <p>Playwright Aria Chen's electrifying new work asks: where does the city end and the self 
    begin? Set in a near-future New York where every surface is a screen, five strangers discover 
    that the last unmonitored space in the city is a condemned community garden in the Bronx.</p>
    <p><em>June 5 – June 28, 2026</em></p>

    <h2>After the Applause</h2>
    <p>Marcus Hall's dark comedy follows a fictional theater company through the tech rehearsal 
    of a show that keeps falling apart. Part backstage farce, part existential reckoning, 
    <em>After the Applause</em> asks: when the show must go on — should it?</p>
    <p><em>September 11 – October 4, 2026</em></p>

    <blockquote>
      <p>"This season is about confronting the stories we inherit and choosing which ones we 
      carry forward. Each of these plays challenges us — as artists, as citizens, as humans — 
      to look at the world with fresh eyes."</p>
      <cite>— Elena Vasquez, Artistic Director</cite>
    </blockquote>

    <h2>Season Subscriptions</h2>
    <p>Season subscriptions will go on sale <strong>March 15, 2026</strong>. Subscribers save 
    25% on tickets and get priority seating, plus invitations to exclusive talkbacks with the 
    creative teams.</p>
    <p>Individual show tickets go on sale one month before each production's opening night.</p>
  `,
  cover_image: null,
  publish_date: '2026-03-01',
  tags: ['Announcements', 'Season'],
  author: {
    first_name: 'Elena',
    last_name: 'Vasquez',
    headshot: null,
    bio: 'Elena Vasquez is the Artistic Director of Flux Theatre Ensemble.',
  },
  meta_title: null,
  meta_description: null,
};

useSeoMeta({
  title: `${post.title} — Flux Theatre Ensemble`,
  description: post.meta_description || post.excerpt || '',
});

const formattedDate = computed(() => {
  return new Date(post.publish_date).toLocaleDateString('en-US', {
    weekday: 'long',
    month: 'long',
    day: 'numeric',
    year: 'numeric',
  });
});

const authorName = computed(() => {
  if (!post.author) return 'Flux Theatre Ensemble';
  return `${post.author.first_name} ${post.author.last_name}`;
});
</script>

<template>
  <article class="pb-24">
    <!-- Cover Image Hero -->
    <div class="relative h-64 sm:h-80 lg:h-96 bg-stage-900 overflow-hidden" id="post-hero">
      <img
        v-if="post.cover_image"
        :src="post.cover_image"
        :alt="post.title"
        class="w-full h-full object-cover"
      />
      <div v-else class="w-full h-full bg-gradient-to-br from-curtain-700/20 via-stage-900 to-brand-900/10" />
      <div class="absolute inset-0 bg-gradient-to-t from-stage-950 via-stage-950/50 to-transparent" />
    </div>

    <!-- Content -->
    <div class="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 -mt-24 relative z-10">
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

      <!-- Author -->
      <div class="mt-6 flex items-center gap-3 pb-8 border-b border-stage-800/60">
        <div class="w-10 h-10 rounded-full bg-gradient-to-br from-brand-400 to-brand-600 flex items-center justify-center flex-shrink-0">
          <span v-if="post.author" class="text-stage-950 font-sans text-sm font-bold">
            {{ post.author.first_name[0] }}{{ post.author.last_name[0] }}
          </span>
          <span v-else class="text-stage-950 font-serif font-bold text-sm">F</span>
        </div>
        <div>
          <p class="text-sm font-medium text-stage-200">{{ authorName }}</p>
          <p v-if="post.author?.bio" class="text-xs text-stage-500 line-clamp-1">{{ post.author.bio }}</p>
        </div>
      </div>

      <!-- Tags -->
      <div v-if="post.tags.length" class="mt-6 flex flex-wrap gap-2">
        <span
          v-for="tag in post.tags"
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
