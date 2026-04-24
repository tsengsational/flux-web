<script setup lang="ts">
/**
 * MediaGallery.vue
 * A reusable gallery component with a built-in lightbox and keyboard navigation.
 */

const props = defineProps<{
  images: string[]; // Array of Directus file IDs
  title?: string;
}>();

const { getAssetUrl } = useDirectus();

const isLightboxOpen = ref(false);
const currentIndex = ref(0);

const openLightbox = (index: number) => {
  currentIndex.value = index;
  isLightboxOpen.value = true;
  if (import.meta.client) {
    document.body.style.overflow = 'hidden';
  }
};

const closeLightbox = () => {
  isLightboxOpen.value = false;
  if (import.meta.client) {
    document.body.style.overflow = '';
  }
};

const nextImage = () => {
  currentIndex.value = (currentIndex.value + 1) % props.images.length;
};

const prevImage = () => {
  currentIndex.value = (currentIndex.value - 1 + props.images.length) % props.images.length;
};

// Keyboard navigation
if (import.meta.client) {
  onMounted(() => {
    window.addEventListener('keydown', handleKeydown);
  });

  onUnmounted(() => {
    window.removeEventListener('keydown', handleKeydown);
    document.body.style.overflow = '';
  });
}

function handleKeydown(e: KeyboardEvent) {
  if (!isLightboxOpen.value) return;
  
  if (e.key === 'ArrowRight') nextImage();
  if (e.key === 'ArrowLeft') prevImage();
  if (e.key === 'Escape') closeLightbox();
}
</script>

<template>
  <section class="media-gallery">
    <h2 v-if="title" class="text-2xl font-serif font-bold text-stage-50 mb-8">{{ title }}</h2>
    
    <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
      <div 
        v-for="(fileId, index) in images" 
        :key="fileId" 
        class="relative aspect-square cursor-pointer group overflow-hidden rounded-2xl border border-stage-800/40 bg-stage-900"
        @click="openLightbox(index)"
      >
        <img 
          :src="getAssetUrl(fileId)!" 
          class="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110" 
          alt="Gallery image"
          loading="lazy"
        />
        <!-- Hover Overlay -->
        <div class="absolute inset-0 bg-brand-500/10 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
          <div class="w-12 h-12 rounded-full bg-stage-950/80 backdrop-blur-md flex items-center justify-center text-brand-400 scale-75 group-hover:scale-100 transition-transform">
            <svg class="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0zM10 7v3m0 0v3m0-3h3m-3 0H7" />
            </svg>
          </div>
        </div>
      </div>
    </div>

    <!-- Lightbox -->
    <Teleport to="body">
      <Transition
        enter-active-class="transition duration-300 ease-out"
        enter-from-class="opacity-0"
        enter-to-class="opacity-100"
        leave-active-class="transition duration-200 ease-in"
        leave-from-class="opacity-100"
        leave-to-class="opacity-0"
      >
        <div 
          v-if="isLightboxOpen" 
          class="fixed inset-0 z-[100] flex items-center justify-center bg-stage-950/95 backdrop-blur-xl"
          @click.self="closeLightbox"
        >
          <!-- Close Button -->
          <button 
            @click="closeLightbox" 
            class="absolute top-6 right-6 z-[110] p-3 text-stage-400 hover:text-stage-50 transition-colors"
          >
            <svg class="w-8 h-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>

          <!-- Navigation Buttons -->
          <button 
            v-if="images.length > 1"
            @click="prevImage" 
            class="absolute left-6 top-1/2 -translate-y-1/2 z-[110] p-4 text-stage-400 hover:text-brand-400 transition-colors bg-stage-900/50 rounded-full backdrop-blur-md hover:bg-stage-800"
          >
            <svg class="w-8 h-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 19l-7-7 7-7" />
            </svg>
          </button>

          <button 
            v-if="images.length > 1"
            @click="nextImage" 
            class="absolute right-6 top-1/2 -translate-y-1/2 z-[110] p-4 text-stage-400 hover:text-brand-400 transition-colors bg-stage-900/50 rounded-full backdrop-blur-md hover:bg-stage-800"
          >
            <svg class="w-8 h-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5l7 7-7 7" />
            </svg>
          </button>

          <!-- Image Container -->
          <div class="relative flex flex-col items-center justify-center p-4">
            <img 
              :key="currentIndex"
              :src="getAssetUrl(images[currentIndex])!" 
              class="max-w-[90vw] max-h-[80vh] object-contain shadow-2xl rounded-sm animate-in zoom-in-95 duration-300"
              alt="Full size image"
            />
            
            <!-- Counter -->
            <div class="mt-8 text-stage-400 font-mono text-xs tracking-[0.3em] uppercase bg-stage-900/40 px-4 py-2 rounded-full backdrop-blur-sm">
              {{ currentIndex + 1 }} <span class="mx-2 text-stage-600">/</span> {{ images.length }}
            </div>
          </div>

        </div>
      </Transition>
    </Teleport>
  </section>
</template>

<style scoped>
.animate-in {
  animation-duration: 0.3s;
  animation-fill-mode: both;
}

@keyframes zoom-in-95 {
  from { opacity: 0; transform: scale(0.95); }
  to { opacity: 1; transform: scale(1); }
}

.zoom-in-95 {
  animation-name: zoom-in-95;
}
</style>
