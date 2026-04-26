<script setup lang="ts">
import type { Production, BlogPost, HomePage, Event } from '@flux-theatre/shared';
const { client, readItems, readSingleton, getAssetUrl } = useDirectus();

const { data: homeData } = await useAsyncData<HomePage>('home-data', async () => {
  const raw = await client.request<any>(readSingleton('homepage', {
    fields: [
      '*', 
      { 
        hero_slides: [
          '*',
          { cta_primary_link: ['collection', { item: { productions: ['slug'], posts: ['slug'], pages: ['slug'], events: ['slug'] } }] },
          { cta_secondary_link: ['collection', { item: { productions: ['slug'], posts: ['slug'], pages: ['slug'], events: ['slug'] } }] }
        ] 
      }
    ] as any,
  }));
  return raw as HomePage;
});

// Fetch on-stage items (prioritize featured, then by date)
const { data: onStageItems } = await useAsyncData<{_type: 'production' | 'event', data: any}[]>('home-on-stage', async () => {
  const nowStr = new Date().toISOString();
  
  // 1. Fetch upcoming/running productions
  const prodRaw = await client.request(readItems('productions', {
    fields: ['*', 'featured'],
    filter: { 
      status: { _eq: 'published' },
      _or: [
        { closing_date: { _gte: nowStr } },
        { closing_date: { _null: true } }
      ]
    },
    limit: 6
  }));

  // 2. Fetch upcoming events
  const eventsRaw = await client.request(readItems('events', {
    fields: [
      '*', 
      'featured',
      'venue.*',
      { tags: ['*', { tags_id: ['*'] }] }
    ],
    filter: { 
      status: { _eq: 'published' },
      start_datetime: { _gte: nowStr }
    },
    limit: 6
  }));

  // Merge and sort by featured priority, then by date
  const merged = [
    ...prodRaw.map(p => ({ _type: 'production' as const, data: p })),
    ...eventsRaw.map(e => ({ _type: 'event' as const, data: e }))
  ];

  merged.sort((a, b) => {
    // 1. Featured priority
    const featA = a.data.featured ? 1 : 0;
    const featB = b.data.featured ? 1 : 0;
    if (featA !== featB) return featB - featA;

    // 2. Date priority (ascending for upcoming items)
    const dateA = new Date(a.data.opening_date || a.data.start_datetime).getTime();
    const dateB = new Date(b.data.opening_date || b.data.start_datetime).getTime();
    if (dateA !== dateB) return dateA - dateB;

    // 3. Fallback to production priority
    return a._type === 'production' ? -1 : 1;
  });

  return merged.slice(0, 3);
});

// Fetch latest news highlights
const { data: newsHighlights } = await useAsyncData<BlogPost[]>('home-news', () =>
  client.request(readItems('posts', {
    filter: { status: { _eq: 'published' } },
    sort: ['-publish_date'],
    limit: 2
  }))
);

// ── Hero Carousel ─────────────────────────────────────────────
const publishedSlides = computed(() => {
  const slides = (homeData.value as any)?.hero_slides;
  if (!slides || !Array.isArray(slides)) return [];
  return slides
    .filter((s: any) => {
      // Handle both single status "published" and array ["published"]
      if (Array.isArray(s.status)) return s.status.includes('published');
      return s.status === 'published';
    })
    .sort((a: any, b: any) => (a.sort ?? 0) - (b.sort ?? 0));
});

const hasSlides = computed(() => publishedSlides.value.length > 0);
const currentSlide = ref(0);
let autoTimer: ReturnType<typeof setInterval> | null = null;

function nextSlide() {
  currentSlide.value = (currentSlide.value + 1) % publishedSlides.value.length;
}
function prevSlide() {
  currentSlide.value = (currentSlide.value - 1 + publishedSlides.value.length) % publishedSlides.value.length;
}
function goToSlide(i: number) {
  currentSlide.value = i;
  restartTimer();
}
function restartTimer() {
  if (autoTimer) clearInterval(autoTimer);
  if (publishedSlides.value.length > 1) {
    autoTimer = setInterval(nextSlide, 10000);
  }
}

