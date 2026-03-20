<template>
  <div class="default-layout min-h-screen flex flex-col">
    <SiteHeader />
    <main class="default-layout__main flex-1">
      <slot />
    </main>
    <SiteFooter />
  </div>
</template>
