<script setup lang="ts">
import type { Production, BlogPost, HomePage } from '@flux-theatre/shared';
const { client, readItems, readSingleton, getAssetUrl } = useDirectus();

// Fetch homepage content (singleton)
const { data: homeData } = await useAsyncData<HomePage>('home-data', () => 
  client.request(readSingleton('homepage'))
);

// Fetch upcoming productions (published, sorted by opening date)
const { data: upcomingProductions } = await useAsyncData<Production[]>('home-productions', () => 
  client.request(readItems('productions', {
    filter: { status: { _eq: 'published' } },
    sort: ['opening_date'],
    limit: 3
  }))
);

// Fetch latest news highlights (published, sorted by date descending)
const { data: newsHighlights } = await useAsyncData<BlogPost[]>('home-news', () => 
  client.request(readItems('posts', {
    filter: { status: { _eq: 'published' } },
    sort: ['-publish_date'],
    limit: 2
  }))
);
</script>

<template>
  <div class="home-page">
    <!-- ═══ HERO ═══ -->
    <section class="home-hero relative min-h-[85vh] flex items-center overflow-hidden" id="hero-section">
      <!-- Background layers -->
      <div class="home-hero__bg absolute inset-0">
        <!-- Optional CMS Background Image -->
        <img
          v-if="homeData?.hero_image"
          :src="getAssetUrl(homeData.hero_image)!"
          class="home-hero__bg-image absolute inset-0 w-full h-full object-cover"
          alt="Hero background"
        />
        
        <!-- Gradient overlays to ensure text readability -->
        <div class="home-hero__gradient absolute inset-0 bg-gradient-to-br from-stage-950 via-stage-900/80 to-curtain-700/20" />
        <div class="home-hero__overlay absolute inset-0 bg-stage-950/10" v-if="homeData?.hero_image" />
        
        <!-- Animated glow elements -->
        <div class="home-hero__glow home-hero__glow--top absolute top-0 right-0 w-[600px] h-[600px] rounded-full bg-brand-500/5 blur-3xl" />
        <div class="home-hero__glow home-hero__glow--bottom absolute bottom-0 left-0 w-[400px] h-[400px] rounded-full bg-curtain-500/5 blur-3xl" />
      </div>

      <div class="home-hero__container relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-24">
        <div class="home-hero__content max-w-3xl">
          <p class="home-hero__tagline text-brand-400 font-medium text-sm uppercase tracking-[0.2em] mb-4 animate-fade-in">
            {{ homeData?.hero_tagline || 'Now in our 20th Season' }}
          </p>
          <h1 
            class="home-hero__title hero-title-dynamic text-5xl sm:text-6xl lg:text-7xl font-serif font-bold text-stage-50 leading-[1.1] tracking-tight animate-slide-up"
            v-if="homeData?.hero_title"
            v-html="homeData.hero_title"
          ></h1>
          <h1 v-else class="home-hero__title text-5xl sm:text-6xl lg:text-7xl font-serif font-bold text-stage-50 leading-[1.1] tracking-tight animate-slide-up">
            Adventurous Theatre<br />
            <span class="home-hero__title-accent bg-gradient-to-r from-brand-400 to-brand-200 bg-clip-text text-transparent">
              in New York City
            </span>
          </h1>
          <p class="home-hero__description mt-6 text-lg sm:text-xl text-stage-300 leading-relaxed max-w-xl animate-slide-up" style="animation-delay: 0.1s">
            {{ homeData?.hero_description || 'Flux Theatre Ensemble builds new works and reimagines classics with a company of adventurous artists and an engaged audience.' }}
          </p>
          <div class="home-hero__actions mt-8 flex gap-4 animate-slide-up" style="animation-delay: 0.2s">
            <NuxtLink :to="homeData?.hero_cta_primary_link || '/productions'" class="home-hero__cta home-hero__cta--primary btn-primary text-brand-400 hover:text-brand-200 transition-colors underline underlin-offset-4 flex-wrap" id="hero-cta-tickets">
              {{ homeData?.hero_cta_primary_text || 'View Current Season' }}
            </NuxtLink>
            <NuxtLink :to="homeData?.hero_cta_secondary_link || '/about'" class="home-hero__cta home-hero__cta--secondary btn-secondary text-brand-400 hover:text-brand-200 transition-colors underline underlin-offset-4 flex-wrap" id="hero-cta-about">
              {{ homeData?.hero_cta_secondary_text || 'Our Story' }}
            </NuxtLink>
          </div>
        </div>
      </div>

      <!-- Scroll indicator -->
      <div class="home-hero__scroll-indicator absolute bottom-8 left-1/2 -translate-x-1/2 animate-bounce">
        <div class="home-hero__scroll-track w-6 h-10 rounded-full border-2 border-stage-600 flex items-start justify-center p-2">
          <div class="home-hero__scroll-dot w-1 h-2.5 rounded-full bg-brand-400" />
        </div>
      </div>
    </section>

    <!-- ═══ UPCOMING PRODUCTIONS ═══ -->
    <section class="upcoming-productions py-24 bg-stage-950" id="upcoming-productions">
      <div class="upcoming-productions__container max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div class="upcoming-productions__header flex items-end justify-between mb-12">
          <div class="upcoming-productions__titles">
            <p class="upcoming-productions__subtitle text-brand-400 font-medium text-sm uppercase tracking-[0.15em] mb-2">On Stage</p>
            <h2 class="upcoming-productions__title section-heading text-stage-50">Upcoming Productions</h2>
          </div>
          <NuxtLink to="/productions" class="upcoming-productions__view-all btn-secondary hidden sm:inline-flex text-brand-400 hover:text-brand-200 transition-colors" id="view-all-productions">
            View All
          </NuxtLink>
        </div>

        <div v-if="upcomingProductions" class="upcoming-productions__grid grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          <ProductionCard
            v-for="prod in upcomingProductions"
            :key="prod.slug"
            :production="prod"
            class="upcoming-productions__card"
          />
        </div>

        <div class="upcoming-productions__mobile-action mt-8 text-center sm:hidden">
          <NuxtLink to="/productions" class="upcoming-productions__mobile-btn btn-secondary">View All Productions</NuxtLink>
        </div>
      </div>
    </section>

    <!-- ═══ MISSION STATEMENT ═══ -->
    <section class="mission py-24 relative overflow-hidden" id="mission-section">
      <!-- Background Image -->
      <img
        v-if="homeData?.mission_background_image"
        :src="getAssetUrl(homeData.mission_background_image)!"
        class="mission__bg-image absolute inset-0 w-full h-full object-cover"
        alt="Mission background"
      />
      <!-- Overlays -->
      <div class="mission__gradient absolute inset-0 bg-gradient-to-b from-stage-950 via-stage-900/10 to-stage-950" />
      <div v-if="homeData?.mission_background_image" class="mission__overlay absolute inset-0 bg-stage-950/10" />
      <div class="mission__glow absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[400px] rounded-full bg-brand-500/3 blur-3xl" />

      <div class="mission__container relative max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
        <p class="mission__subtitle text-brand-400 font-medium text-sm uppercase tracking-[0.15em] mb-4">Our Mission</p>
        <blockquote v-if="homeData?.mission_statement" class="mission__quote text-2xl sm:text-3xl lg:text-4xl font-serif text-stage-100 leading-relaxed" v-html="homeData.mission_statement">
        </blockquote>
        <blockquote v-else class="mission__quote text-2xl sm:text-3xl lg:text-4xl font-serif text-stage-100 leading-relaxed">
          &ldquo;To create theatre that is <em class="mission__emph mission__emph--alive text-brand-400 not-italic font-semibold">alive</em>, 
          <em class="mission__emph mission__emph--daring text-brand-300 not-italic font-semibold">daring</em>, and 
          <em class="mission__emph mission__emph--communal text-brand-200 not-italic font-semibold">communal</em> &mdash; 
          where artists and audiences take risks together.&rdquo;
        </blockquote>
        <div class="mission__footer mt-8">
          <NuxtLink to="/about" class="mission__link text-brand-400 font-medium text-sm hover:text-brand-300 transition-colors underline underline-offset-4">
            Learn more about Flux &rarr;
          </NuxtLink>
        </div>
      </div>
    </section>

    <!-- ═══ NEWS / BLOG HIGHLIGHTS ═══ -->
    <section class="news-highlights py-24 bg-stage-950" id="news-highlights">
      <div class="news-highlights__container max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div class="news-highlights__header flex items-end justify-between mb-12">
          <div class="news-highlights__titles">
            <p class="news-highlights__subtitle text-brand-400 font-medium text-sm uppercase tracking-[0.15em] mb-2">Latest</p>
            <h2 class="news-highlights__title section-heading text-stage-50">News & Updates</h2>
          </div>
          <NuxtLink to="/news" class="news-highlights__view-all btn-secondary hidden sm:inline-flex text-brand-400 hover:text-brand-200 transition-colors" id="view-all-news">
            All News
          </NuxtLink>
        </div>

        <div v-if="newsHighlights" class="news-highlights__grid grid grid-cols-1 md:grid-cols-2 gap-6">
          <NuxtLink
            v-for="post in newsHighlights"
            :key="post.slug"
            :to="`/news/${post.slug}`"
            class="news-highlights__card card-glass p-6 group"
          >
            <p class="news-highlights__date text-xs text-brand-400/70 font-medium uppercase tracking-wider mb-3">{{ post.publish_date }}</p>
            <h3 class="news-highlights__card-title text-xl font-serif font-bold text-stage-50 group-hover:text-brand-400 transition-colors">
              {{ post.title }}
            </h3>
            <p class="news-highlights__excerpt text-sm text-stage-400 mt-3 leading-relaxed">{{ post.excerpt }}</p>
            <span class="news-highlights__more inline-block mt-4 text-sm text-brand-400 font-medium group-hover:translate-x-1 transition-transform">
              Read more &rarr;
            </span>
          </NuxtLink>
        </div>
      </div>
    </section>

    <!-- ═══ NEWSLETTER CTA ═══ -->
    <section class="newsletter py-20 relative overflow-hidden" id="newsletter-cta">
      <div class="newsletter__bg absolute inset-0 bg-gradient-to-r from-curtain-700/20 via-stage-900 to-brand-900/20" />
      <div class="newsletter__container relative max-w-2xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
        <h2 class="newsletter__title text-2xl sm:text-3xl font-serif font-bold text-stage-50">Stay in the Loop</h2>
        <p class="newsletter__description mt-3 text-stage-300">Get updates on auditions, upcoming shows, and behind-the-scenes stories.</p>
        <form class="newsletter__form mt-8 flex flex-col sm:flex-row gap-3 max-w-md mx-auto" @submit.prevent>
          <input
            type="email"
            placeholder="your@email.com"
            class="newsletter__input flex-1 px-4 py-3 rounded-lg bg-stage-800/60 border border-stage-700/40 text-stage-100 placeholder-stage-500 focus:outline-none focus:ring-2 focus:ring-brand-500/50 focus:border-brand-500/50 transition-all"
            id="newsletter-email"
          />
          <button type="submit" class="newsletter__submit btn-primary whitespace-nowrap" id="newsletter-submit">
            Subscribe
          </button>
        </form>
      </div>
    </section>
  </div>
</template>

<style scoped>
.hero-title-dynamic :deep(span) {
  @apply bg-gradient-to-r from-brand-400 to-brand-200 bg-clip-text text-transparent;
}
</style>
