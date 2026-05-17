<script setup lang="ts">
/**
 * MediaCarousel.vue
 * A responsive, horizontally scrolling carousel for mixed media (Images with CTAs and YouTube Embeds).
 */
import type { PropType } from 'vue';

interface CarouselItemData {
  id: string | number;
  type: 'image' | 'youtube' | 'instagram';
  image?: string | any;
  cta_text?: string;
  cta_url?: string;
  youtube_url?: string;
  video_title?: string;
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

const isInstagram = (url: string) => {
  return url ? url.includes('instagram.com') : false;
};

const isVerticalEmbed = (url: string) => {
  return isShorts(url) || isInstagram(url);
};

const getInstagramEmbedUrl = (url: string) => {
  if (!url) return null;
  const match = url.match(/\/(p|reel|reels)\/([A-Za-z0-9_-]+)/);
  if (match && match[2]) {
    return `https://www.instagram.com/reel/${match[2]}/embed`;
  }
  return null;
};

const getVideoEmbedUrl = (url: string) => {
  if (!url) return '';
  if (isInstagram(url)) {
    return getInstagramEmbedUrl(url) || '';
  }
  const ytId = getYoutubeId(url);
  return ytId ? `https://www.youtube.com/embed/${ytId}?autoplay=1&rel=0` : '';
};

const activeVideoItem = ref<CarouselItemData | null>(null);

const handleVideoClick = (item: any) => {
  const data = item.carousel_items_id;
  const url = data.youtube_url || '';
  if (!url) return;

  if (getYoutubeId(url) || isInstagram(url)) {
    activeVideoItem.value = data;
  }
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
        :class="isVerticalEmbed(item.carousel_items_id?.youtube_url) ? 'aspect-[9/16]' : 'aspect-video'"
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

        <!-- Type: YouTube / Instagram / Video -->
        <template v-else-if="item.carousel_items_id?.type === 'youtube' || item.carousel_items_id?.type === 'instagram'">
          <!-- Video Preview Thumbnail (Triggers Modal Playback) -->
          <button 
            v-if="getYoutubeId(item.carousel_items_id.youtube_url) || isInstagram(item.carousel_items_id.youtube_url)"
            @click="handleVideoClick(item)"
            class="relative w-full h-full flex items-center justify-center group/play cursor-pointer focus:outline-none focus:ring-2 focus:ring-brand-500 rounded-2xl overflow-hidden"
            aria-label="Play video"
          >
            <!-- 1. Use uploaded custom preview image if it exists -->
            <img 
              v-if="item.carousel_items_id.image"
              v-bind="getImageProps(item.carousel_items_id.image, { sm: 600, md: 800 })"
              class="w-full h-full object-cover transition-transform duration-500 group-hover/play:scale-105" 
              alt="Video Preview"
            />
            <!-- 2. Else fallback to standard YouTube thumbnail if it is YouTube -->
            <img 
              v-else-if="getYoutubeId(item.carousel_items_id.youtube_url)"
              :src="`https://i3.ytimg.com/vi/${getYoutubeId(item.carousel_items_id.youtube_url)}/hqdefault.jpg`" 
              class="w-full h-full object-cover transition-transform duration-500 group-hover/play:scale-105" 
              alt="Video Thumbnail"
              loading="lazy"
            />
            <!-- 3. Else fallback to custom Instagram gradient if it is Instagram -->
            <div 
              v-else-if="isInstagram(item.carousel_items_id.youtube_url)"
              class="w-full h-full bg-gradient-to-tr from-purple-600 via-pink-500 to-yellow-500 flex items-center justify-center transition-opacity duration-300 group-hover/play:opacity-90"
            >
              <div class="flex flex-col items-center gap-3">
                <svg class="w-10 h-10 text-white fill-current" viewBox="0 0 24 24">
                  <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z"/>
                </svg>
                <span class="text-xs font-semibold text-white/95 tracking-wider uppercase mt-1">Play Reel</span>
              </div>
            </div>
            
            <!-- Optional Video Title Overlay -->
            <div 
              v-if="item.carousel_items_id.video_title" 
              class="absolute inset-x-0 bottom-0 bg-gradient-to-t from-black/90 via-black/40 to-transparent p-4 pt-12 flex flex-col items-start text-left z-10 pointer-events-none"
            >
              <h3 class="text-white font-sans font-bold text-sm sm:text-base line-clamp-2 leading-tight tracking-wide drop-shadow">
                {{ item.carousel_items_id.video_title }}
              </h3>
            </div>

            <!-- Play Button Overlay -->
            <div class="absolute inset-0 bg-black/30 flex items-center justify-center transition-colors group-hover/play:bg-black/40">
              <div class="w-14 h-14 rounded-full bg-brand-500/90 text-white flex items-center justify-center shadow-2xl transform group-hover/play:scale-110 transition-transform duration-300">
                <svg class="w-7 h-7 fill-current ml-1" viewBox="0 0 24 24">
                  <path d="M8 5v14l11-7z" />
                </svg>
              </div>
            </div>
          </button>
          
          <div v-else class="w-full h-full flex items-center justify-center text-stage-500">
            Invalid Video URL
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

    <!-- Video Player Modal -->
    <BaseModal 
      :is-open="!!activeVideoItem" 
      :max-width="activeVideoItem && isVerticalEmbed(activeVideoItem.youtube_url) ? 'max-w-md' : 'max-w-4xl'" 
      @close="activeVideoItem = null"
    >
      <div 
        v-if="activeVideoItem"
        class="bg-black flex items-center justify-center w-full mx-auto"
        :class="isVerticalEmbed(activeVideoItem.youtube_url) ? 'aspect-[9/16] h-[75vh]' : 'aspect-video w-full'"
      >
        <iframe 
          :src="getVideoEmbedUrl(activeVideoItem.youtube_url)"
          class="w-full h-full border-0"
          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
          allowfullscreen
        ></iframe>
      </div>
    </BaseModal>
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
