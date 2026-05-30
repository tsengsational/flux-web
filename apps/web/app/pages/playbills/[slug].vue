<script setup lang="ts">
import type { Playbill } from '@flux-theatre/shared';

const route = useRoute();
const slugParam = route.params.slug;
const slug = Array.isArray(slugParam) ? slugParam[0] : slugParam;
const { client, readItems, getAssetUrl, getImageProps } = useDirectus();

// Fetch the playbill from Directus based on slug with deep relations
const { data: playbills, error } = await useAsyncData(`playbill-${slug}`, async () => {
  try {
    const result = await client.request(readItems('playbills' as any, {
      filter: { slug: { _eq: slug }, status: { _eq: 'published' } },
      fields: [
        '*',
        {
          production: ['title', 'slug', 'poster_image'],
          event: ['title', 'slug', 'start_datetime', 'venue', { venue: ['name', 'address', 'city', 'state'] }],
          cast_credits: [
            'sort',
            {
              productions_cast_id: [
                'role_name',
                'content',
                'is_understudy',
                {
                  person: ['first_name', 'last_name', 'slug', 'headshot', 'bio', 'pronouns']
                }
              ]
            }
          ],
          crew_credits: [
            'sort',
            {
              productions_crew_id: [
                'title',
                'content',
                'department',
                {
                  person: ['first_name', 'last_name', 'slug', 'headshot', 'bio', 'pronouns']
                }
              ]
            }
          ],
          funders: [
            'sort',
            {
              funders_id: ['name', 'slug', 'image', 'url']
            }
          ]
        }
      ] as any,
      deep: {
        cast_credits: { _sort: ['sort'] },
        crew_credits: { _sort: ['sort'] },
        funders: { _sort: ['sort'] }
      } as any,
      limit: 1
    } as any)) as any;

    return result;
  } catch (err) {
    if (process.server) {
      console.error(`[SSR Playbill Error] Slug: "${slug}"`, err);
    }
    throw err;
  }
});

const playbill = computed<Playbill | null>(() => playbills.value?.[0] || null);

// Handle 404
if (!playbill.value && !error.value) {
  throw createError({ statusCode: 404, statusMessage: 'Playbill not found' });
}

useSeoMeta({
  title: () => `${playbill.value?.title || 'Playbill'} — Flux Theatre Ensemble`,
  description: () => playbill.value?.subtitle || 'Digital Theatre Playbill',
});

// ── Tab Management ──
type Tab = 'about' | 'credits' | 'support';
const activeTab = ref<Tab>('about');

// ── Credits Processing ──
const cast = computed(() => {
  if (!playbill.value?.cast_credits) return [];
  return playbill.value.cast_credits
    .map((c: any) => c.productions_cast_id)
    .filter(Boolean)
    .map((credit: any) => ({
      ...credit,
      person: {
        ...credit.person,
        bio: credit.content || credit.person?.bio || null
      }
    }));
});

const crew = computed(() => {
  if (!playbill.value?.crew_credits) return [];
  return playbill.value.crew_credits
    .map((c: any) => c.productions_crew_id)
    .filter(Boolean)
    .map((credit: any) => ({
      ...credit,
      person: {
        ...credit.person,
        bio: credit.content || credit.person?.bio || null
      }
    }));
});

// Group crew by department for standard playbill style
const crewByDepartment = computed(() => {
  const departments: Record<string, any[]> = {};
  crew.value.forEach((credit: any) => {
    const dept = credit.department || 'other';
    if (!departments[dept]) {
      departments[dept] = [];
    }
    departments[dept].push(credit);
  });
  
  // Custom display ordering for departments
  const deptOrder = [
    'direction',
    'production',
    'stage_management',
    'scenic',
    'lighting',
    'sound',
    'costumes',
    'props',
    'dramaturgy',
    'marketing',
    'other'
  ];

  return deptOrder
    .map(key => ({
      key,
      name: formatDepartmentName(key),
      credits: departments[key] || []
    }))
    .filter(d => d.credits.length > 0);
});

function formatDepartmentName(key: string): string {
  const names: Record<string, string> = {
    direction: 'Direction & Playwriting',
    production: 'Production Team',
    stage_management: 'Stage Management',
    scenic: 'Scenic Design',
    lighting: 'Lighting Design',
    sound: 'Sound Design',
    costumes: 'Costume & Wardrobe',
    props: 'Properties & Stage Dressing',
    dramaturgy: 'Dramaturgy & Literary',
    marketing: 'Marketing & Press',
    other: 'Special Thanks & Staff'
  };
  return names[key] || 'Production Team';
}

