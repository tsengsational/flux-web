<script setup lang="ts">
/**
 * BaseLightbox.vue
 * A premium lightbox component for expanding a single image.
 * Supports backdrop blur, scroll locking, close on click-outside, and Escape key navigation.
 */
import { onMounted, onUnmounted, watch } from 'vue';

const props = defineProps<{
  isOpen: boolean;
  imageId: string | null;
  alt?: string;
  caption?: string | null;
}>();

const emit = defineEmits(['close']);

const { getImageProps } = useDirectus();

// ── Close on Escape Key ──
if (import.meta.client) {
  const handleKeydown = (e: KeyboardEvent) => {
    if (e.key === 'Escape' && props.isOpen) {
      emit('close');
    }
  };

  onMounted(() => {
    window.addEventListener('keydown', handleKeydown);
  });

  onUnmounted(() => {
    window.removeEventListener('keydown', handleKeydown);
  });
}

// ── Body Scroll Lock ──
watch(() => props.isOpen, (newVal) => {
  if (import.meta.client) {
    if (newVal) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
  }
}, { immediate: true });

onUnmounted(() => {
  if (import.meta.client) {
    document.body.style.overflow = '';
  }
});
</script>

<template>
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
        v-if="isOpen && imageId" 
        class="fixed inset-0 z-[150] flex items-center justify-center bg-stage-950/95 backdrop-blur-xl"
        @click.self="emit('close')"
      >
        <!-- Close Button -->
        <button 
          @click="emit('close')" 
          class="absolute top-6 right-6 z-[160] p-3 text-stage-400 hover:text-stage-50 transition-colors bg-stage-900/40 rounded-full hover:bg-stage-800/80 focus:outline-none focus:ring-2 focus:ring-brand-500"
          aria-label="Close Lightbox"
        >
          <svg class="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
            <path stroke-linecap="round" stroke-linejoin="round" d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>

        <!-- Image Container -->
        <div class="relative flex flex-col items-center justify-center p-4 max-w-[95vw] max-h-[95vh]">
          <img 
            v-bind="getImageProps(imageId, { sm: 800, md: 1200, lg: 1920 }, { quality: 90 })" 
            class="max-w-full max-h-[85vh] object-contain shadow-2xl rounded-sm animate-scale-in"
            :alt="alt || 'Expanded image'"
          />
          
          <!-- Caption -->
          <div 
            v-if="caption" 
            class="mt-4 text-stage-300 font-serif italic text-sm text-center max-w-2xl px-6 py-2 bg-stage-900/40 rounded-lg backdrop-blur-sm"
          >
            {{ caption }}
          </div>
        </div>
      </div>
    </Transition>
  </Teleport>
</template>

<style scoped>
.animate-scale-in {
  animation: scale-in 0.3s cubic-bezier(0.16, 1, 0.3, 1) forwards;
}

@keyframes scale-in {
  from {
    opacity: 0;
    transform: scale(0.95);
  }
  to {
    opacity: 1;
    transform: scale(1);
  }
}
</style>
