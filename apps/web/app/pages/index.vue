<script setup lang="ts">
// In production, these would come from useFetch('/api/productions')
// For now, using placeholder data matching the shared types

const upcomingProductions = [
  {
    title: 'The Tempest Reimagined',
    slug: 'the-tempest-reimagined',
    tagline: 'A storm is coming. So is the reckoning.',
    poster_image: null,
    season: '2025–2026',
    playwright: 'William Shakespeare',
    opening_date: '2026-04-10',
    closing_date: '2026-05-02',
  },
  {
    title: 'Neon Wilderness',
    slug: 'neon-wilderness',
    tagline: 'Where does the city end and the self begin?',
    poster_image: null,
    season: '2025–2026',
    playwright: 'Aria Chen',
    opening_date: '2026-06-05',
    closing_date: '2026-06-28',
  },
  {
    title: 'After the Applause',
    slug: 'after-the-applause',
    tagline: 'The show must go on — but should it?',
    poster_image: null,
    season: '2025–2026',
    playwright: 'Marcus Hall',
    opening_date: '2026-09-11',
    closing_date: '2026-10-04',
  },
];

const newsHighlights = [
  {
    title: 'Flux Announces 2025–2026 Season',
    excerpt: 'Three bold new productions exploring technology, identity, and the myths we tell ourselves.',
    date: 'March 1, 2026',
    slug: 'season-announcement-2025-2026',
  },
  {
    title: 'Open Auditions: The Tempest Reimagined',
    excerpt: 'We\'re seeking adventurous actors for our spring production. All backgrounds welcome.',
    date: 'February 15, 2026',
    slug: 'auditions-tempest',
  },
];
</script>