const funders = computed(() => {
  if (!playbill.value?.funders) return [];
  return playbill.value.funders
    .map((f: any) => f.funders_id)
    .filter(Boolean);
});

// ── Back Links ──
const parentLink = computed(() => {
  if (playbill.value?.production && typeof playbill.value.production === 'object') {
    return {
      url: `/productions/${playbill.value.production.slug}`,
      label: `Production: ${playbill.value.production.title}`
    };
  }
  if (playbill.value?.event && typeof playbill.value.event === 'object') {
    return {
      url: `/events/${playbill.value.event.slug}`,
      label: `Event: ${playbill.value.event.title}`
    };
  }
  return { url: '/', label: 'Home' };
});

// ── Bio Modal ──
const isModalOpen = ref(false);
const selectedPerson = ref<{
  name: string;
  role: string;
  pronouns?: string | null;
  headshot?: string | null;
  bio?: any;
} | null>(null);

function openBioModal(credit: any, isCast: boolean) {
  selectedPerson.value = {
    name: `${credit.person?.first_name || ''} ${credit.person?.last_name || ''}`.trim(),
    role: isCast ? credit.role_name : credit.title,
    pronouns: credit.person?.pronouns,
    headshot: credit.person?.headshot,
    bio: credit.person?.bio
  };
  isModalOpen.value = true;
}

function closeBioModal() {
  isModalOpen.value = false;
  selectedPerson.value = null;
}
</script>

