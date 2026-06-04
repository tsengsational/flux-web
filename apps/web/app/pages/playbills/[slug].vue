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
              cast_credits_id: [
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
              crew_credits_id: [
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
              funder_id: ['name', 'slug', 'image', 'url']
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
    if (import.meta.server) {
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
const displayedTab = ref<Tab>('about');
const isFlipping = ref(false);

// Synchronize tab selection with the URL hash so it persists through refreshes & HMR
onMounted(() => {
  const hash = window.location.hash.replace('#', '');
  if (hash === 'credits' || hash === 'support' || hash === 'about') {
    activeTab.value = hash as Tab;
    displayedTab.value = hash as Tab;
  }
});

watch(activeTab, async (newTab, oldTab) => {
  if (newTab === oldTab) return;
  
  // Trigger physical 3D page flip
  isFlipping.value = true;
  // Wait for page to curl/rotate to perpendicular (90deg) at the midpoint (300ms)
  await new Promise(resolve => setTimeout(resolve, 300));
  displayedTab.value = newTab;
  
  // Wait for next tick so that the target tab element is fully rendered on the DOM
  await nextTick();
  
  // Now that the element exists (e.g. #credits), update the URL hash smoothly without triggering blank page router jumps!
  if (import.meta.client) {
    window.location.hash = newTab;
  }
  
  // Wait for page to settle flat (another 300ms)
  await new Promise(resolve => setTimeout(resolve, 300));
  isFlipping.value = false;
});

// ── Credits Processing ──
const cast = computed(() => {
  if (!playbill.value?.cast_credits) return [];
  return playbill.value.cast_credits
    .map((c: any) => c.cast_credits_id)
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
    .map((c: any) => c.crew_credits_id)
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
  
  // Custom display ordering for departments: direction first, then designers, then production team
  const deptOrder = [
    'direction',
    'scenic',
    'lighting',
    'sound',
    'costumes',
    'props',
    'production',
    'stage_management',
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
    .map((f: any) => f.funder_id)
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
  <div v-if="playbill" class="playbill-view min-h-screen pb-24 font-sans flex flex-col items-center">
    
    <!-- Top Back Link Navigation Bar -->
    <div class="playbill-view__top-bar w-full border-b border-stage-900 bg-[#0e0c0a]/90 sticky top-0 z-40 backdrop-blur-md">
      <div class="playbill-view__top-bar-container max-w-5xl mx-auto px-6 py-3.5 flex items-center justify-between">
        <NuxtLink :to="parentLink.url" class="playbill-view__back-link group flex items-center gap-2 text-xs font-bold text-stage-400 hover:text-brand-400 transition-colors uppercase tracking-widest">
          <svg class="playbill-view__back-link-icon w-4 h-4 transition-transform group-hover:-translate-x-1" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2.5">
            <path stroke-linecap="round" stroke-linejoin="round" d="M15.75 19.5L8.25 12l7.5-7.5" />
          </svg>
          {{ parentLink.label }}
        </NuxtLink>
        
        <span class="playbill-view__official-badge text-[10px] uppercase font-black tracking-[0.2em] text-brand-500 border border-brand-500/40 px-3 py-1 rounded">
          Official Digital Playbill
        </span>
      </div>
    </div>

    <!-- Immersive Skeuomorphic Booklet Table Container -->
    <div class="playbill-table w-full max-w-5xl px-4 md:px-8 mt-8 flex justify-center">
      <div class="playbill-book relative w-full flex flex-col md:flex-row items-stretch rounded-2xl shadow-[0_50px_100px_-20px_rgba(0,0,0,0.85)]">
        
        <!-- Interactive 3D Central Booklet Spine (Desktop Only) -->
        <div class="playbill-book__spine hidden md:block"></div>

        <!-- 📖 LEFT PAGE: STATIC COVER & FRONT MATTERS (Desktop Only) -->
        <div class="playbill-book__page playbill-book__page--left hidden md:flex flex-col paper-texture p-8 flex-1 border-r border-[#d4d0b8]">
          <div class="playbill-book__inner flex flex-col h-full justify-between">
            
            <!-- Cover Header -->
            <header class="playbill-book__header text-center pt-4">
              <div class="playbill-book__header-decor flex flex-col items-center justify-center gap-2 mb-4">
                <div class="playbill-book__decor-line w-12 h-[3px] bg-[#1c1c15] mb-1" />
                <p v-if="playbill.supertitle" class="playbill-book__supertitle text-[10px] uppercase tracking-[0.25em] font-black text-[#6b664d] leading-none">
                  {{ playbill.supertitle }}
                </p>
                <div class="playbill-book__decor-divider w-full h-[3px] border-t border-b border-[#1c1c15] mt-1.5" />
              </div>

              <h1 class="playbill-book__title text-3xl lg:text-4xl font-serif font-black tracking-tight leading-tight text-[#1c1c15] mt-3 mb-2">
                {{ playbill.title }}
              </h1>

              <p v-if="playbill.subtitle" class="playbill-book__subtitle text-md font-serif italic text-[#4a4632] leading-relaxed max-w-md mx-auto mb-4">
                {{ playbill.subtitle }}
              </p>

              <!-- Byline & Director details -->
              <div class="playbill-book__meta flex flex-col gap-1 items-center justify-center text-xs font-serif text-[#6b664d] py-2.5 border-t border-b border-dashed border-[#c5c1a8] my-4">
                <span v-if="playbill.byline" class="font-bold font-sans tracking-wide uppercase text-[10px] text-[#1c1c15]">{{ playbill.byline }}</span>
                <span v-if="playbill.director" class="italic">{{ playbill.director }}</span>
              </div>
            </header>

            <!-- Centered Hero Specimen Box -->
            <div v-if="playbill.hero_image" class="playbill-book__hero-container relative border border-[#c5c1a8] bg-[#ebe8dd] my-4 flex items-center justify-center overflow-hidden">
              <img
                v-bind="getImageProps(playbill.hero_image, { sm: 600, md: 800 }, { quality: 85 })"
                :alt="playbill.title"
                class="playbill-book__hero-image w-full max-h-[280px] object-contain opacity-95 contrast-110"
              />
              <div class="playbill-book__hero-shading absolute inset-0 pointer-events-none" />
            </div>

            <!-- Page Number Footer -->
            <footer class="playbill-book__footer flex items-center justify-between text-[10px] uppercase font-bold tracking-widest text-[#8c8872] pt-4 mt-auto border-t border-[#ebe8dd]">
              <span>Flux Theatre Ensemble</span>
              <span>Page I</span>
            </footer>
          </div>
        </div>

        <!-- 📖 RIGHT PAGE: DYNAMIC PAGES WITH 3D FLIP (Desktop & Mobile) -->
        <div 
          class="playbill-book__page playbill-book__page--right flex flex-col paper-texture p-6 md:p-8 flex-1 relative"
          :class="{ 'playbill-book__page--flipping': isFlipping }"
        >
          
          <!-- Physical Paper Tab Headers -->
          <nav class="playbill-book__tabs-nav sticky top-[48px] flex items-center gap-1.5 -mx-6 md:-mx-8 -mt-6 md:-mt-8 px-6 md:px-8 pt-6 md:pt-8 pb-3 mb-6 bg-[#fcf9ee] z-30 border-b border-[#ebe8dd]/60">
            <button
              @click="activeTab = 'about'"
              class="playbill-book__tab-card flex-1 pt-3.5 pb-2 rounded-b-xl text-center text-[10px] uppercase font-black tracking-widest transition-all duration-300 border-t-0"
              :class="[
                activeTab === 'about'
                  ? 'playbill-book__tab-card--active shadow-md text-[#1c1c15] font-black'
                  : 'playbill-book__tab-card--inactive text-[#6b664d] hover:text-[#1c1c15]'
              ]"
            >
              Program
            </button>
            <button
              @click="activeTab = 'credits'"
              class="playbill-book__tab-card flex-1 pt-3.5 pb-2 rounded-b-xl text-center text-[10px] uppercase font-black tracking-widest transition-all duration-300 border-t-0"
              :class="[
                activeTab === 'credits'
                  ? 'playbill-book__tab-card--active shadow-md text-[#1c1c15] font-black'
                  : 'playbill-book__tab-card--inactive text-[#6b664d] hover:text-[#1c1c15]'
              ]"
            >
              Credits
            </button>
            <button
              @click="activeTab = 'support'"
              class="playbill-book__tab-card flex-1 pt-3.5 pb-2 rounded-b-xl text-center text-[10px] uppercase font-black tracking-widest transition-all duration-300 border-t-0"
              :class="[
                activeTab === 'support'
                  ? 'playbill-book__tab-card--active shadow-md text-[#1c1c15] font-black'
                  : 'playbill-book__tab-card--inactive text-[#6b664d] hover:text-[#1c1c15]'
              ]"
            >
              Sponsors
            </button>
          </nav>

          <div class="playbill-book__inner flex flex-col h-full justify-between">
            <div class="playbill-book__page-content flex-1">
              
              <!-- 📱 MOBILE ONLY FRONT MATTER HEADER -->
              <header class="playbill-book__mobile-header block md:hidden text-center pb-6 border-b border-[#ebe8dd] mb-6" v-if="displayedTab === 'about'">
                <h1 class="playbill-book__title text-3xl font-serif font-black tracking-tight leading-tight text-[#1c1c15] mb-2">
                  {{ playbill.title }}
                </h1>
                <p v-if="playbill.subtitle" class="playbill-book__subtitle text-sm font-serif italic text-[#4a4632] leading-relaxed mb-3">
                  {{ playbill.subtitle }}
                </p>
                <div v-if="playbill.hero_image" class="playbill-book__hero-container relative border border-[#c5c1a8] bg-[#ebe8dd] mb-4 flex items-center justify-center overflow-hidden">
                  <img
                    v-bind="getImageProps(playbill.hero_image, { sm: 600 }, { quality: 80 })"
                    :alt="playbill.title"
                    class="playbill-book__hero-image w-full max-h-[220px] object-contain opacity-95 contrast-110"
                  />
                  <div class="playbill-book__hero-shading absolute inset-0 pointer-events-none" />
                </div>
                <div class="text-[10px] font-sans font-bold tracking-widest text-[#1c1c15] uppercase">
                  {{ playbill.byline }} • {{ playbill.director }}
                </div>
              </header>

              <!-- ABOUT / CONTENT PAGE -->
              <div v-if="displayedTab === 'about'" id="about" class="playbill-book__pane space-y-6">
                <!-- Associated Production/Event Glass Card -->
                <div v-if="playbill.production || playbill.event" class="playbill-book__promo p-5 rounded-xl border border-[#c5c1a8]/60 bg-[#ffffff]/60 flex items-start gap-4 shadow-sm">
                  <div class="playbill-book__promo-icon w-9 h-9 rounded-lg bg-[#1c1c15]/5 border border-[#1c1c15]/20 flex items-center justify-center text-[#1c1c15] flex-shrink-0">
                    <svg class="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
                      <path stroke-linecap="round" stroke-linejoin="round" d="M16.5 6v.75m0 3v.75m0 3v.75m0 3V18m-9-5.25h5.25M7.5 15h3M3.375 5.25c-.621 0-1.125.504-1.125 1.125v3.026a2.999 2.999 0 010 5.198v3.026c0 .621.504 1.125 1.125 1.125h17.25c.621 0 1.125-.504 1.125-1.125v-3.026a2.999 2.999 0 010-5.198V6.375c0-.621-.504-1.125-1.125-1.125H3.375z" />
                    </svg>
                  </div>
                  <div class="playbill-book__promo-body">
                    <h4 class="text-[9px] uppercase tracking-[0.2em] font-black text-[#6b664d]">Flux Presentation</h4>
                    <p class="text-xs font-semibold text-[#1c1c15] mt-1 leading-normal">
                      This digital playbill is for the presentation of 
                      <span class="font-serif italic font-bold text-[#1c1c15]">{{ playbill.production ? (playbill.production as any).title : (playbill.event as any).title }}</span>.
                    </p>
                  </div>
                </div>

                <!-- Structured Content Block Renderer -->
                <div v-if="playbill.content" class="playbill-book__rich-content prose prose-stone prose-sm max-w-none text-[#1c1c15]">
                  <BlockRenderer :content="playbill.content" />
                </div>
                <div v-else class="text-center py-12 border border-dashed border-[#c5c1a8] rounded-xl bg-[#ffffff]/30">
                  <p class="text-xs text-[#8c8872] italic font-serif">Welcome to our Digital Playbill. Tap on the Credits or Sponsors tabs above to explore.</p>
                </div>
              </div>

              <!-- CREDITS PAGE -->
              <div v-else-if="displayedTab === 'credits'" id="credits" class="playbill-book__pane space-y-8">
                
                <!-- CAST SECTION -->
                <div v-if="cast.length" class="playbill-book__section">
                  <div class="playbill-book__section-header flex items-center justify-between border-b-2 border-[#1c1c15] pb-2 mb-4">
                    <h2 class="text-xl font-serif font-black text-[#1c1c15] tracking-wide">
                      Cast
                    </h2>
                    <span class="text-[9px] uppercase tracking-widest font-black text-[#6b664d]">
                      Company
                    </span>
                  </div>
                  
                  <div class="playbill-book__credits-list space-y-2">
                    <button
                      v-for="credit in cast"
                      :key="credit.id"
                      @click="openBioModal(credit, true)"
                      class="playbill-book__credit-card relative w-full text-left p-3.5 rounded-xl border border-[#c5c1a8] hover:border-[#1c1c15] hover:bg-[#ffffff] hover:shadow-md transition-all duration-300 flex items-center gap-4 group"
                    >
                      <!-- Preload large headshot in background when card scrolls near viewport -->
                      <img
                        v-if="credit.person?.headshot"
                        v-bind="getImageProps(credit.person.headshot, { sm: 400, md: 800 }, { quality: 85 })"
                        class="absolute w-px h-px opacity-0 pointer-events-none"
                        loading="lazy"
                        alt=""
                      />
                      <!-- Headshot Container -->
                      <div class="w-10 h-10 rounded-lg overflow-hidden border border-[#c5c1a8] group-hover:border-[#1c1c15] transition-colors bg-[#ebe8dd] flex-shrink-0 shadow-inner">
                        <img
                          v-if="credit.person?.headshot"
                          v-bind="getImageProps(credit.person.headshot, { sm: 100 }, { quality: 70 })"
                          :alt="credit.person.first_name"
                          class="w-full h-full object-contain brightness-95 transition-all duration-300"
                          loading="lazy"
                        />
                        <div v-else class="w-full h-full flex items-center justify-center bg-[#c5c1a8]/40 text-[#6b664d] font-serif font-bold text-sm">
                          {{ credit.person?.first_name?.[0] || 'A' }}
                        </div>
                      </div>

                      <div class="flex-1 min-w-0">
                        <p class="font-serif font-bold text-sm text-[#1c1c15] group-hover:text-[#682805] transition-colors leading-tight">
                          {{ credit.person?.first_name || '' }} {{ credit.person?.last_name || '' }}
                        </p>
                        <p v-if="credit.person?.pronouns" class="text-[9px] text-[#6b664d] font-medium mt-0.5">({{ credit.person.pronouns }})</p>
                      </div>

                      <div class="text-right min-w-[35%]">
                        <p class="text-xs font-bold font-serif italic text-[#1c1c15]">{{ credit.role_name }}</p>
                        <p v-if="credit.is_understudy" class="text-[8px] font-black text-[#682805] uppercase tracking-widest mt-0.5">Understudy</p>
                      </div>
                    </button>
                  </div>
                </div>

                <!-- CREATIVE TEAM / DEPARTMENTS SECTION -->
                <div v-if="crewByDepartment.length" class="playbill-book__section space-y-8 pt-4">
                  <div v-for="dept in crewByDepartment" :key="dept.key" class="space-y-3">
                    <h3 class="text-sm font-bold text-[#682805] uppercase tracking-widest border-b border-[#c5c1a8] pb-1.5">
                      {{ dept.name }}
                    </h3>
                    
                    <div class="grid grid-cols-1 sm:grid-cols-2 gap-2">
                      <button
                        v-for="credit in dept.credits"
                        :key="credit.id"
                        @click="openBioModal(credit, false)"
                        class="playbill-book__credit-card relative w-full text-left p-3 rounded-lg border border-[#c5c1a8] hover:border-[#1c1c15] hover:bg-[#ffffff] hover:shadow-md transition-all duration-300 flex items-center justify-between group"
                      >
                        <!-- Preload large headshot in background when card scrolls near viewport -->
                        <img
                          v-if="credit.person?.headshot"
                          v-bind="getImageProps(credit.person.headshot, { sm: 400, md: 800 }, { quality: 85 })"
                          class="absolute w-px h-px opacity-0 pointer-events-none"
                          loading="lazy"
                          alt=""
                        />
                        <div class="min-w-0 pr-4">
                          <p class="text-[8px] font-black text-[#8c8872] uppercase tracking-widest leading-none">{{ credit.title }}</p>
                          <p class="font-serif font-bold text-sm text-[#1c1c15] group-hover:text-[#682805] transition-colors mt-1.5 truncate">
                            {{ credit.person?.first_name || '' }} {{ credit.person?.last_name || '' }}
                          </p>
                        </div>
                        <svg class="w-3.5 h-3.5 text-[#8c8872] group-hover:text-[#1c1c15] transition-colors flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2.5">
                          <path stroke-linecap="round" stroke-linejoin="round" d="M8.25 4.5l7.5 7.5-7.5 7.5" />
                        </svg>
                      </button>
                    </div>
                  </div>
                </div>

              </div>

              <!-- SUPPORT PAGE -->
              <div v-else-if="displayedTab === 'support'" id="support" class="playbill-book__pane space-y-6 text-center">
                
                <div class="py-4 border-b border-[#ebe8dd] max-w-md mx-auto">
                  <h2 class="text-xl font-serif font-black text-[#1c1c15]">Ensemble Funders</h2>
                  <p class="text-xs text-[#6b664d] mt-1.5 font-serif italic">
                    Made possible through the generous support of our sponsors.
                  </p>
                </div>

                <!-- Funders grid -->
                <div v-if="funders.length" class="grid grid-cols-2 gap-4 max-w-md mx-auto pt-2">
                  <a
                    v-for="funder in funders"
                    :key="funder.slug"
                    :href="funder.url || '#'"
                    target="_blank"
                    class="group flex flex-col items-center justify-center p-4 rounded-xl border border-[#c5c1a8] hover:border-[#1c1c15] hover:bg-[#ffffff] hover:shadow-md transition-all duration-300"
                  >
                    <div class="w-full aspect-square max-h-[80px] bg-[#ffffff] rounded-lg shadow-inner p-3 flex items-center justify-center overflow-hidden border border-[#ebe8dd]">
                      <img
                        v-if="funder.image"
                        v-bind="getImageProps(funder.image, { sm: 200 }, { quality: 80 })"
                        :alt="funder.name"
                        class="w-full h-full object-contain opacity-90 group-hover:opacity-100 transition-all duration-500"
                        loading="lazy"
                      />
                      <span v-else class="text-[#1c1c15] font-serif font-bold text-center text-xs leading-tight">{{ funder.name }}</span>
                    </div>
                    
                    <span class="text-[10px] font-bold text-[#6b664d] mt-2.5 group-hover:text-[#682805] transition-colors uppercase tracking-wider truncate max-w-full">
                      {{ funder.name }}
                    </span>
                  </a>
                </div>

                <div v-else class="py-12 text-[#8c8872] italic font-serif text-sm">
                  Thank you to all who make our works possible.
                </div>

                <!-- Support & CTA card -->
                <div class="playbill-book__cta max-w-md mx-auto p-5 rounded-xl border border-[#c5c1a8] bg-[#ffffff]/60 text-left shadow-sm mt-8">
                  <h3 class="text-md font-serif font-black text-[#1c1c15]">Support the Ensemble</h3>
                  <p class="text-[11px] text-[#6b664d] mt-1.5 leading-relaxed">
                    Flux Theatre Ensemble operates as a collaborative, non-profit community. Your support directly funds local theater makers, playwrights, and accessibility tools.
                  </p>
                  <div class="mt-4 flex items-center gap-3">
                    <a 
                      href="https://fluxtheatre.org/donate" 
                      target="_blank"
                      class="px-4 py-2 rounded-lg bg-[#461600] text-[#ffffff] hover:bg-[#682805] text-[10px] font-black uppercase tracking-wider shadow hover:scale-[1.03] transition-all duration-300"
                    >
                      Donate Now
                    </a>
                    <NuxtLink to="/" class="text-[10px] font-black text-[#6b664d] hover:text-[#1c1c15] transition-colors uppercase tracking-widest">
                      Learn More &rarr;
                    </NuxtLink>
                  </div>
                </div>

              </div>
            </div>

            <!-- Page Number Footer -->
            <footer class="playbill-book__footer flex items-center justify-between text-[10px] uppercase font-bold tracking-widest text-[#8c8872] pt-4 mt-8 border-t border-[#ebe8dd]">
              <span>Official Program</span>
              <span>Page {{ displayedTab === 'about' ? 'II' : (displayedTab === 'credits' ? 'III' : 'IV') }}</span>
            </footer>
          </div>
        </div>

      </div>
    </div>

    <!-- Bio Modal (Uses BaseModal) -->
    <BaseModal :is-open="isModalOpen" max-width="max-w-xl" @close="closeBioModal">
      <div v-if="selectedPerson" class="playbill-modal p-0 overflow-hidden text-left flex flex-col">
        <!-- Full Bleed Headshot at the top of the modal -->
        <div 
          v-if="selectedPerson.headshot"
          class="w-full aspect-[4/5] max-h-[420px] overflow-hidden border-b border-[#c5c1a8] bg-[#ebe8dd]"
        >
          <img
            v-bind="getImageProps(selectedPerson.headshot, { sm: 400, md: 800 }, { quality: 85 })"
            :alt="selectedPerson.name"
            class="w-full h-full object-contain brightness-95 animate-scale-in"
          />
        </div>
        
        <!-- Padded text details and bio underneath -->
        <div class="p-6 md:p-8 flex flex-col">
          <div class="flex flex-col sm:flex-row sm:items-baseline sm:justify-between gap-1 border-b border-[#ebe8dd] pb-2">
            <h3 class="text-2xl font-serif font-bold text-[#1c1c15] tracking-wide">{{ selectedPerson.name }}</h3>
            <span v-if="selectedPerson.pronouns" class="text-[9px] uppercase font-black tracking-widest text-[#8c8872]">
              {{ selectedPerson.pronouns }}
            </span>
          </div>
          
          <p class="text-[10px] font-black tracking-widest text-[#682805] uppercase mt-2">
            {{ selectedPerson.role }}
          </p>
          
          <!-- Bio contents -->
          <div class="mt-4 pt-2 prose prose-stone prose-sm text-[#4a4632] max-w-none leading-relaxed">
            <BlockRenderer v-if="selectedPerson.bio" :content="selectedPerson.bio" />
            <p v-else class="italic text-[#8c8872] text-xs">No biography details added yet.</p>
          </div>
        </div>
      </div>
    </BaseModal>

  </div>
</template>

<style scoped>
/* Immersive Mahogany Tabletop Surface */
.playbill-view {
  background-color: #0d0b09;
  background-image: 
    radial-gradient(rgba(255, 255, 255, 0.02) 1px, transparent 1px),
    linear-gradient(to bottom, #110e0c, #0a0807);
  background-size: 24px 24px, 100% 100%;
}

/* physical Booklet Design */
.playbill-book {
  background-color: #e5e2d8;
  perspective: 2000px;
  transform-style: preserve-3d;
}

/* Realistic Central Fold/Spine cylinder crease */
.playbill-book__spine {
  width: 28px;
  height: 100%;
  position: absolute;
  left: 50%;
  transform: translateX(-50%);
  background: linear-gradient(
    to right, 
    rgba(0, 0, 0, 0.18) 0%, 
    rgba(0, 0, 0, 0.06) 25%, 
    rgba(255, 255, 255, 0.12) 50%, 
    rgba(0, 0, 0, 0.06) 75%, 
    rgba(0, 0, 0, 0.18) 100%
  );
  z-index: 10;
  pointer-events: none;
}

/* Booklet Double Border Retro Frame */
.playbill-book__inner {
  border: 1px double #c5c1a8;
  padding: 1.5rem;
  height: 100%;
  position: relative;
}

/* Warm, textured cream booklet paper base */
.paper-texture {
  background-color: #fcf9ee;
  color: #1c1c15;
  box-shadow: 
    0 15px 35px rgba(0, 0, 0, 0.25), 
    inset 0 0 35px rgba(220, 215, 195, 0.15);
  position: relative;
}

/* Double page custom curvatures */
.playbill-book__page--left {
  border-radius: 6px 0 0 6px;
  box-shadow: 
    -10px 15px 35px rgba(0, 0, 0, 0.3), 
    inset -15px 0 20px rgba(0, 0, 0, 0.05);
}

.playbill-book__page--right {
  border-radius: 0 6px 6px 0;
  transform-origin: left center;
  transition: transform 0.6s cubic-bezier(0.25, 0.46, 0.45, 0.94);
  backface-visibility: hidden;
  box-shadow: 
    10px 15px 35px rgba(0, 0, 0, 0.3), 
    inset 15px 0 20px rgba(0, 0, 0, 0.05);
}

/* 🔄 3D Booklet Page Flip Turn Animation */
@keyframes turn-page {
  0% {
    transform: rotateY(0deg);
    box-shadow: 10px 15px 35px rgba(0, 0, 0, 0.3);
  }
  50% {
    transform: rotateY(-90deg) scale(0.97);
    box-shadow: 25px 25px 60px rgba(0, 0, 0, 0.45);
  }
  100% {
    transform: rotateY(0deg);
    box-shadow: 10px 15px 35px rgba(0, 0, 0, 0.3);
  }
}

.playbill-book__page--flipping {
  animation: turn-page 0.6s cubic-bezier(0.25, 0.46, 0.45, 0.94) forwards;
}

/* Physical index folder paper tabs */
.playbill-book__tab-card {
  border: 1px solid #dcd7c3;
  font-family: sans-serif;
  cursor: pointer;
}

.playbill-book__tab-card--active {
  background-color: #fcf9ee;
  border-bottom-color: transparent;
  color: #1c1c15;
  height: calc(100% + 2px);
  position: relative;
  z-index: 20;
}

.playbill-book__tab-card--inactive {
  background-color: #e5e2d8;
  color: #6b664d;
  opacity: 0.85;
}

/* Booklet Credit and Departmnet speciman items */
.playbill-book__credit-card {
  background-color: #ffffff/40;
  border-color: #dcd7c3;
}

/* Physical paper modal box card */
.playbill-modal {
  background-color: #fcf9ee;
  color: #1c1c15;
  border: 1px double #c5c1a8;
  border-radius: 8px;
  box-shadow: 0 25px 50px -12px rgba(0, 0, 0, 0.5);
}

/* Retro photos styles */

/* Ambient inner picture shadows */
.playbill-book__hero-shading {
  box-shadow: inset 0 0 20px rgba(0, 0, 0, 0.15);
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