function getSlideUrl(slide: any, primary: boolean) {
  const type = primary ? slide.cta_primary_type : slide.cta_secondary_type;
  if (type === 'external') return primary ? slide.cta_primary_external : slide.cta_secondary_external;

  let link = primary ? slide.cta_primary_link : slide.cta_secondary_link;
  
  // Directus M2A fields return an array of junction objects
  if (Array.isArray(link)) {
    link = link[0];
  }

  // Fallback to the hardcoded URL field if relationship isn't populated
  if (!link || !link.item || !link.collection) return primary ? slide.cta_primary_url : slide.cta_secondary_url;

  const paths: Record<string, string> = {
    'pages': '/',
    'posts': '/news/',
    'productions': '/productions/',
    'events': '/events/'
  };
  const prefix = paths[link.collection] || '/';
  
  // Depending on query depth, the slug might be nested or direct
  const slug = link.item.slug || link.item;
  if (!slug) return primary ? slide.cta_primary_url : slide.cta_secondary_url;
  
  return prefix + slug;
}

onMounted(() => restartTimer());
onUnmounted(() => { if (autoTimer) clearInterval(autoTimer); });
</script>

<template>
  <div class="home-page">
    <!-- ═══ HERO ═══ -->
    <section class="home-hero relative min-h-[85vh] flex items-center overflow-hidden" id="hero-section">

      <!-- ── CAROUSEL MODE (CMS slides) ── -->
      <template v-if="hasSlides">
        <!-- Slides -->
        <div
          v-for="(slide, i) in publishedSlides"
          :key="slide.id"
          class="hero-slide absolute inset-0"
          :class="{ 'hero-slide--active': i === currentSlide }"
        >
          <!-- Background image -->
          <img
            v-if="slide.background_image"
            :src="getAssetUrl(slide.background_image, { width: 1920, quality: 85 })!"
            class="absolute inset-0 w-full h-full object-cover"
            alt=""
          />
          <!-- Gradient overlay -->
          <div class="absolute inset-0 bg-gradient-to-br from-stage-950 via-stage-900/80 to-curtain-700/20" />
          <div class="absolute inset-0 bg-stage-950/20" />

          <!-- Slide content -->
          <div class="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-24 h-full flex items-center">
            <div class="max-w-3xl hero-slide__content" :class="{ 'hero-slide__content--active': i === currentSlide }">
              <p v-if="slide.subtitle" class="text-brand-400 font-medium text-sm uppercase tracking-[0.2em] mb-4">
                {{ slide.subtitle }}
              </p>
              <h1
                class="text-5xl sm:text-6xl lg:text-7xl font-serif font-bold text-stage-50 leading-[1.1] tracking-tight hero-title-dynamic"
                v-html="slide.title"
              ></h1>
              <p v-if="slide.description" class="mt-6 text-lg sm:text-xl text-stage-300 leading-relaxed max-w-xl">
                {{ slide.description }}
              </p>
              <div class="mt-8 flex gap-4 flex-wrap">
                <NuxtLink
                  v-if="slide.cta_primary_label && getSlideUrl(slide, true)"
                  :to="getSlideUrl(slide, true)"
                  class="btn-primary text-brand-400 hover:text-brand-200 transition-colors underline underline-offset-4"
                  :id="`hero-cta-primary-${i}`"
                >
                  {{ slide.cta_primary_label }}
                </NuxtLink>
                <NuxtLink
                  v-if="slide.cta_secondary_label && getSlideUrl(slide, false)"
                  :to="getSlideUrl(slide, false)"
                  class="btn-secondary text-brand-400 hover:text-brand-200 transition-colors underline underline-offset-4"
                  :id="`hero-cta-secondary-${i}`"
                >
                  {{ slide.cta_secondary_label }}
                </NuxtLink>
              </div>
            </div>
          </div>
        </div>

        <!-- Prev / Next arrows -->
        <button
          v-if="publishedSlides.length > 1"
          class="hero-arrow hero-arrow--prev absolute left-4 top-1/2 -translate-y-1/2 z-20"
          @click="prevSlide"
          aria-label="Previous slide"
        >
          <svg width="32" height="32" viewBox="0 0 32 32" fill="none"><circle cx="16" cy="16" r="16" fill="rgba(0,0,0,0.4)"/><path d="M19 10l-6 6 6 6" stroke="white" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/></svg>
        </button>
        <button
          v-if="publishedSlides.length > 1"
          class="hero-arrow hero-arrow--next absolute right-4 top-1/2 -translate-y-1/2 z-20"
          @click="nextSlide"
          aria-label="Next slide"
        >
          <svg width="32" height="32" viewBox="0 0 32 32" fill="none"><circle cx="16" cy="16" r="16" fill="rgba(0,0,0,0.4)"/><path d="M13 10l6 6-6 6" stroke="white" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/></svg>
        </button>

        <!-- Nav dots -->
        <div
          v-if="publishedSlides.length > 1"
          class="hero-dots absolute bottom-16 left-1/2 -translate-x-1/2 z-20 flex gap-2"
        >
          <button
            v-for="(_, i) in publishedSlides"
            :key="i"
            class="hero-dot"
            :class="{ 'hero-dot--active': i === currentSlide }"
            @click="goToSlide(i)"
            :aria-label="`Go to slide ${i + 1}`"
          />
        </div>

        <!-- Glow effects -->
        <div class="absolute top-0 right-0 w-[600px] h-[600px] rounded-full bg-brand-500/5 blur-3xl pointer-events-none" />
        <div class="absolute bottom-0 left-0 w-[400px] h-[400px] rounded-full bg-curtain-500/5 blur-3xl pointer-events-none" />
      </template>

      <!-- ── SINGLE STATIC HERO (fallback) ── -->
      <template v-else>
        <div class="home-hero__bg absolute inset-0">
          <img
            v-if="(homeData as any)?.hero_image"
            :src="getAssetUrl((homeData as any).hero_image, { width: 1920, quality: 85 })!"
            class="absolute inset-0 w-full h-full object-cover"
            alt="Hero background"
          />
          <div class="absolute inset-0 bg-gradient-to-br from-stage-950 via-stage-900/80 to-curtain-700/20" />
          <div class="absolute inset-0 bg-stage-950/10" v-if="(homeData as any)?.hero_image" />
          <div class="absolute top-0 right-0 w-[600px] h-[600px] rounded-full bg-brand-500/5 blur-3xl" />
          <div class="absolute bottom-0 left-0 w-[400px] h-[400px] rounded-full bg-curtain-500/5 blur-3xl" />
        </div>
        <div class="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-24">
          <div class="max-w-3xl">
            <p class="text-brand-400 font-medium text-sm uppercase tracking-[0.2em] mb-4 animate-fade-in">
              {{ (homeData as any)?.hero_tagline || 'Now in our 20th Season' }}
            </p>
            <h1
              class="hero-title-dynamic text-5xl sm:text-6xl lg:text-7xl font-serif font-bold text-stage-50 leading-[1.1] tracking-tight animate-slide-up"
              v-if="(homeData as any)?.hero_title"
              v-html="(homeData as any).hero_title"
            />
            <h1 v-else class="text-5xl sm:text-6xl lg:text-7xl font-serif font-bold text-stage-50 leading-[1.1] tracking-tight animate-slide-up">
              Adventurous Theatre<br />
              <span class="bg-gradient-to-r from-brand-400 to-brand-200 bg-clip-text text-transparent">in New York City</span>
            </h1>
            <p class="mt-6 text-lg sm:text-xl text-stage-300 leading-relaxed max-w-xl animate-slide-up" style="animation-delay: 0.1s">
              {{ (homeData as any)?.hero_description || 'Flux Theatre Ensemble builds new works and reimagines classics with a company of adventurous artists and an engaged audience.' }}
            </p>
            <div class="mt-8 flex gap-4 animate-slide-up flex-wrap" style="animation-delay: 0.2s">
              <NuxtLink :to="(homeData as any)?.hero_cta_primary_link || '/productions'" class="btn-primary text-brand-400 hover:text-brand-200 transition-colors underline underline-offset-4" id="hero-cta-tickets">
                {{ (homeData as any)?.hero_cta_primary_text || 'View Current Season' }}
              </NuxtLink>
              <NuxtLink :to="(homeData as any)?.hero_cta_secondary_link || '/about'" class="btn-secondary text-brand-400 hover:text-brand-200 transition-colors underline underline-offset-4" id="hero-cta-about">
                {{ (homeData as any)?.hero_cta_secondary_text || 'Our Story' }}
              </NuxtLink>
            </div>
          </div>
        </div>
      </template>

      <!-- Scroll indicator -->
      <div class="mb-14 absolute bottom-8 left-1/2 -translate-x-1/2 animate-bounce z-20">
        <div class="w-6 h-10 rounded-full border-2 border-stage-600 flex items-start justify-center p-2">
          <div class="w-1 h-2.5 rounded-full bg-brand-400" />
        </div>
      </div>
    </section>

    <!-- ═══ UPCOMING PRODUCTIONS & EVENTS ═══ -->
    <section class="upcoming-productions py-24 bg-stage-950" id="upcoming-productions">
      <div class="upcoming-productions__container max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div class="upcoming-productions__header flex items-end justify-between mb-12">
          <div class="upcoming-productions__titles">
            <p class="text-brand-400 font-medium text-sm uppercase tracking-[0.15em] mb-2">On Stage & Upcoming</p>
            <h2 class="section-heading text-stage-50">Productions & Events</h2>
          </div>
        </div>
        <div v-if="onStageItems && onStageItems.length > 0" class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          <template v-for="item in onStageItems" :key="item.data.slug">
            <ProductionCard v-if="item._type === 'production'" :production="item.data" view_type="dark" />
            <EventCard v-else-if="item._type === 'event'" :event="{ ...item.data, view_type: 'dark' }" />
          </template>
        </div>
        <div v-else class="text-stage-400 italic">No upcoming productions or events scheduled.</div>
        <div class="mt-8 flex gap-4 justify-center">
          <NuxtLink to="/productions" class="btn-secondary">View Past Productions</NuxtLink>
        </div>
      </div>
    </section>

    <!-- ═══ MISSION STATEMENT ═══ -->
    <section class="mission py-24 relative overflow-hidden" id="mission-section">
      <img
        v-if="(homeData as any)?.mission_background_image"
        :src="getAssetUrl((homeData as any).mission_background_image, { width: 1920, quality: 70 })!"
        class="absolute inset-0 w-full h-full object-cover"
        alt="Mission background"
      />
      <div class="absolute inset-0 bg-gradient-to-b from-stage-950 via-stage-900/10 to-stage-950" />
      <div v-if="(homeData as any)?.mission_background_image" class="absolute inset-0 bg-stage-950/10" />
      <div class="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[400px] rounded-full bg-brand-500/3 blur-3xl" />
      <div class="relative max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
        <p class="text-brand-400 font-medium text-sm uppercase tracking-[0.15em] mb-4">Our Mission</p>
        <blockquote v-if="(homeData as any)?.mission_statement" class="text-2xl sm:text-3xl lg:text-4xl font-serif text-stage-100 leading-relaxed" v-html="(homeData as any).mission_statement" />
        <blockquote v-else class="text-2xl sm:text-3xl lg:text-4xl font-serif text-stage-100 leading-relaxed">
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
    <section class="news-highlights py-24 bg-stage-950" id="news-highlights">
      <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div class="flex items-end justify-between mb-12">
          <div>
            <p class="text-brand-400 font-medium text-sm uppercase tracking-[0.15em] mb-2">Latest</p>
            <h2 class="section-heading text-stage-50">News &amp; Updates</h2>
          </div>
          <NuxtLink to="/news" class="btn-secondary hidden sm:inline-flex text-brand-400 hover:text-brand-200 transition-colors" id="view-all-news">All News</NuxtLink>
        </div>
        <div v-if="newsHighlights" class="grid grid-cols-1 md:grid-cols-2 gap-6">
          <BlogPostCard
            v-for="post in newsHighlights"
            :key="post.slug"
            :post="post"
            view_type="dark"
          />
        </div>
      </div>
    </section>

    <!-- ═══ NEWSLETTER CTA ═══ -->
    <section class="newsletter py-24 sm:py-32 relative overflow-hidden border-t border-stage-800/50" id="newsletter-cta">
      <!-- Deep Background -->
      <div class="absolute inset-0 bg-stage-950" />
      
      <!-- Artistic Gradient Mesh (Floating Orbs) -->
      <div class="absolute inset-0 overflow-hidden pointer-events-none opacity-50">
        <div class="orb orb-1 bg-brand-500/40"></div>
        <div class="orb orb-2 bg-curtain-600/30"></div>
        <div class="orb orb-3 bg-brand-300/20"></div>
      </div>

      <!-- Atmospheric Noise Texture (Frontend Design Style) -->
      <div class="absolute inset-0 opacity-[0.06] mix-blend-overlay pointer-events-none" style="background-image: url('data:image/svg+xml,%3Csvg viewBox=%220 0 200 200%22 xmlns=%22http://www.w3.org/2000/svg%22%3E%3Cfilter id=%22noiseFilter%22%3E%3CfeTurbulence type=%22fractalNoise%22 baseFrequency=%220.8%22 numOctaves=%223%22 stitchTiles=%22stitch%22/%3E%3C/filter%3E%3Crect width=%22100%25%22 height=%22100%25%22 filter=%22url(%23noiseFilter)%22/%3E%3C/svg%3E');"></div>

      <!-- Main Content -->
      <div class="relative max-w-2xl mx-auto px-4 sm:px-6 lg:px-8 text-center z-10">
        <h2 class="text-3xl sm:text-4xl lg:text-5xl font-serif font-bold text-transparent bg-clip-text bg-gradient-to-br from-stage-50 to-stage-400 mb-4 tracking-tight drop-shadow-xl">
          Stay in the Loop
        </h2>
        <p class="text-lg text-stage-200 mb-10 max-w-xl mx-auto font-medium tracking-wide drop-shadow-md">
          Get updates on auditions, upcoming shows, and behind-the-scenes stories.
        </p>
        
        <!-- Glassmorphism Form Container -->
        <div class="backdrop-blur-2xl bg-stage-900/30 border border-stage-500/20 p-2 sm:p-3 rounded-2xl shadow-2xl shadow-brand-900/20 max-w-md mx-auto transform transition-transform hover:scale-[1.01]">
          <form 
            action="https://fluxtheatre.us11.list-manage.com/subscribe/post?u=c140115304951f2b16fb2ffde&amp;id=5fdf6f58f7&amp;f_id=00c9dfe3f0" 
            method="post" 
            id="mc-embedded-subscribe-form" 
            name="mc-embedded-subscribe-form" 
            class="flex flex-col sm:flex-row gap-3 relative" 
            target="_blank"
          >
            <input type="email" name="EMAIL" placeholder="your@email.com" class="flex-1 px-5 py-4 rounded-xl bg-stage-950/50 border border-stage-700/50 text-stage-50 placeholder-stage-400 focus:outline-none focus:ring-2 focus:ring-brand-400/50 transition-all text-lg shadow-inner" id="mce-EMAIL" required />
            <!-- Anti-bot honeypot -->
            <div style="position: absolute; left: -5000px;" aria-hidden="true">
              <input type="text" name="b_c140115304951f2b16fb2ffde_5fdf6f58f7" tabindex="-1" value="">
            </div>
            <button type="submit" name="subscribe" class="bg-brand-500 hover:bg-brand-400 text-stage-950 font-bold px-8 py-4 rounded-xl transition-all hover:shadow-[0_0_20px_rgba(255,85,51,0.4)] active:scale-95 whitespace-nowrap text-lg" id="mc-embedded-subscribe">
              Subscribe
            </button>
          </form>
        </div>
      </div>
    </section>
  </div>