<template>
  <div v-if="playbill" class="playbill-view min-h-screen bg-stage-950 text-stage-50 pb-24 font-sans">
    
    <!-- Top Decorative Line & Back Link -->
    <div class="playbill-view__top-bar border-b border-stage-800/60 bg-stage-950/80 sticky top-0 z-40 backdrop-blur-md">
      <div class="playbill-view__top-bar-container max-w-3xl mx-auto px-4 py-3 flex items-center justify-between">
        <NuxtLink :to="parentLink.url" class="playbill-view__back-link group flex items-center gap-2 text-xs font-semibold text-stage-400 hover:text-brand-400 transition-colors uppercase tracking-widest">
          <svg class="playbill-view__back-link-icon w-4 h-4 transition-transform group-hover:-translate-x-1" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2.5">
            <path stroke-linecap="round" stroke-linejoin="round" d="M15.75 19.5L8.25 12l7.5-7.5" />
          </svg>
          {{ parentLink.label }}
        </NuxtLink>
        
        <span class="playbill-view__official-badge text-[10px] uppercase font-bold tracking-widest text-brand-500/80 border border-brand-500/30 px-2 py-0.5 rounded">
          Official Playbill
        </span>
      </div>
    </div>

    <!-- Header Section -->
    <header class="playbill-view__header text-center pt-12 pb-8 max-w-3xl mx-auto px-4">
      <div class="playbill-view__header-decor flex flex-col items-center justify-center gap-2 mb-6">
        <div class="playbill-view__decor-line playbill-view__decor-line--short w-20 h-0.5 bg-brand-500/80" />
        <p v-if="playbill.supertitle" class="playbill-view__header-supertitle text-xs uppercase tracking-[0.25em] font-extrabold text-brand-400 leading-none">
          {{ playbill.supertitle }}
        </p>
        <div class="playbill-view__decor-divider w-full h-px bg-gradient-to-r from-transparent via-stage-800 to-transparent mt-2" />
      </div>

      <h1 class="playbill-view__header-title text-4xl sm:text-5xl lg:text-6xl font-serif font-black tracking-tight leading-tight text-stage-50 mb-4">
        {{ playbill.title }}
      </h1>

      <p v-if="playbill.subtitle" class="playbill-view__header-subtitle text-lg sm:text-xl font-serif italic text-stage-300 leading-relaxed max-w-2xl mx-auto">
        {{ playbill.subtitle }}
      </p>

      <!-- Byline & Director details -->
      <div class="playbill-view__header-meta mt-6 flex flex-col sm:flex-row items-center justify-center gap-2 sm:gap-6 text-sm text-stage-400 font-serif italic border-t border-b border-stage-900/60 py-3 mt-8">
        <span v-if="playbill.byline" class="playbill-view__meta-byline">{{ playbill.byline }}</span>
        <span v-if="playbill.byline && playbill.director" class="playbill-view__meta-dot hidden sm:inline text-stage-700">•</span>
        <span v-if="playbill.director" class="playbill-view__meta-director">{{ playbill.director }}</span>
      </div>
    </header>

    <!-- Hero Image Area -->
    <section v-if="playbill.hero_image" class="playbill-view__hero max-w-2xl mx-auto px-4 mb-10">
      <div class="playbill-view__hero-wrapper relative rounded-2xl overflow-hidden aspect-[16/10] border border-stage-800 shadow-2xl bg-stage-900">
        <img
          v-bind="getImageProps(playbill.hero_image, { sm: 600, md: 800, lg: 1200 }, { quality: 85 })"
          :alt="playbill.title"
          class="playbill-view__hero-image w-full h-full object-cover"
        />
        <div class="playbill-view__hero-overlay absolute inset-0 bg-gradient-to-t from-stage-950/60 via-transparent to-transparent pointer-events-none" />
      </div>
    </section>

    <!-- Premium Mobile Tabs Navigation -->
    <nav class="playbill-view__tabs max-w-md mx-auto px-4 mb-8 sticky top-[49px] z-30 bg-stage-950/95 py-2">
      <div class="playbill-view__tabs-container grid grid-cols-3 bg-stage-900/80 backdrop-blur border border-stage-800/80 rounded-xl p-1 shadow-xl">
        <button
          @click="activeTab = 'about'"
          class="playbill-view__tab-button py-2.5 rounded-lg text-xs font-bold uppercase tracking-wider transition-all duration-300 flex items-center justify-center gap-1.5"
          :class="[
            activeTab === 'about'
              ? 'playbill-view__tab-button--active bg-brand-500 text-stage-950 font-black shadow-md'
              : 'text-stage-400 hover:text-stage-200'
          ]"
        >
          About
        </button>
        <button
          @click="activeTab = 'credits'"
          class="playbill-view__tab-button py-2.5 rounded-lg text-xs font-bold uppercase tracking-wider transition-all duration-300 flex items-center justify-center gap-1.5"
          :class="[
            activeTab === 'credits'
              ? 'playbill-view__tab-button--active bg-brand-500 text-stage-950 font-black shadow-md'
              : 'text-stage-400 hover:text-stage-200'
          ]"
        >
          Credits
        </button>
        <button
          @click="activeTab = 'support'"
          class="playbill-view__tab-button py-2.5 rounded-lg text-xs font-bold uppercase tracking-wider transition-all duration-300 flex items-center justify-center gap-1.5"
          :class="[
            activeTab === 'support'
              ? 'playbill-view__tab-button--active bg-brand-500 text-stage-950 font-black shadow-md'
              : 'text-stage-400 hover:text-stage-200'
          ]"
        >
          Sponsors
        </button>
      </div>
    </nav>

    <!-- Main Content Container -->
    <main class="playbill-view__main max-w-2xl mx-auto px-4">
      <Transition
        mode="out-in"
        enter-active-class="transition duration-200 ease-out"
        enter-from-class="opacity-0 translate-y-2"
        enter-to-class="opacity-100 translate-y-0"
        leave-active-class="transition duration-150 ease-in"
        leave-from-class="opacity-100 translate-y-0"
        leave-to-class="opacity-0 -translate-y-2"
      >
        <!-- ABOUT / CONTENT TAB -->
        <div v-if="activeTab === 'about'" class="playbill-view__pane playbill-view__pane--about space-y-8">
          <!-- Associated Production/Event Glass Card -->
          <div v-if="playbill.production || playbill.event" class="playbill-view__promo-card p-6 rounded-2xl bg-stage-900/40 border border-stage-800/80 card-glass flex items-start gap-4">
            <div class="playbill-view__promo-card-icon-wrapper w-10 h-10 rounded-lg bg-brand-500/10 border border-brand-500/30 flex items-center justify-center text-brand-400 flex-shrink-0">
              <svg class="playbill-view__promo-card-icon w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="1.5">
                <path stroke-linecap="round" stroke-linejoin="round" d="M16.5 6v.75m0 3v.75m0 3v.75m0 3V18m-9-5.25h5.25M7.5 15h3M3.375 5.25c-.621 0-1.125.504-1.125 1.125v3.026a2.999 2.999 0 010 5.198v3.026c0 .621.504 1.125 1.125 1.125h17.25c.621 0 1.125-.504 1.125-1.125v-3.026a2.999 2.999 0 010-5.198V6.375c0-.621-.504-1.125-1.125-1.125H3.375z" />
              </svg>
            </div>
            <div class="playbill-view__promo-card-body">
              <h4 class="playbill-view__promo-card-title text-xs uppercase tracking-widest font-black text-brand-400">Flux Presentation</h4>
              <p class="playbill-view__promo-card-text text-sm font-semibold text-stage-100 mt-1 leading-snug">
                This digital playbill is curated for the ensemble presentation of 
                <span class="playbill-view__promo-card-highlight font-serif italic font-bold">{{ playbill.production ? (playbill.production as any).title : (playbill.event as any).title }}</span>.
              </p>
              <div v-if="playbill.event && typeof playbill.event === 'object'" class="playbill-view__promo-card-meta mt-2 text-xs text-stage-400 flex items-center gap-1.5">
                <svg class="playbill-view__promo-card-meta-icon w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M15 10.5a3 3 0 11-6 0 3 3 0 016 0z" /><path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M19.5 10.5c0 7.142-7.5 11.25-7.5 11.25S4.5 17.642 4.5 10.5a7.5 7.5 0 1115 0z" /></svg>
                <span class="playbill-view__promo-card-meta-text">{{ (playbill.event as any).venue?.name || 'Online' }}</span>
              </div>
            </div>
          </div>

          <!-- Structured Content Block Renderer -->
          <div v-if="playbill.content" class="playbill-view__rich-content prose prose-invert prose-lg max-w-none">
            <BlockRenderer :content="playbill.content" class="playbill-view__block-renderer" />
          </div>
          <div v-else class="playbill-view__empty-state text-center py-12 border border-dashed border-stage-800 rounded-2xl bg-stage-900/20">
            <p class="playbill-view__empty-text text-stage-500 italic font-serif">Welcome to our Digital Playbill. Tap on the Credits or Sponsors tabs above to explore.</p>
          </div>
        </div>

        <!-- CREDITS TAB -->
        <div v-else-if="activeTab === 'credits'" class="playbill-view__pane playbill-view__pane--credits space-y-12">
          
          <!-- CAST SECTION -->
          <div v-if="cast.length" class="playbill-view__cast-section">
            <div class="playbill-view__section-header flex items-center justify-between border-b border-stage-800/80 pb-3 mb-6">
              <h2 class="playbill-view__section-title text-2xl font-serif font-black text-stage-50 tracking-wide flex items-center gap-2">
                Cast
              </h2>
              <span class="playbill-view__section-badge text-xs uppercase tracking-widest font-semibold text-stage-500 bg-stage-900 px-3 py-1 rounded-full border border-stage-800/40">
                In Order of Appearance
              </span>
            </div>
            
            <div class="playbill-view__cast-list space-y-3">
              <button
                v-for="credit in cast"
                :key="credit.id"
                @click="openBioModal(credit, true)"
                class="playbill-view__cast-item-btn w-full text-left p-3 rounded-xl bg-stage-900/30 border border-stage-800/40 hover:bg-stage-800/40 hover:border-brand-500/30 transition-all duration-300 flex items-center gap-4 group"
              >
                <!-- Headshot Circle -->
                <div class="playbill-view__cast-avatar-wrapper w-12 h-12 rounded-full overflow-hidden border border-stage-800 group-hover:border-brand-500/50 transition-colors bg-stage-950 flex-shrink-0">
                  <img
                    v-if="credit.person?.headshot"
                    v-bind="getImageProps(credit.person.headshot, { sm: 100 }, { quality: 70 })"
                    :alt="credit.person.first_name"
                    class="playbill-view__cast-avatar w-full h-full object-cover"
                  />
                  <div v-else class="playbill-view__cast-avatar-placeholder w-full h-full flex items-center justify-center bg-stage-900 text-stage-600 font-serif font-bold text-lg">
                    {{ credit.person?.first_name?.[0] || 'A' }}
                  </div>
                </div>

                <div class="playbill-view__cast-info flex-1 min-w-0">
                  <p class="playbill-view__cast-name font-serif font-bold text-stage-100 group-hover:text-brand-400 transition-colors leading-tight">
                    {{ credit.person?.first_name || '' }} {{ credit.person?.last_name || '' }}
                  </p>
                  <p v-if="credit.person?.pronouns" class="playbill-view__cast-pronouns text-[10px] text-stage-500 mt-0.5">({{ credit.person.pronouns }})</p>
                </div>

                <div class="playbill-view__cast-role-wrapper text-right min-w-[40%]">
                  <p class="playbill-view__cast-role text-sm font-semibold text-stage-200 font-serif italic">{{ credit.role_name }}</p>
                  <p v-if="credit.is_understudy" class="playbill-view__cast-understudy text-[9px] font-bold text-brand-500 uppercase tracking-widest mt-0.5">Understudy</p>
                </div>

                <!-- Open Bio indicator -->
                <div class="playbill-view__cast-arrow-wrapper text-stage-600 group-hover:text-brand-400 transition-colors pl-2">
                  <svg class="playbill-view__cast-arrow-icon w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2.5">
                    <path stroke-linecap="round" stroke-linejoin="round" d="M8.25 4.5l7.5 7.5-7.5 7.5" />
                  </svg>
                </div>
              </button>
            </div>
          </div>

          <!-- CREATIVE TEAM / DEPARTMENTS SECTION -->
          <div v-if="crewByDepartment.length" class="playbill-view__crew-section space-y-10">
            <div v-for="dept in crewByDepartment" :key="dept.key" class="playbill-view__crew-department space-y-4">
              <h3 class="playbill-view__crew-department-title text-lg font-serif font-bold text-brand-400 tracking-wide border-b border-stage-900 pb-2">
                {{ dept.name }}
              </h3>
              
              <div class="playbill-view__crew-grid grid grid-cols-1 sm:grid-cols-2 gap-3">
                <button
                  v-for="credit in dept.credits"
                  :key="credit.id"
                  @click="openBioModal(credit, false)"
                  class="playbill-view__crew-item-btn w-full text-left p-3 rounded-xl bg-stage-900/20 border border-stage-800/40 hover:bg-stage-800/40 hover:border-brand-500/30 transition-all duration-300 flex items-center justify-between group"
                >
                  <div class="playbill-view__crew-info min-w-0 pr-4">
                    <p class="playbill-view__crew-role text-xs font-black text-stage-500 uppercase tracking-widest">{{ credit.title }}</p>
                    <p class="playbill-view__crew-name font-serif font-bold text-stage-100 group-hover:text-brand-400 transition-colors mt-0.5 truncate">
                      {{ credit.person?.first_name || '' }} {{ credit.person?.last_name || '' }}
                    </p>
                  </div>
                  <div class="playbill-view__crew-arrow-wrapper text-stage-600 group-hover:text-brand-400 transition-colors flex-shrink-0">
                    <svg class="playbill-view__crew-arrow-icon w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2.5">
                      <path stroke-linecap="round" stroke-linejoin="round" d="M8.25 4.5l7.5 7.5-7.5 7.5" />
                    </svg>
                  </div>
                </button>
              </div>
            </div>
          </div>

        </div>

        <!-- SUPPORT / SPONSORS TAB -->
        <div v-else-if="activeTab === 'support'" class="playbill-view__pane playbill-view__pane--support space-y-8 text-center">
          
          <div class="playbill-view__support-header py-6 border-b border-stage-800/60 max-w-lg mx-auto">
            <h2 class="playbill-view__support-title text-2xl font-serif font-black text-stage-100">Ensemble Funders</h2>
            <p class="playbill-view__support-subtitle text-sm text-stage-400 mt-2 font-serif italic">
              Our productions, workshops, and playbills are made possible through the generous support of our sponsors.
            </p>
          </div>

          <!-- Funders grid -->
          <div v-if="funders.length" class="playbill-view__funders-grid grid grid-cols-2 gap-6 max-w-lg mx-auto pt-4">
            <a
              v-for="funder in funders"
              :key="funder.slug"
              :href="funder.url || '#'"
              target="_blank"
              class="playbill-view__funder-card group flex flex-col items-center justify-center p-6 rounded-2xl bg-stage-900/30 border border-stage-800/50 hover:border-brand-500/40 hover:bg-stage-900/60 transition-all duration-300 shadow-lg"
            >
              <div class="playbill-view__funder-logo-wrapper w-full aspect-square max-h-[100px] bg-white rounded-xl shadow p-4 flex items-center justify-center overflow-hidden border border-stage-800/10 group-hover:border-brand-500/20 transition-colors">
                <img
                  v-if="funder.image"
                  v-bind="getImageProps(funder.image, { sm: 200 }, { quality: 80 })"
                  :alt="funder.name"
                  class="playbill-view__funder-logo w-full h-full object-contain grayscale group-hover:grayscale-0 transition-all duration-500"
                />
                <span v-else class="playbill-view__funder-fallback-name text-stage-900 font-serif font-bold text-center text-sm leading-tight">{{ funder.name }}</span>
              </div>
              
              <span class="playbill-view__funder-name text-xs font-semibold text-stage-400 mt-3 group-hover:text-brand-400 transition-colors">
                {{ funder.name }}
              </span>
            </a>
          </div>

          <div v-else class="playbill-view__funders-empty py-12 text-stage-500 italic font-serif">
            Thank you to all who make our works possible.
          </div>

          <!-- Support & CTA card -->
          <div class="playbill-view__cta-card max-w-md mx-auto p-6 rounded-2xl bg-gradient-to-br from-stage-900 to-stage-950 border border-stage-800 shadow-xl mt-12 text-left">
            <h3 class="playbill-view__cta-title text-lg font-serif font-black text-stage-50">Support the Ensemble</h3>
            <p class="playbill-view__cta-text text-xs text-stage-400 mt-2 leading-relaxed">
              Flux Theatre Ensemble operates as a collaborative, non-profit community. Your support directly funds local theater makers, playwrights, accessibility tools, and digital programs like this playbill.
            </p>
            <div class="playbill-view__cta-buttons mt-5 flex items-center gap-3">
              <a 
                href="https://fluxtheatre.org/donate" 
                target="_blank"
                class="playbill-view__cta-btn playbill-view__cta-btn--primary px-5 py-2.5 rounded-lg bg-brand-500 text-stage-950 text-xs font-bold uppercase tracking-wider shadow-lg hover:scale-105 hover:bg-brand-400 transition-all duration-300"
              >
                Donate Now
              </a>
              <NuxtLink to="/" class="playbill-view__cta-link text-xs font-semibold text-stage-400 hover:text-brand-400 transition-colors">
                Learn More &rarr;
              </NuxtLink>
            </div>
          </div>

        </div>
      </Transition>
    </main>

    <!-- Bio Modal (Uses BaseModal) -->
    <BaseModal :is-open="isModalOpen" max-width="max-w-xl" class="playbill-view__modal" @close="closeBioModal">
      <div v-if="selectedPerson" class="playbill-view__modal-body p-6 md:p-8 flex flex-col sm:flex-row gap-6 sm:items-start text-left">
        <!-- Headshot -->
        <div 
          v-if="selectedPerson.headshot"
          class="playbill-view__modal-avatar-wrapper w-28 h-28 sm:w-36 sm:h-44 rounded-xl overflow-hidden border border-stage-800/80 shadow-lg bg-stage-950 flex-shrink-0 mx-auto sm:mx-0"
        >
          <img
            v-bind="getImageProps(selectedPerson.headshot, { sm: 200 }, { quality: 85 })"
            :alt="selectedPerson.name"
            class="playbill-view__modal-avatar w-full h-full object-cover animate-scale-in"
          />
        </div>
        
        <!-- Text details -->
        <div class="playbill-view__modal-info flex-1 min-w-0">
          <div class="playbill-view__modal-header flex flex-col sm:flex-row sm:items-baseline sm:justify-between gap-1">
            <h3 class="playbill-view__modal-name text-2xl font-serif font-bold text-stage-50 tracking-wide">{{ selectedPerson.name }}</h3>
            <span v-if="selectedPerson.pronouns" class="playbill-view__modal-pronouns text-[10px] uppercase font-black tracking-widest text-stage-500">
              {{ selectedPerson.pronouns }}
            </span>
          </div>
          
          <p class="playbill-view__modal-role text-xs font-black tracking-wider text-brand-400 uppercase mt-1">
            {{ selectedPerson.role }}
          </p>
          
          <!-- Bio contents -->
          <div class="playbill-view__modal-bio mt-4 pt-4 border-t border-stage-800/40 prose prose-invert prose-sm text-stage-300 max-w-none leading-relaxed">
            <BlockRenderer v-if="selectedPerson.bio" :content="selectedPerson.bio" class="playbill-view__modal-bio-renderer" />
            <p v-else class="playbill-view__modal-bio-empty italic text-stage-500">No biography override or details added yet.</p>
          </div>
        </div>
      </div>
    </BaseModal>

  </div>
</template>

<style scoped>
.playbill-view {
  background-color: #0c0a09; /* stone-950 / stage-950 base */
}

/* Animations for modal popup scale */
.animate-scale-in {
  animation: scale-in 0.3s cubic-bezier(0.16, 1, 0.3, 1) forwards;
}

@keyframes scale-in {
  from {
    opacity: 0;
    transform: scale(0.96) translateY(5px);
  }
  to {
    opacity: 1;
    transform: scale(1) translateY(0);
  }
}
</style>
