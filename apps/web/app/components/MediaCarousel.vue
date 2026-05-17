<script setup lang="ts">
/**
 * MediaCarousel.vue
 * A responsive, horizontally scrolling carousel for mixed media (Images with CTAs and YouTube Embeds).
 */
import type { PropType } from 'vue';

interface CarouselItemData {
  id: string | number;
  type: 'image' | 'youtube';
  image?: string | any;
  cta_text?: string;
  cta_url?: string;
  youtube_url?: string;
}

interface CarouselJunctionItem {
  carousel_items_id: CarouselItemData;
  [key: string]: any;
}

const props = defineProps({
  items: {
    type: Array as PropType<CarouselJunctionItem[]>,
    default: () => [],
  },
  title: {
    type: String,
    default: '',
  },
});

const { getImageProps } = useDirectus();
const carouselRef = ref<HTMLElement | null>(null);

const scrollLeft = () => {
  if (carouselRef.value) {
    const itemWidth = carouselRef.value.children[0]?.clientWidth || 0;
    carouselRef.value.scrollBy({ left: -itemWidth, behavior: 'smooth' });
  }
};

const scrollRight = () => {
  if (carouselRef.value) {
    const itemWidth = carouselRef.value.children[0]?.clientWidth || 0;
    carouselRef.value.scrollBy({ left: itemWidth, behavior: 'smooth' });
  }
};

/**
 * Extracts YouTube Video ID from standard or shortened URLs
 */
const getYoutubeId = (url: string) => {
  if (!url) return null;
  const regExp = /^.*(youtu.be\/|v\/|u\/\w\/|embed\/|watch\?v=|&v=|shorts\/)([^#&?]*).*/;
  const match = url.match(regExp);
  return (match && match[2].length === 11) ? match[2] : null;
};

const isShorts = (url: string) => {
  return url ? url.includes('/shorts/') : false;
};
</script>

<template>
  <div class="media-carousel relative group" v-if="items.length > 0">
    <!-- Title -->
    <div v-if="title" class="px-4 sm:px-6 lg:px-8 mb-6">
      <h2 class="text-2xl font-serif font-bold text-stage-900">{{ title }}</h2>
    </div>

    <!-- Carousel Container -->
    <div 
      ref="carouselRef"
      class="media-carousel__track flex gap-6 overflow-x-auto snap-x snap-mandatory pb-8 pt-4 px-4 sm:px-6 lg:px-8 hide-scrollbar scroll-smooth"
    >
      <div 
        v-for="(item, index) in items" 
        :key="item.carousel_items_id?.id || index"
        class="media-carousel__item relative flex-none h-[220px] sm:h-[300px] md:h-[360px] lg:h-[400px] rounded-2xl overflow-hidden snap-center bg-stage-900 border border-stage-800/50 shadow-xl"
        :class="isShorts(item.carousel_items_id?.youtube_url) ? 'aspect-[9/16]' : 'aspect-video'"
      >
        <!-- Type: Image -->
        <template v-if="item.carousel_items_id?.type === 'image'">
          <img 
            v-if="item.carousel_items_id.image"
            v-bind="getImageProps(item.carousel_items_id.image, { sm: 600, md: 800, lg: 1200 }, { quality: 85 })"
            class="w-full h-full object-cover"
            alt="Carousel Image"
          />
          
          <!-- Optional CTA Overlay -->
          <div 
            v-if="item.carousel_items_id.cta_text && item.carousel_items_id.cta_url"
            class="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent flex items-end p-6 md:p-8 lg:p-10"
          >
            <a 
              :href="item.carousel_items_id.cta_url"
              target="_blank"
              class="inline-flex items-center gap-2 px-6 py-3 rounded-full bg-brand-500 hover:bg-brand-400 text-white hover:text-white font-bold transition-all hover:scale-105 shadow-lg"
            >
              {{ item.carousel_items_id.cta_text }}
              <svg class="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2.5">
                <path stroke-linecap="round" stroke-linejoin="round" d="M13.5 4.5L21 12m0 0l-7.5 7.5M21 12H3" />
              </svg>
            </a>
          </div>
        </template>

        <!-- Type: YouTube -->
        <template v-else-if="item.carousel_items_id?.type === 'youtube'">
          <iframe 
            v-if="getYoutubeId(item.carousel_items_id.youtube_url)"
            :src="`https://www.youtube.com/embed/${getYoutubeId(item.carousel_items_id.youtube_url)}?rel=0`"
            class="w-full h-full border-0"
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
            allowfullscreen
          ></iframe>
          <div v-else class="w-full h-full flex items-center justify-center text-stage-500">
            Invalid YouTube URL
          </div>
        </template>
      </div>
    </div>

    <!-- Navigation Arrows -->
    <div v-if="items.length > 1" class="absolute top-1/2 -translate-y-1/2 left-0 right-0 flex justify-between px-2 pointer-events-none opacity-0 group-hover:opacity-100 transition-opacity duration-300 hidden sm:flex">
      <button 
        @click="scrollLeft" 
        class="w-12 h-12 rounded-full bg-black/50 backdrop-blur border border-white/10 flex items-center justify-center text-white pointer-events-auto hover:bg-brand-500 hover:border-brand-400 transition-all shadow-lg -translate-x-1/2"
        aria-label="Previous item"
      >
        <svg class="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
          <path stroke-linecap="round" stroke-linejoin="round" d="M15 19l-7-7 7-7" />
        </svg>
      </button>
      <button 
        @click="scrollRight" 
        class="w-12 h-12 rounded-full bg-black/50 backdrop-blur border border-white/10 flex items-center justify-center text-white pointer-events-auto hover:bg-brand-500 hover:border-brand-400 transition-all shadow-lg translate-x-1/2"
        aria-label="Next item"
      >
        <svg class="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
          <path stroke-linecap="round" stroke-linejoin="round" d="M9 5l7 7-7 7" />
        </svg>
      </button>
    </div>
  </div>
</template>

<style scoped>
/* Hide scrollbar for Chrome, Safari and Opera */
.hide-scrollbar::-webkit-scrollbar {
  display: none;
}

/* Hide scrollbar for IE, Edge and Firefox */
.hide-scrollbar {
  -ms-overflow-style: none;  /* IE and Edge */
  scrollbar-width: none;  /* Firefox */
}
</style>
