<template>
  <div class="app-root">
    <NuxtLayout>
      <NuxtRouteAnnouncer />
      <NuxtPage />
    </NuxtLayout>
  </div>
</template>

<style>
/* Global link styles using Tailwind tokens */
a {
  @apply text-brand-500 transition-colors duration-200;
}

a:hover {
  @apply text-brand-400;
}

/* Ensure links in v-html content (like blog posts) are also styled */
.block-renderer a {
  @apply text-brand-500 hover:text-brand-400 transition-colors duration-200;
}
</style>