<template>
  <div>
    <!-- ═══ HERO ═══ -->
    <section class="relative min-h-[85vh] flex items-center overflow-hidden" id="hero-section">
      <!-- Animated background -->
      <div class="absolute inset-0">
        <div class="absolute inset-0 bg-gradient-to-br from-stage-950 via-stage-900 to-curtain-700/20" />
        <div class="absolute top-0 right-0 w-[600px] h-[600px] rounded-full bg-brand-500/5 blur-3xl" />
        <div class="absolute bottom-0 left-0 w-[400px] h-[400px] rounded-full bg-curtain-500/5 blur-3xl" />
      </div>

      <div class="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-24">
        <div class="max-w-3xl">
          <p class="text-brand-400 font-medium text-sm uppercase tracking-[0.2em] mb-4 animate-fade-in">
            Now in our 20th Season
          </p>
          <h1 class="text-5xl sm:text-6xl lg:text-7xl font-serif font-bold text-stage-50 leading-[1.1] tracking-tight animate-slide-up">
            Adventurous Theatre<br />
            <span class="bg-gradient-to-r from-brand-400 to-brand-200 bg-clip-text text-transparent">
              in New York City
            </span>
          </h1>
          <p class="mt-6 text-lg sm:text-xl text-stage-300 leading-relaxed max-w-xl animate-slide-up" style="animation-delay: 0.1s">
            Flux Theatre Ensemble builds new works and reimagines classics with a company of adventurous artists and an engaged audience.
          </p>
          <div class="mt-8 flex flex-wrap gap-4 animate-slide-up" style="animation-delay: 0.2s">
            <NuxtLink to="/productions" class="btn-primary" id="hero-cta-tickets">
              View Current Season
            </NuxtLink>
            <NuxtLink to="/about" class="btn-secondary" id="hero-cta-about">
              Our Story
            </NuxtLink>
          </div>
        </div>
      </div>

      <!-- Scroll indicator -->
      <div class="absolute bottom-8 left-1/2 -translate-x-1/2 animate-bounce">
        <div class="w-6 h-10 rounded-full border-2 border-stage-600 flex items-start justify-center p-2">
          <div class="w-1 h-2.5 rounded-full bg-brand-400" />
        </div>
      </div>
    </section>

    <!-- ═══ UPCOMING PRODUCTIONS ═══ -->
    <section class="py-24 bg-stage-950" id="upcoming-productions">
      <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div class="flex items-end justify-between mb-12">
          <div>
            <p class="text-brand-400 font-medium text-sm uppercase tracking-[0.15em] mb-2">On Stage</p>
            <h2 class="section-heading">Upcoming Productions</h2>
          </div>
          <NuxtLink to="/productions" class="btn-secondary hidden sm:inline-flex" id="view-all-productions">
            View All
          </NuxtLink>
        </div>

        <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          <ProductionCard
            v-for="prod in upcomingProductions"
            :key="prod.slug"
            :production="prod"
          />
        </div>

        <div class="mt-8 text-center sm:hidden">
          <NuxtLink to="/productions" class="btn-secondary">View All Productions</NuxtLink>
        </div>
      </div>
    </section>

    <!-- ═══ MISSION STATEMENT ═══ -->
    <section class="py-24 relative overflow-hidden" id="mission-section">
      <div class="absolute inset-0 bg-gradient-to-b from-stage-950 via-stage-900/80 to-stage-950" />
      <div class="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[400px] rounded-full bg-brand-500/3 blur-3xl" />

      <div class="relative max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
        <p class="text-brand-400 font-medium text-sm uppercase tracking-[0.15em] mb-4">Our Mission</p>
        <blockquote class="text-2xl sm:text-3xl lg:text-4xl font-serif text-stage-100 leading-relaxed">
          &ldquo;To create theatre that is <em class="text-brand-400 not-italic font-semibold">alive</em>, 
          <em class="text-brand-300 not-italic font-semibold">daring</em>, and 
          <em class="text-brand-200 not-italic font-semibold">communal</em> &mdash; 
          where artists and audiences take risks together.&rdquo;
        </blockquote>
        <div class="mt-8">
          <NuxtLink to="/about" class="text-brand-400 font-medium text-sm hover:text-brand-300 transition-colors underline underline-offset-4">
            Learn more about Flux &rarr;
          </NuxtLink>
        </div>
      </div>
    </section>

    <!-- ═══ NEWS / BLOG HIGHLIGHTS ═══ -->
    <section class="py-24 bg-stage-950" id="news-highlights">
      <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div class="flex items-end justify-between mb-12">
          <div>
            <p class="text-brand-400 font-medium text-sm uppercase tracking-[0.15em] mb-2">Latest</p>
            <h2 class="section-heading">News & Updates</h2>
          </div>
          <NuxtLink to="/news" class="btn-secondary hidden sm:inline-flex" id="view-all-news">
            All News
          </NuxtLink>
        </div>

        <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
          <NuxtLink
            v-for="post in newsHighlights"
            :key="post.slug"
            :to="`/news/${post.slug}`"
            class="card-glass p-6 group"
          >
            <p class="text-xs text-brand-400/70 font-medium uppercase tracking-wider mb-3">{{ post.date }}</p>
            <h3 class="text-xl font-serif font-bold text-stage-50 group-hover:text-brand-400 transition-colors">
              {{ post.title }}
            </h3>
            <p class="text-sm text-stage-400 mt-3 leading-relaxed">{{ post.excerpt }}</p>
            <span class="inline-block mt-4 text-sm text-brand-400 font-medium group-hover:translate-x-1 transition-transform">
              Read more &rarr;
            </span>
          </NuxtLink>
        </div>
      </div>
    </section>

    <!-- ═══ NEWSLETTER CTA ═══ -->
    <section class="py-20 relative overflow-hidden" id="newsletter-cta">
      <div class="absolute inset-0 bg-gradient-to-r from-curtain-700/20 via-stage-900 to-brand-900/20" />
      <div class="relative max-w-2xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
        <h2 class="text-2xl sm:text-3xl font-serif font-bold text-stage-50">Stay in the Loop</h2>
        <p class="mt-3 text-stage-300">Get updates on auditions, upcoming shows, and behind-the-scenes stories.</p>
        <form class="mt-8 flex flex-col sm:flex-row gap-3 max-w-md mx-auto" @submit.prevent>
          <input
            type="email"
            placeholder="your@email.com"
            class="flex-1 px-4 py-3 rounded-lg bg-stage-800/60 border border-stage-700/40 text-stage-100 placeholder-stage-500 focus:outline-none focus:ring-2 focus:ring-brand-500/50 focus:border-brand-500/50 transition-all"
            id="newsletter-email"
          />
          <button type="submit" class="btn-primary whitespace-nowrap" id="newsletter-submit">
            Subscribe
          </button>
        </form>
      </div>
    </section>
  </div>
</template>
