<script setup lang="ts">
import type { Person } from '@flux-theatre/shared';

interface Props {
  person: Pick<Person, 'first_name' | 'last_name' | 'slug' | 'headshot' | 'bio' | 'pronouns'>;
  role?: string;
  compact?: boolean;
}

const props = withDefaults(defineProps<Props>(), { compact: false });

const fullName = computed(() => `${props.person.first_name} ${props.person.last_name}`);

const isModalOpen = ref(false);
</script>

<template>
  <div>
    <!-- Card -->
    <button
      class="card-glass group text-left w-full"
      :id="`person-card-${person.slug}`"
      @click="isModalOpen = true"
    >
      <!-- Headshot -->
      <div class="relative aspect-[3/4] overflow-hidden bg-stage-800" :class="{ 'aspect-square': compact }">
        <img
          v-if="person.headshot"
          :src="person.headshot"
          :alt="`${fullName} headshot`"
          class="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
          loading="lazy"
        />
        <div v-else class="w-full h-full flex items-center justify-center bg-gradient-to-br from-stage-800 to-stage-900">
          <span class="text-stage-500 font-serif text-4xl">{{ person.first_name[0] }}{{ person.last_name[0] }}</span>
        </div>
      </div>

      <!-- Info -->
      <div class="p-4">
        <h3 class="text-sm font-semibold text-stage-100 group-hover:text-brand-400 transition-colors">
          {{ fullName }}
        </h3>
        <p v-if="person.pronouns" class="text-xs text-stage-500 mt-0.5">({{ person.pronouns }})</p>
        <p v-if="role" class="text-xs text-brand-400/80 mt-1 font-medium">{{ role }}</p>
      </div>
    </button>

    <!-- Bio Modal -->
    <Teleport to="body">
      <Transition
        enter-active-class="transition-all duration-300 ease-out"
        enter-from-class="opacity-0"
        enter-to-class="opacity-100"
        leave-active-class="transition-all duration-200 ease-in"
        leave-from-class="opacity-100"
        leave-to-class="opacity-0"
      >
        <div
          v-if="isModalOpen"
          class="fixed inset-0 z-[100] flex items-center justify-center p-4"
          @click.self="isModalOpen = false"
        >
          <!-- Backdrop -->
          <div class="absolute inset-0 bg-stage-950/80 backdrop-blur-sm" />

          <!-- Modal Content -->
          <div class="relative max-w-lg w-full bg-stage-900 border border-stage-700/40 rounded-2xl shadow-2xl overflow-hidden animate-scale-in">
            <button
              class="absolute top-4 right-4 z-10 w-8 h-8 rounded-full bg-stage-800/80 flex items-center justify-center text-stage-400 hover:text-stage-100 transition-colors"
              @click="isModalOpen = false"
              aria-label="Close"
            >
              <svg class="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
                <path stroke-linecap="round" stroke-linejoin="round" d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>

            <div class="flex flex-col sm:flex-row">
              <!-- Headshot -->
              <div class="sm:w-48 aspect-[3/4] sm:aspect-auto bg-stage-800 flex-shrink-0">
                <img
                  v-if="person.headshot"
                  :src="person.headshot"
                  :alt="fullName"
                  class="w-full h-full object-cover"
                />
                <div v-else class="w-full h-full flex items-center justify-center min-h-[200px]">
                  <span class="text-stage-500 font-serif text-5xl">{{ person.first_name[0] }}{{ person.last_name[0] }}</span>
                </div>
              </div>

              <!-- Bio -->
              <div class="p-6 flex-1">
                <h2 class="text-xl font-serif font-bold text-stage-50">{{ fullName }}</h2>
                <p v-if="person.pronouns" class="text-sm text-stage-400 mt-1">({{ person.pronouns }})</p>
                <p v-if="role" class="text-sm text-brand-400 font-medium mt-2">{{ role }}</p>
                <div v-if="person.bio" class="mt-4 text-sm text-stage-300 leading-relaxed prose prose-invert prose-sm" v-html="person.bio" />
                <p v-else class="mt-4 text-sm text-stage-500 italic">Bio coming soon.</p>
              </div>
            </div>
          </div>
        </div>
      </Transition>
    </Teleport>
  </div>
</template>
