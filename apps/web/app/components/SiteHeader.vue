<script setup lang="ts">
import type { NavigationItem } from '@flux-theatre/shared';

const { client, readItems } = useDirectus();
const isMenuOpen = ref(false);
const activeDropdown = ref<string | null>(null);
const activeAccordion = ref<string | null>(null);

// Fetch all navigation items
const { data: allNavItems } = await useAsyncData('navigation', () => 
  client.request(readItems('navigation' as any, {
    sort: ['sort'],
    fields: [
      'id', 'label', 'url', 'sort', 'is_external', 
      { parent: ['id'] },
      { page: ['slug'] }
    ]
  } as any))
);

// Transform flat list into a tree structure
const navTree = computed(() => {
  const rawData = allNavItems.value;
  if (!rawData) return [];
  
  // Directus SDK can return the array directly or wrapped in a data property
  const rawItems = Array.isArray(rawData) ? rawData : (rawData as any).data;
  if (!Array.isArray(rawItems)) return [];
  
  const items = rawItems.map(item => {
    // Resolve URL: Page slug takes priority over manual URL
    let resolvedUrl = item.url;
    if (item.page?.slug) {
      resolvedUrl = `/${item.page.slug}`;
    }

    return { 
      ...item, 
      url: resolvedUrl,
      children: [] as any[] 
    };
  });
  
  const rootItems: any[] = [];
  const itemMap = new Map();
  
  // First pass: populate the map
  items.forEach(item => {
    if (item.id) {
      itemMap.set(item.id.toString(), item);
    }
  });
  
  // Second pass: build the tree
  items.forEach(item => {
    const parentField = item.parent;
    if (parentField) {
      // Handle both UUID string and object { id: UUID }
      const parentId = (typeof parentField === 'string' ? parentField : parentField.id)?.toString();
      const parentItem = parentId ? itemMap.get(parentId) : null;
      
      if (parentItem) {
        parentItem.children.push(item);
      } else {
        // Fallback: if parent is defined but not found in the set, treat as root to avoid losing the item
        rootItems.push(item);
      }
    } else {
      rootItems.push(item);
    }
  });
  
  return rootItems as NavigationItem[];
});

const staticNav: NavigationItem[] = [
  { id: 'static-home', label: 'Home', url: '/', sort: 0, parent: null, children: [], is_external: false, page: null },
  { id: 'static-productions', label: 'Productions', url: '/productions', sort: 1, parent: null, children: [], is_external: false, page: null },
  { id: 'static-events', label: 'Events', url: '/events', sort: 2, parent: null, children: [], is_external: false, page: null },
  
  { id: 'static-news', label: 'News', url: '/news', sort: 5, parent: null, children: [], is_external: false, page: null },
  { id: 'static-creative-partners', label: 'Creative Partners', url: '/groups/creative-partners', sort: 3, parent: null, children: [], is_external: false, page: null },
];


const combinedNav = computed(() => {
  return [...staticNav, ...navTree.value];
});

function toggleMenu() {
  isMenuOpen.value = !isMenuOpen.value;
  activeAccordion.value = null;
}

function toggleAccordion(id: string) {
  activeAccordion.value = activeAccordion.value === id ? null : id;
}

// Close dropdowns when clicking outside
if (import.meta.client) {
  window.addEventListener('click', (e) => {
    if (!(e.target as HTMLElement).closest('.nav-dropdown-trigger')) {
      activeDropdown.value = null;
    }
  });
}
</script>

