<script setup lang="ts">
const currentYear = new Date().getFullYear();
</script>

<template>
  <footer class="site-footer border-t border-stage-800/60 bg-stage-950" id="site-footer">
    <div class="site-footer__container max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
      <div class="site-footer__grid grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 gap-10">
        <!-- Brand Column -->
        <div class="site-footer__brand lg:col-span-1">
          <NuxtLink to="/" class="site-footer__logo flex items-center gap-3 group mb-4">
            <img src="/logo.svg" alt="Flux Theatre Ensemble" class="h-10 w-auto group-hover:opacity-90 transition-opacity" />
          </NuxtLink>
          <p class="site-footer__tagline text-stage-400 text-sm leading-relaxed">
            Adventurous theatre in the heart of New York City. Building new works and reimagining classics since 2006.
          </p>
        </div>

        <!-- Quick Links -->
        <div class="site-footer__links">
          <h4 class="site-footer__title text-stage-200 font-sans font-semibold text-sm uppercase tracking-wider mb-4">Explore</h4>
          <ul class="site-footer__list space-y-2">
            <li v-for="link in [
              { label: 'Current Season', to: '/productions' },
              { label: 'Past Productions', to: '/productions?filter=past' },
              { label: 'News & Blog', to: '/news' },
            ]" :key="link.to" class="site-footer__item">
              <NuxtLink :to="link.to" class="site-footer__link text-stage-400 text-sm hover:text-brand-400 transition-colors">
                {{ link.label }}
              </NuxtLink>
            </li>
          </ul>
        </div>

        <!-- Support -->
        <div class="site-footer__links">
          <h4 class="site-footer__title text-stage-200 font-sans font-semibold text-sm uppercase tracking-wider mb-4">Support</h4>
          <ul class="site-footer__list space-y-2">
            <li v-for="link in [
              { label: 'Donate', to: '/donate' },
              { label: 'Contact', to: '/contact' },
            ]" :key="link.to" class="site-footer__item">
              <NuxtLink :to="link.to" class="site-footer__link text-stage-400 text-sm hover:text-brand-400 transition-colors">
                {{ link.label }}
              </NuxtLink>
            </li>
          </ul>
        </div>

        <!-- Connect -->
        <div class="site-footer__connect">
          <h4 class="site-footer__title text-stage-200 font-sans font-semibold text-sm uppercase tracking-wider mb-4">Connect</h4>
          <div class="site-footer__social-links flex gap-3">
            <a
              v-for="social in [
                { label: 'Instagram', icon: 'M7.5 2h9A5.5 5.5 0 0122 7.5v9a5.5 5.5 0 01-5.5 5.5h-9A5.5 5.5 0 012 16.5v-9A5.5 5.5 0 017.5 2zm4.5 5a5 5 0 100 10 5 5 0 000-10zm0 2a3 3 0 110 6 3 3 0 010-6zm5.25-2.5a1.25 1.25 0 110 2.5 1.25 1.25 0 010-2.5z' },
                { label: 'Facebook', icon: 'M18 2h-3a5 5 0 00-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 011-1h3z' },
                { label: 'YouTube', icon: 'M22.54 6.42a2.78 2.78 0 00-1.94-2C18.88 4 12 4 12 4s-6.88 0-8.6.46a2.78 2.78 0 00-1.94 2A29 29 0 001 11.75a29 29 0 00.46 5.33A2.78 2.78 0 003.4 19.1c1.72.46 8.6.46 8.6.46s6.88 0 8.6-.46a2.78 2.78 0 001.94-2 29 29 0 00.46-5.25 29 29 0 00-.46-5.43zM9.75 15.02V8.48l5.75 3.27-5.75 3.27z' },
              ]"
              :key="social.label"
              href="#"
              :aria-label="social.label"
              class="site-footer__social-link w-10 h-10 rounded-lg bg-stage-800/60 flex items-center justify-center text-stage-400 hover:text-brand-400 hover:bg-stage-800 transition-all"
            >
              <svg class="site-footer__social-icon w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                <path :d="social.icon" />
              </svg>
            </a>
          </div>
          <p class="site-footer__subscribe text-stage-500 text-xs mt-6">
            Mailing list, auditions, and more &mdash; <a href="#" class="site-footer__link--inline underline hover:text-brand-400 transition-colors">subscribe here</a>.
          </p>
        </div>
      </div>

      <!-- Bottom Bar -->
      <div class="site-footer__bottom mt-12 pt-8 border-t border-stage-800/60 flex flex-col sm:flex-row items-center justify-between gap-4">
        <p class="site-footer__copyright text-stage-500 text-xs">
          &copy; {{ currentYear }} Flux Theatre Ensemble. All rights reserved.
        </p>
        <div class="site-footer__legal flex gap-4 text-xs text-stage-500">
          <NuxtLink to="/privacy" class="site-footer__legal-link hover:text-stage-300 transition-colors">Privacy Policy</NuxtLink>
          <NuxtLink to="/accessibility" class="site-footer__legal-link hover:text-stage-300 transition-colors">Accessibility</NuxtLink>
        </div>
      </div>
    </div>
  </footer>
</template>