</template>

<style scoped>
/* ── Hero Carousel ── */
.hero-slide {
  opacity: 0;
  transition: opacity 1s ease-in-out;
  pointer-events: none;
}
.hero-slide--active {
  opacity: 1;
  pointer-events: auto;
}

/* Slide content animates in when active */
.hero-slide__content {
  opacity: 0;
  transform: translateY(16px);
  transition: opacity 0.8s ease 0.3s, transform 0.8s ease 0.3s;
}
.hero-slide__content--active {
  opacity: 1;
  transform: translateY(0);
}

/* Arrow buttons */
.hero-arrow {
  transition: transform 0.2s, opacity 0.2s;
  opacity: 0.7;
}
.hero-arrow:hover {
  opacity: 1;
  transform: translateY(-50%) scale(1.1);
}

/* Nav dots */
.hero-dot {
  width: 8px;
  height: 8px;
  border-radius: 50%;
  background: rgba(255,255,255,0.35);
  border: none;
  cursor: pointer;
  transition: background 0.3s, transform 0.3s;
}
.hero-dot--active {
  background: white;
  transform: scale(1.3);
}

/* Static hero title gradient spans */
.hero-title-dynamic :deep(span) {
  @apply bg-gradient-to-r from-brand-400 to-brand-200 bg-clip-text text-transparent;
}

/* Artistic Mesh Gradient Orbs */
.orb {
  position: absolute;
  border-radius: 50%;
  filter: blur(80px);
  animation: float 20s infinite alternate ease-in-out;
}

.orb-1 {
  width: 60%;
  height: 120%;
  top: -20%;
  left: -10%;
  transform-origin: center right;
  animation-duration: 25s;
}

.orb-2 {
  width: 80%;
  height: 150%;
  bottom: -40%;
  right: -20%;
  transform-origin: bottom left;
  animation-duration: 28s;
  animation-delay: -5s;
}

.orb-3 {
  width: 50%;
  height: 100%;
  top: 10%;
  left: 20%;
  transform-origin: center center;
  animation-duration: 22s;
  animation-delay: -10s;
}

@keyframes float {
  0% { transform: translate(0, 0) scale(1) rotate(0deg); }
  33% { transform: translate(5%, 5%) scale(1.05) rotate(5deg); }
  66% { transform: translate(-5%, -2%) scale(0.95) rotate(-3deg); }
  100% { transform: translate(-2%, 5%) scale(1.1) rotate(2deg); }
}
</style>