<template>
  <header class="site-header fixed top-0 inset-x-0 z-50 border-b border-stage-800/60 bg-stage-950/80 backdrop-blur-xl">
    <div class="site-header__container max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      <div class="site-header__wrapper flex items-center justify-between h-16 lg:h-20">
        <!-- Logo -->
        <NuxtLink to="/" class="site-header__logo flex items-center gap-3 group" id="site-logo">
          <img src="/logo.svg" alt="Flux Theatre Ensemble" class="h-10 w-auto group-hover:opacity-90 transition-opacity" />
        </NuxtLink>

        <!-- Desktop Nav -->
        <nav class="site-header__nav site-header__nav--desktop hidden lg:flex items-center gap-1" id="desktop-nav">
          <div v-for="item in combinedNav" :key="item.id" class="site-header__nav-item relative">
            <!-- Simple Link -->
            <NuxtLink
              v-if="!item.children.length"
              :to="item.url || '#'"
              :target="item.is_external ? '_blank' : undefined"
              class="site-header__nav-link px-4 py-2 rounded-lg text-sm font-medium text-stage-300 hover:text-brand-400 hover:bg-stage-800/50 transition-all duration-200"
              active-class="site-header__nav-link--active !text-brand-400 bg-stage-800/50"
            >
              {{ item.label }}
            </NuxtLink>

            <!-- Dropdown -->
            <template v-else>
              <button
                @mouseenter="activeDropdown = item.id"
                class="site-header__dropdown-trigger nav-dropdown-trigger px-4 py-2 rounded-lg text-sm font-medium text-stage-300 hover:text-brand-400 hover:bg-stage-800/50 transition-all duration-200 flex items-center gap-1"
                :class="{ 'site-header__dropdown-trigger--active text-brand-400 bg-stage-800/50': activeDropdown === item.id }"
              >
                {{ item.label }}
                <svg class="site-header__dropdown-icon w-4 h-4 transition-transform duration-200" :class="{ 'rotate-180': activeDropdown === item.id }" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 9l-7 7-7-7" />
                </svg>
              </button>

              <Transition
                enter-active-class="transition duration-200 ease-out"
                enter-from-class="opacity-0 translate-y-1"
                enter-to-class="opacity-100 translate-y-0"
                leave-active-class="transition duration-150 ease-in"
                leave-from-class="opacity-100 translate-y-0"
                leave-to-class="opacity-0 translate-y-1"
              >
                <div
                  v-if="activeDropdown === item.id"
                  @mouseleave="activeDropdown = null"
                  class="site-header__dropdown-menu absolute left-0 mt-1 w-48 rounded-xl bg-stage-900 border border-stage-800/60 shadow-2xl p-1.5 z-50 backdrop-blur-xl"
                >
                  <NuxtLink
                    v-for="child in item.children"
                    :key="child.id"
                    :to="child.url || '#'"
                    :target="child.is_external ? '_blank' : undefined"
                    class="site-header__dropdown-link block px-3 py-2 rounded-lg text-sm font-medium text-stage-400 hover:text-brand-400 hover:bg-stage-800/50 transition-all"
                    active-class="site-header__dropdown-link--active !text-brand-400"
                    @click="activeDropdown = null"
                  >
                    {{ child.label }}
                  </NuxtLink>
                </div>
              </Transition>
            </template>
          </div>
        </nav>

        <!-- CTA + Mobile Toggle -->
        <div class="site-header__actions flex items-center gap-3">
          <NuxtLink to="/productions" class="site-header__cta btn-primary text-brand-400 hover:text-brand-200 transition-colors hidden sm:inline-flex" id="header-cta">
            Get Tickets
          </NuxtLink>
          <button
            class="site-header__mobile-toggle lg:hidden p-2 rounded-lg text-stage-300 hover:text-stage-100 hover:bg-stage-800/50 transition-colors"
            id="mobile-menu-toggle"
            @click="toggleMenu"
            :aria-expanded="isMenuOpen"
            aria-label="Toggle menu"
          >
            <svg class="site-header__mobile-icon w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="1.5">
              <path v-if="!isMenuOpen" stroke-linecap="round" stroke-linejoin="round" d="M3.75 9h16.5m-16.5 6.75h16.5" />
              <path v-else stroke-linecap="round" stroke-linejoin="round" d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>
      </div>

      <!-- Mobile Nav -->
      <Transition
        enter-active-class="transition-all duration-300 ease-out"
        enter-from-class="opacity-0 -translate-y-2"
        enter-to-class="opacity-100 translate-y-0"
        leave-active-class="transition-all duration-200 ease-in"
        leave-from-class="opacity-100 translate-y-0"
        leave-to-class="opacity-0 -translate-y-2"
      >
        <div v-if="isMenuOpen" class="site-header__mobile-nav lg:hidden pb-4 border-t border-stage-800/60 mt-2 pt-4 px-1" id="mobile-nav">
          <div v-for="item in combinedNav" :key="item.id" class="site-header__mobile-nav-item mb-1">
            <!-- Simple Link -->
            <NuxtLink
              v-if="!item.children.length"
              :to="item.url || '#'"
              class="site-header__mobile-nav-link block px-4 py-3 rounded-lg text-base font-medium text-stage-300 hover:text-brand-400 hover:bg-stage-800/50 transition-all"
              active-class="site-header__mobile-nav-link--active !text-brand-400 bg-stage-800/50"
              @click="isMenuOpen = false"
            >
              {{ item.label }}
            </NuxtLink>

            <!-- Accordion -->
            <template v-else>
              <button
                @click="toggleAccordion(item.id)"
                class="site-header__mobile-accordion-trigger w-full flex items-center justify-between px-4 py-3 rounded-lg text-base font-medium text-stage-300 hover:text-brand-400 hover:bg-stage-800/50 transition-all"
                :class="{ 'site-header__mobile-accordion-trigger--active text-brand-400 bg-stage-800/50': activeAccordion === item.id }"
              >
                {{ item.label }}
                <svg class="site-header__mobile-accordion-icon w-5 h-5 transition-transform duration-200" :class="{ 'rotate-180': activeAccordion === item.id }" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M19 9l-7 7-7-7" />
                </svg>
              </button>
              
              <div v-if="activeAccordion === item.id" class="site-header__mobile-accordion-content pl-4 mt-1 space-y-1">
                <NuxtLink
                  v-for="child in item.children"
                  :key="child.id"
                  :to="child.url || '#'"
                  class="site-header__mobile-accordion-link block px-4 py-2.5 rounded-lg text-sm font-medium text-stage-400 hover:text-brand-400 hover:bg-stage-800/30 transition-all"
                  active-class="site-header__mobile-accordion-link--active !text-brand-400"
                  @click="isMenuOpen = false"
                >
                  {{ child.label }}
                </NuxtLink>
              </div>
            </template>
          </div>
          
          <NuxtLink to="/productions" class="site-header__mobile-cta btn-primary w-full mt-4" @click="isMenuOpen = false">
            Get Tickets
          </NuxtLink>
        </div>
      </Transition>
    </div>
  </header>
  <!-- Spacer to offset fixed header -->
  <div class="site-header__spacer h-16 lg:h-20" />
</template>
