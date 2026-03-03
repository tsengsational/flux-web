<script setup lang="ts">
const navLinks = [
  { label: 'Home', to: '/' },
  { label: 'Productions', to: '/productions' },
  { label: 'Events', to: '/events' },
  { label: 'Calendar', to: '/calendar' },
  { label: 'News', to: '/news' },
  { label: 'About', to: '/about' },
];

const isMenuOpen = ref(false);

function toggleMenu() {
  isMenuOpen.value = !isMenuOpen.value;
}
</script>

<template>
  <header class="fixed top-0 inset-x-0 z-50 border-b border-stage-800/60 bg-stage-950/80 backdrop-blur-xl">
    <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      <div class="flex items-center justify-between h-16 lg:h-20">
        <!-- Logo -->
        <NuxtLink to="/" class="flex items-center gap-3 group" id="site-logo">
          <div class="w-9 h-9 rounded-full bg-gradient-to-br from-brand-400 to-brand-600 flex items-center justify-center shadow-lg shadow-brand-500/20 group-hover:shadow-brand-500/40 transition-shadow">
            <span class="text-stage-950 font-serif font-bold text-lg leading-none">F</span>
          </div>
          <span class="text-stage-50 font-serif text-xl font-semibold tracking-tight hidden sm:block">
            Flux Theatre
          </span>
        </NuxtLink>

        <!-- Desktop Nav -->
        <nav class="hidden lg:flex items-center gap-1" id="desktop-nav">
          <NuxtLink
            v-for="link in navLinks"
            :key="link.to"
            :to="link.to"
            class="px-4 py-2 rounded-lg text-sm font-medium text-stage-300 hover:text-brand-400 hover:bg-stage-800/50 transition-all duration-200"
            active-class="!text-brand-400 bg-stage-800/50"
          >
            {{ link.label }}
          </NuxtLink>
        </nav>

        <!-- CTA + Mobile Toggle -->
        <div class="flex items-center gap-3">
          <NuxtLink to="/productions" class="btn-primary hidden sm:inline-flex" id="header-cta">
            Get Tickets
          </NuxtLink>
          <button
            class="lg:hidden p-2 rounded-lg text-stage-300 hover:text-stage-100 hover:bg-stage-800/50 transition-colors"
            id="mobile-menu-toggle"
            @click="toggleMenu"
            :aria-expanded="isMenuOpen"
            aria-label="Toggle menu"
          >
            <svg class="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="1.5">
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
        <div v-if="isMenuOpen" class="lg:hidden pb-4 border-t border-stage-800/60 mt-2 pt-4" id="mobile-nav">
          <NuxtLink
            v-for="link in navLinks"
            :key="link.to"
            :to="link.to"
            class="block px-4 py-3 rounded-lg text-base font-medium text-stage-300 hover:text-brand-400 hover:bg-stage-800/50 transition-all"
            active-class="!text-brand-400 bg-stage-800/50"
            @click="isMenuOpen = false"
          >
            {{ link.label }}
          </NuxtLink>
          <NuxtLink to="/productions" class="btn-primary w-full mt-3 sm:hidden" @click="isMenuOpen = false">
            Get Tickets
          </NuxtLink>
        </div>
      </Transition>
    </div>
  </header>
  <!-- Spacer to offset fixed header -->
  <div class="h-16 lg:h-20" />
</template>
