<script setup lang="ts">
/**
 * BaseModal.vue
 * A highly reusable, accessible, and premium modal component with smooth transition,
 * backdrop blur, body scroll-lock, and escape key navigation support.
 */
import { onMounted, onUnmounted, watch } from 'vue';

const props = withDefaults(defineProps<{
  isOpen: boolean;
  maxWidth?: string; // e.g. 'max-w-md', 'max-w-lg', 'max-w-xl', 'max-w-3xl', 'max-w-4xl'
}>(), {
  maxWidth: 'max-w-lg',
});

const emit = defineEmits(['close']);

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
        v-if="isOpen"
        class="fixed inset-0 z-[100] flex items-center justify-center p-4"
        role="dialog"
        aria-modal="true"
      >
        <!-- Backdrop with Blur -->
        <div 
          class="absolute inset-0 bg-stage-950/80 backdrop-blur-sm transition-opacity" 
          @click="emit('close')" 
        />

        <!-- Modal Content Container -->
        <div 
          class="relative w-full max-h-[90vh] bg-stage-900 border border-stage-700/40 rounded-2xl shadow-2xl flex flex-col overflow-hidden animate-scale-in transition-all z-10"
          :class="maxWidth"
        >
          <!-- Close Button -->
          <button
            class="absolute top-4 right-4 z-[120] w-8 h-8 rounded-full bg-stage-800/80 flex items-center justify-center text-stage-400 hover:text-stage-100 transition-colors focus:outline-none focus:ring-2 focus:ring-brand-500"
            @click="emit('close')"
            aria-label="Close Modal"
          >
            <svg class="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
              <path stroke-linecap="round" stroke-linejoin="round" d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>

          <!-- Main Slot -->
          <div class="flex-1 overflow-y-auto">
            <slot />
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
    transform: scale(0.95) translateY(10px);
  }
  to {
    opacity: 1;
    transform: scale(1) translateY(0);
  }
}
</style>
