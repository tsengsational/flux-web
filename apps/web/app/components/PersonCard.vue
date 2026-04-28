<script setup lang="ts">
import type { Person } from '@flux-theatre/shared';

interface Props {
  person: Pick<Person, 'first_name' | 'last_name' | 'slug' | 'headshot' | 'bio' | 'pronouns'>;
  role?: string;
  compact?: boolean;
}

const props = withDefaults(defineProps<Props>(), { compact: false });
const { getAssetUrl, getImageProps } = useDirectus();

const fullName = computed(() => `${props.person.first_name} ${props.person.last_name}`);

const isModalOpen = ref(false);
</script>

<template>
  <div class="person-card">
    <!-- Card -->
    <button
      class="person-card__link card-glass group text-left w-full"
      :id="`person-card-${person.slug}`"
      @click="isModalOpen = true"
    >
      <!-- Headshot -->
      <div class="person-card__image-container relative aspect-[3/4] overflow-hidden bg-stage-800" :class="{ 'person-card__image-container--compact aspect-square': compact }">
        <img
          v-if="person.headshot"
          v-bind="getImageProps(person.headshot, { sm: 200, md: 400 })"
          :alt="`${fullName} headshot`"
          class="person-card__image w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
          loading="lazy"
        />
        <div v-else class="person-card__placeholder w-full h-full flex items-center justify-center bg-gradient-to-br from-stage-800 to-stage-900">
          <span class="person-card__initials text-stage-500 font-serif text-4xl">{{ person.first_name[0] }}{{ person.last_name[0] }}</span>
        </div>
      </div>

      <!-- Info -->
      <div class="person-card__info p-4">
        <h3 class="person-card__name text-sm font-semibold text-stage-500 group-hover:text-brand-400 transition-colors">
          {{ fullName }}
        </h3>
        <p v-if="person.pronouns" class="person-card__pronouns text-xs text-stage-500 mt-0.5">({{ person.pronouns }})</p>
        <p v-if="role" class="person-card__role text-xs text-brand-400/80 mt-1 font-medium">{{ role }}</p>
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
          class="person-modal fixed inset-0 z-[100] flex items-center justify-center p-4"
          @click.self="isModalOpen = false"
        >
          <!-- Backdrop -->
          <div class="person-modal__backdrop absolute inset-0 bg-stage-950/80 backdrop-blur-sm" />

          <!-- Modal Content -->
          <div class="person-modal__content relative max-w-lg md:max-w-3xl w-full max-h-[90vh] bg-stage-900 border border-stage-700/40 rounded-2xl shadow-2xl flex flex-col overflow-hidden animate-scale-in">
            <button
              class="person-modal__close absolute top-4 right-4 z-10 w-8 h-8 rounded-full bg-stage-800/80 flex items-center justify-center text-stage-400 hover:text-stage-100 transition-colors"
              @click="isModalOpen = false"
              aria-label="Close"
            >
              <svg class="person-modal__close-icon w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
                <path stroke-linecap="round" stroke-linejoin="round" d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>

            <div class="person-modal__layout flex flex-col md:flex-row flex-1 overflow-y-auto">
              <!-- Headshot -->
              <div class="person-modal__image-wrapper w-full md:w-2/5 aspect-[3/4] md:aspect-auto md:h-full bg-stage-800 flex-shrink-0">
                <img
                  v-if="person.headshot"
                  v-bind="getImageProps(person.headshot, { sm: 400, md: 800 }, { quality: 90 })"
                  :alt="fullName"
                  class="person-modal__image w-full h-full object-cover"
                />
                <div v-else class="person-modal__placeholder w-full h-full flex items-center justify-center min-h-[200px]">
                  <span class="person-modal__initials text-stage-500 font-serif text-5xl">{{ person.first_name[0] }}{{ person.last_name[0] }}</span>
                </div>
              </div>

              <!-- Bio -->
              <div class="person-modal__info p-6 md:p-8 flex-1 md:overflow-y-auto">
                <h2 class="person-modal__name text-xl md:text-2xl font-serif font-bold text-stage-50">{{ fullName }}</h2>
                <p v-if="person.pronouns" class="person-modal__pronouns text-sm text-stage-400 mt-1">({{ person.pronouns }})</p>
                <p v-if="role" class="person-modal__role text-sm md:text-base text-brand-400 font-medium mt-2">{{ role }}</p>
                <div v-if="person.bio" class="person-modal__bio mt-4 text-sm md:text-base text-stage-300 leading-relaxed prose prose-invert prose-sm md:prose-base">
                  <BlockRenderer :content="person.bio" />
                </div>
                <p v-else class="person-modal__no-bio mt-4 text-sm text-stage-500 italic">Bio coming soon.</p>
                <div class="person-modal__footer mt-6 pt-6 border-t border-stage-800">
                  <NuxtLink
                    :to="`/people/${person.slug}`"
                    class="text-xs font-bold text-brand-400 hover:text-brand-300 transition-colors uppercase tracking-widest flex items-center gap-2"
                    @click="isModalOpen = false"
                  >
                    View Full Profile
                    <svg class="w-3 h-3" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2.5">
                      <path stroke-linecap="round" stroke-linejoin="round" d="M13.5 4.5L21 12m0 0l-7.5 7.5M21 12H3" />
                    </svg>
                  </NuxtLink>
                </div>
              </div>
            </div>
          </div>
        </div>
      </Transition>
    </Teleport>
  </div>
</template>
