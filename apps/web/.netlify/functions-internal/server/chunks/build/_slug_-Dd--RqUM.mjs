import { _ as __nuxt_component_0 } from './nuxt-link-cZpXnfBZ.mjs';
import { _ as __nuxt_component_1 } from './BlockRenderer-DbBZxoc-.mjs';
import { _ as __nuxt_component_2 } from './PersonCard-C8ghIWcX.mjs';
import { _ as __nuxt_component_3 } from './MediaGallery-C10VoGcE.mjs';
import { _ as __nuxt_component_0$1 } from './BaseModal-Bc4BSEMB.mjs';
import { defineComponent, ref, withAsyncContext, computed, watch, mergeProps, unref, withCtx, createTextVNode, createVNode, toDisplayString, openBlock, createBlock, Fragment, renderList, createCommentVNode, useSSRContext } from 'vue';
import { ssrRenderAttrs, ssrRenderAttr, ssrInterpolate, ssrRenderComponent, ssrRenderClass, ssrRenderList, ssrIncludeBooleanAttr, ssrRenderTeleport } from 'vue/server-renderer';
import { u as useDirectus, a as useAsyncData } from './asyncData-DO9zjVnq.mjs';
import { _ as _export_sfc, u as useRoute } from './server.mjs';
import { u as useSeoMeta } from './composables-DOi4jpYZ.mjs';
import '../_/nitro.mjs';
import 'node:http';
import 'node:https';
import 'node:events';
import 'node:buffer';
import 'node:fs';
import 'node:path';
import 'node:crypto';
import '@directus/sdk';
import '../routes/renderer.mjs';
import 'vue-bundle-renderer/runtime';
import 'unhead/server';
import 'devalue';
import 'unhead/plugins';
import 'unhead/utils';
import 'vue-router';

const _sfc_main$1 = /* @__PURE__ */ defineComponent({
  __name: "MediaCarousel",
  __ssrInlineRender: true,
  props: {
    items: {
      type: Array,
      default: () => []
    },
    title: {
      type: String,
      default: ""
    }
  },
  setup(__props) {
    const { getImageProps } = useDirectus();
    ref(null);
    const getYoutubeId = (url) => {
      if (!url) return null;
      const regExp = /^.*(youtu.be\/|v\/|u\/\w\/|embed\/|watch\?v=|&v=|shorts\/)([^#&?]*).*/;
      const match = url.match(regExp);
      return match && match[2].length === 11 ? match[2] : null;
    };
    const isShorts = (url) => {
      return url ? url.includes("/shorts/") : false;
    };
    const isInstagram = (url) => {
      return url ? url.includes("instagram.com") : false;
    };
    const isVerticalEmbed = (url) => {
      return isShorts(url) || isInstagram(url);
    };
    const getInstagramEmbedUrl = (url) => {
      if (!url) return null;
      const match = url.match(/\/(p|reel|reels)\/([A-Za-z0-9_-]+)/);
      if (match && match[2]) {
        return `https://www.instagram.com/reel/${match[2]}/embed`;
      }
      return null;
    };
    const getVideoEmbedUrl = (url) => {
      if (!url) return "";
      if (isInstagram(url)) {
        return getInstagramEmbedUrl(url) || "";
      }
      const ytId = getYoutubeId(url);
      return ytId ? `https://www.youtube.com/embed/${ytId}?autoplay=1&rel=0` : "";
    };
    const activeVideoItem = ref(null);
    return (_ctx, _push, _parent, _attrs) => {
      const _component_BaseModal = __nuxt_component_0$1;
      if (__props.items.length > 0) {
        _push(`<div${ssrRenderAttrs(mergeProps({ class: "media-carousel relative group" }, _attrs))} data-v-c78a7dc1>`);
        if (__props.title) {
          _push(`<div class="px-4 sm:px-6 lg:px-8 mb-6" data-v-c78a7dc1><h2 class="text-2xl font-serif font-bold text-stage-900" data-v-c78a7dc1>${ssrInterpolate(__props.title)}</h2></div>`);
        } else {
          _push(`<!---->`);
        }
        _push(`<div class="media-carousel__track flex gap-6 overflow-x-auto snap-x snap-mandatory pb-8 pt-4 px-4 sm:px-6 lg:px-8 hide-scrollbar scroll-smooth" data-v-c78a7dc1><!--[-->`);
        ssrRenderList(__props.items, (item, index) => {
          _push(`<div class="${ssrRenderClass([isVerticalEmbed(item.carousel_items_id?.youtube_url) ? "aspect-[9/16]" : "aspect-video", "media-carousel__item relative flex-none h-[220px] sm:h-[300px] md:h-[360px] lg:h-[400px] rounded-2xl overflow-hidden snap-center bg-stage-900 border border-stage-800/50 shadow-xl"])}" data-v-c78a7dc1>`);
          if (item.carousel_items_id?.type === "image") {
            _push(`<!--[-->`);
            if (item.carousel_items_id.image) {
              _push(`<img${ssrRenderAttrs(mergeProps({ ref_for: true }, unref(getImageProps)(item.carousel_items_id.image, { sm: 600, md: 800, lg: 1200 }, { quality: 85 }), {
                class: "w-full h-full object-cover",
                alt: "Carousel Image"
              }))} data-v-c78a7dc1>`);
            } else {
              _push(`<!---->`);
            }
            if (item.carousel_items_id.cta_text && item.carousel_items_id.cta_url) {
              _push(`<div class="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent flex items-end p-6 md:p-8 lg:p-10" data-v-c78a7dc1><a${ssrRenderAttr("href", item.carousel_items_id.cta_url)} target="_blank" class="inline-flex items-center gap-2 px-6 py-3 rounded-full bg-brand-500 hover:bg-brand-400 text-white hover:text-white font-bold transition-all hover:scale-105 shadow-lg" data-v-c78a7dc1>${ssrInterpolate(item.carousel_items_id.cta_text)} <svg class="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2.5" data-v-c78a7dc1><path stroke-linecap="round" stroke-linejoin="round" d="M13.5 4.5L21 12m0 0l-7.5 7.5M21 12H3" data-v-c78a7dc1></path></svg></a></div>`);
            } else {
              _push(`<!---->`);
            }
            _push(`<!--]-->`);
          } else if (item.carousel_items_id?.type === "youtube" || item.carousel_items_id?.type === "instagram") {
            _push(`<!--[-->`);
            if (getYoutubeId(item.carousel_items_id.youtube_url) || isInstagram(item.carousel_items_id.youtube_url)) {
              _push(`<button class="relative w-full h-full flex items-center justify-center group/play cursor-pointer focus:outline-none focus:ring-2 focus:ring-brand-500 rounded-2xl overflow-hidden" aria-label="Play video" data-v-c78a7dc1>`);
              if (item.carousel_items_id.image) {
                _push(`<img${ssrRenderAttrs(mergeProps({ ref_for: true }, unref(getImageProps)(item.carousel_items_id.image, { sm: 600, md: 800 }), {
                  class: "w-full h-full object-cover transition-transform duration-500 group-hover/play:scale-105",
                  alt: "Video Preview"
                }))} data-v-c78a7dc1>`);
              } else if (getYoutubeId(item.carousel_items_id.youtube_url)) {
                _push(`<img${ssrRenderAttr("src", `https://i3.ytimg.com/vi/${getYoutubeId(item.carousel_items_id.youtube_url)}/hqdefault.jpg`)} class="w-full h-full object-cover transition-transform duration-500 group-hover/play:scale-105" alt="Video Thumbnail" loading="lazy" data-v-c78a7dc1>`);
              } else if (isInstagram(item.carousel_items_id.youtube_url)) {
                _push(`<div class="w-full h-full bg-gradient-to-tr from-purple-600 via-pink-500 to-yellow-500 flex items-center justify-center transition-opacity duration-300 group-hover/play:opacity-90" data-v-c78a7dc1><div class="flex flex-col items-center gap-3" data-v-c78a7dc1><svg class="w-10 h-10 text-white fill-current" viewBox="0 0 24 24" data-v-c78a7dc1><path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z" data-v-c78a7dc1></path></svg><span class="text-xs font-semibold text-white/95 tracking-wider uppercase mt-1" data-v-c78a7dc1>Play Reel</span></div></div>`);
              } else {
                _push(`<!---->`);
              }
              if (item.carousel_items_id.video_title) {
                _push(`<div class="absolute inset-x-0 bottom-0 bg-gradient-to-t from-black/90 via-black/40 to-transparent p-4 pt-12 flex flex-col items-start text-left z-10 pointer-events-none" data-v-c78a7dc1><h3 class="text-white font-sans font-bold text-sm sm:text-base line-clamp-2 leading-tight tracking-wide drop-shadow" data-v-c78a7dc1>${ssrInterpolate(item.carousel_items_id.video_title)}</h3></div>`);
              } else {
                _push(`<!---->`);
              }
              _push(`<div class="absolute inset-0 bg-black/30 flex items-center justify-center transition-colors group-hover/play:bg-black/40" data-v-c78a7dc1><div class="w-14 h-14 rounded-full bg-brand-500/90 text-white flex items-center justify-center shadow-2xl transform group-hover/play:scale-110 transition-transform duration-300" data-v-c78a7dc1><svg class="w-7 h-7 fill-current ml-1" viewBox="0 0 24 24" data-v-c78a7dc1><path d="M8 5v14l11-7z" data-v-c78a7dc1></path></svg></div></div></button>`);
            } else {
              _push(`<div class="w-full h-full flex items-center justify-center text-stage-500" data-v-c78a7dc1> Invalid Video URL </div>`);
            }
            _push(`<!--]-->`);
          } else {
            _push(`<!---->`);
          }
          _push(`</div>`);
        });
        _push(`<!--]--></div>`);
        if (__props.items.length > 1) {
          _push(`<div class="absolute top-1/2 -translate-y-1/2 left-0 right-0 flex justify-between px-2 pointer-events-none opacity-0 group-hover:opacity-100 transition-opacity duration-300 hidden sm:flex" data-v-c78a7dc1><button class="w-12 h-12 rounded-full bg-black/50 backdrop-blur border border-white/10 flex items-center justify-center text-white pointer-events-auto hover:bg-brand-500 hover:border-brand-400 transition-all shadow-lg -translate-x-1/2" aria-label="Previous item" data-v-c78a7dc1><svg class="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2" data-v-c78a7dc1><path stroke-linecap="round" stroke-linejoin="round" d="M15 19l-7-7 7-7" data-v-c78a7dc1></path></svg></button><button class="w-12 h-12 rounded-full bg-black/50 backdrop-blur border border-white/10 flex items-center justify-center text-white pointer-events-auto hover:bg-brand-500 hover:border-brand-400 transition-all shadow-lg translate-x-1/2" aria-label="Next item" data-v-c78a7dc1><svg class="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2" data-v-c78a7dc1><path stroke-linecap="round" stroke-linejoin="round" d="M9 5l7 7-7 7" data-v-c78a7dc1></path></svg></button></div>`);
        } else {
          _push(`<!---->`);
        }
        _push(ssrRenderComponent(_component_BaseModal, {
          "is-open": !!unref(activeVideoItem),
          "max-width": unref(activeVideoItem) && isVerticalEmbed(unref(activeVideoItem).youtube_url) ? "max-w-md" : "max-w-4xl",
          onClose: ($event) => activeVideoItem.value = null
        }, {
          default: withCtx((_, _push2, _parent2, _scopeId) => {
            if (_push2) {
              if (unref(activeVideoItem)) {
                _push2(`<div class="${ssrRenderClass([isVerticalEmbed(unref(activeVideoItem).youtube_url) ? "aspect-[9/16] h-[75vh]" : "aspect-video w-full", "bg-black flex items-center justify-center w-full mx-auto"])}" data-v-c78a7dc1${_scopeId}><iframe${ssrRenderAttr("src", getVideoEmbedUrl(unref(activeVideoItem).youtube_url))} class="w-full h-full border-0" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" allowfullscreen data-v-c78a7dc1${_scopeId}></iframe></div>`);
              } else {
                _push2(`<!---->`);
              }
            } else {
              return [
                unref(activeVideoItem) ? (openBlock(), createBlock("div", {
                  key: 0,
                  class: ["bg-black flex items-center justify-center w-full mx-auto", isVerticalEmbed(unref(activeVideoItem).youtube_url) ? "aspect-[9/16] h-[75vh]" : "aspect-video w-full"]
                }, [
                  createVNode("iframe", {
                    src: getVideoEmbedUrl(unref(activeVideoItem).youtube_url),
                    class: "w-full h-full border-0",
                    allow: "accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture",
                    allowfullscreen: ""
                  }, null, 8, ["src"])
                ], 2)) : createCommentVNode("", true)
              ];
            }
          }),
          _: 1
        }, _parent));
        _push(`</div>`);
      } else {
        _push(`<!---->`);
      }
    };
  }
});
const _sfc_setup$1 = _sfc_main$1.setup;
_sfc_main$1.setup = (props, ctx) => {
  const ssrContext = useSSRContext();
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("components/MediaCarousel.vue");
  return _sfc_setup$1 ? _sfc_setup$1(props, ctx) : void 0;
};
const __nuxt_component_4 = /* @__PURE__ */ Object.assign(_export_sfc(_sfc_main$1, [["__scopeId", "data-v-c78a7dc1"]]), { __name: "MediaCarousel" });
const pageSize = 8;
const _sfc_main = /* @__PURE__ */ defineComponent({
  __name: "[slug]",
  __ssrInlineRender: true,
  async setup(__props) {
    let __temp, __restore;
    const route = useRoute();
    const slugParam = route.params.slug;
    const slug = Array.isArray(slugParam) ? slugParam[0] : slugParam;
    const { client, readItems, getImageProps } = useDirectus();
    const isLightboxOpen = ref(false);
    const { data: productions, error } = ([__temp, __restore] = withAsyncContext(async () => useAsyncData(`production-${slug}`, async () => {
      try {
        const result = await client.request(readItems("productions", {
          filter: { slug: { _eq: slug }, status: { _eq: "published" } },
          fields: [
            "*",
            {
              Venue: [{ venues_id: ["*"] }],
              events: ["*", { tags: ["*", { tags_id: ["*"] }] }],
              Cast: ["role_name", "content", "sort", { person: ["first_name", "last_name", "slug", "headshot", "bio", "pronouns"] }],
              Crew: ["title", "content", "sort", { person: ["first_name", "last_name", "slug", "headshot", "bio", "pronouns"] }],
              funders: ["*", { funder_id: ["name", "slug", "image", "url"] }],
              gallery: [{ directus_files_id: ["id"] }],
              carousel_items: ["*", { carousel_items_id: ["id", "type", "image", "cta_text", "cta_url", "youtube_url", "video_title"] }]
            }
          ],
          deep: {
            Cast: { _sort: ["sort"] },
            Crew: { _sort: ["sort"] },
            carousel_items: { _sort: ["sort"] }
          },
          limit: 1
        }));
        if (!result || result.length === 0) {
          console.warn(`[SSR Production] Not Found: "${slug}"`);
        }
        return result;
      } catch (err) {
        {
          console.error(`[SSR Production Error] Slug: "${slug}"`, err);
        }
        throw err;
      }
    })), __temp = await __temp, __restore(), __temp);
    const production = computed(() => {
      if (!productions.value || !productions.value[0]) return null;
      const prod = productions.value[0];
      const primaryVenue = prod.Venue?.[0]?.venues_id;
      return {
        ...prod,
        venueData: typeof primaryVenue === "object" ? primaryVenue : null
      };
    });
    if (!production.value && !error.value) {
      const isSystemFile = slug.includes(".") || slug.includes("_nuxt");
      if (!isSystemFile) {
        console.warn(`[SSR 404] Production slug "${slug}" not found.`);
      }
    }
    useSeoMeta({
      title: () => `${production.value?.title || "Production"} — Flux Theatre Ensemble`,
      description: () => production.value?.meta_description || production.value?.tagline || ""
    });
    const viewMode = ref("list");
    const today = /* @__PURE__ */ new Date();
    const currentMonth = ref(today.getMonth());
    const currentYear = ref(today.getFullYear());
    const monthLabel = computed(() => {
      return new Date(currentYear.value, currentMonth.value).toLocaleDateString("en-US", {
        month: "long",
        year: "numeric"
      });
    });
    const calendarDays = computed(() => {
      const firstDay = new Date(currentYear.value, currentMonth.value, 1);
      const startOffset = firstDay.getDay();
      const daysInMonth = new Date(currentYear.value, currentMonth.value + 1, 0).getDate();
      const daysInPrevMonth = new Date(currentYear.value, currentMonth.value, 0).getDate();
      const days = [];
      for (let i = startOffset - 1; i >= 0; i--) {
        const d = daysInPrevMonth - i;
        const m = currentMonth.value === 0 ? 11 : currentMonth.value - 1;
        const y = currentMonth.value === 0 ? currentYear.value - 1 : currentYear.value;
        days.push({
          date: d,
          month: "prev",
          fullDate: `${y}-${String(m + 1).padStart(2, "0")}-${String(d).padStart(2, "0")}`,
          isToday: false
        });
      }
      for (let d = 1; d <= daysInMonth; d++) {
        const fullDate = `${currentYear.value}-${String(currentMonth.value + 1).padStart(2, "0")}-${String(d).padStart(2, "0")}`;
        const isToday = d === today.getDate() && currentMonth.value === today.getMonth() && currentYear.value === today.getFullYear();
        days.push({ date: d, month: "current", fullDate, isToday });
      }
      const remaining = 42 - days.length;
      for (let d = 1; d <= remaining; d++) {
        const m = currentMonth.value === 11 ? 0 : currentMonth.value + 1;
        const y = currentMonth.value === 11 ? currentYear.value + 1 : currentYear.value;
        days.push({
          date: d,
          month: "next",
          fullDate: `${y}-${String(m + 1).padStart(2, "0")}-${String(d).padStart(2, "0")}`,
          isToday: false
        });
      }
      return days;
    });
    const weekDays = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
    function formatShowtime(iso) {
      if (!iso) return { date: "", time: "" };
      const d = new Date(iso);
      return {
        date: d.toLocaleDateString("en-US", { weekday: "short", month: "short", day: "numeric" }),
        time: d.toLocaleTimeString("en-US", { hour: "numeric", minute: "2-digit" })
      };
    }
    const performances = computed(() => {
      return (production.value?.events || []).filter((e) => e.category === "performance").sort((a, b) => new Date(a.start_datetime).getTime() - new Date(b.start_datetime).getTime());
    });
    function getPerformancesForDate(fullDate) {
      return performances.value.filter((p) => p.start_datetime.startsWith(fullDate));
    }
    const cast = computed(() => {
      return (production.value?.Cast || []).filter((c) => c && typeof c.person !== "string").map((c) => ({
        ...c,
        person: {
          ...c.person,
          // Override master bio with credit content if present
          bio: c.content || c.person.bio
        }
      }));
    });
    const crew = computed(() => {
      return (production.value?.Crew || []).filter((c) => c && typeof c.person !== "string").map((c) => ({
        ...c,
        person: {
          ...c.person,
          bio: c.content || c.person.bio
        }
      }));
    });
    const funders = computed(() => {
      return (production.value?.funders || []).map((f) => f.funder_id).filter(Boolean);
    });
    const galleryIds = computed(() => {
      const rawGallery = production.value?.gallery;
      if (!rawGallery || !Array.isArray(rawGallery)) return [];
      return rawGallery.map((item) => {
        const id = item.directus_files_id?.id || item.directus_files_id;
        return typeof id === "string" ? id : null;
      }).filter(Boolean);
    });
    const currentPage = ref(1);
    const totalPages = computed(() => Math.ceil(performances.value.length / pageSize));
    const paginatedPerformances = computed(() => {
      const start = (currentPage.value - 1) * pageSize;
      return performances.value.slice(start, start + pageSize);
    });
    watch(viewMode, () => {
      currentPage.value = 1;
    });
    const showAllCast = ref(false);
    const showAllCrew = ref(false);
    return (_ctx, _push, _parent, _attrs) => {
      const _component_NuxtLink = __nuxt_component_0;
      const _component_BlockRenderer = __nuxt_component_1;
      const _component_PersonCard = __nuxt_component_2;
      const _component_MediaGallery = __nuxt_component_3;
      const _component_MediaCarousel = __nuxt_component_4;
      _push(`<div${ssrRenderAttrs(mergeProps({ class: "production-detail" }, _attrs))} data-v-7797e490>`);
      if (unref(production)) {
        _push(`<!--[--><section class="production-detail__hero relative pt-8 pb-16" id="production-hero" data-v-7797e490><div class="production-detail__hero-bg absolute inset-0 bg-black" data-v-7797e490></div><div class="production-detail__hero-container relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8" data-v-7797e490><div class="production-detail__hero-layout flex flex-col lg:flex-row gap-10" data-v-7797e490><div class="production-detail__poster-wrapper lg:w-80 flex-shrink-0" data-v-7797e490><button class="production-detail__poster-btn block w-full group relative"${ssrRenderAttr("aria-label", `View ${unref(production).title} poster larger`)} data-v-7797e490><div class="production-detail__poster-card card-glass aspect-[3/4] overflow-hidden transition-transform duration-300 group-hover:scale-[1.02]" data-v-7797e490>`);
        if (unref(production).poster_image) {
          _push(`<img${ssrRenderAttrs(mergeProps(unref(getImageProps)(unref(production).poster_image, { sm: 600, md: 800, lg: 1200 }, { quality: 90 }), {
            alt: `${unref(production).title} poster`,
            class: "production-detail__poster-image w-full h-full object-contain"
          }))} data-v-7797e490>`);
        } else {
          _push(`<div class="production-detail__poster-placeholder w-full h-full flex items-center justify-center bg-gradient-to-br from-stage-800 to-stage-900" data-v-7797e490><span class="production-detail__placeholder-text text-stage-600 font-serif text-8xl" data-v-7797e490>F</span></div>`);
        }
        _push(`<div class="absolute inset-0 bg-brand-500/10 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center" data-v-7797e490><div class="p-2 rounded-full bg-stage-900/80 text-brand-400" data-v-7797e490><svg class="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2" data-v-7797e490><path stroke-linecap="round" stroke-linejoin="round" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0zM10 7v3m0 0v3m0-3h3m-3 0H7" data-v-7797e490></path></svg></div></div></div></button></div><div class="production-detail__info flex-1 pt-2" data-v-7797e490><div class="production-detail__meta flex items-center gap-3 mb-4" data-v-7797e490><span class="production-detail__season px-3 py-1 rounded-full text-xs font-semibold bg-brand-500/90 text-stage-950" data-v-7797e490>${ssrInterpolate(unref(production).season)}</span>`);
        _push(ssrRenderComponent(_component_NuxtLink, {
          to: "/productions",
          class: "production-detail__back-link text-xs text-stage-400 hover:text-brand-400 transition-colors"
        }, {
          default: withCtx((_, _push2, _parent2, _scopeId) => {
            if (_push2) {
              _push2(` ← All Productions `);
            } else {
              return [
                createTextVNode(" ← All Productions ")
              ];
            }
          }),
          _: 1
        }, _parent));
        _push(`</div><h1 class="production-detail__title text-4xl sm:text-5xl lg:text-6xl font-serif font-bold text-stage-50 tracking-tight leading-[1.1]" data-v-7797e490>${ssrInterpolate(unref(production).title)}</h1><p class="production-detail__tagline text-xl text-stage-300 mt-3 font-serif italic" data-v-7797e490>${ssrInterpolate(unref(production).tagline)}</p><p class="production-detail__creators text-stage-400 mt-4" data-v-7797e490> by <span class="production-detail__creator-name text-stage-200 font-medium" data-v-7797e490>${ssrInterpolate(unref(production).playwright)}</span>`);
        if (unref(production).director) {
          _push(`<!--[-->  ·  directed by <span class="production-detail__creator-name text-stage-200 font-medium" data-v-7797e490>${ssrInterpolate(unref(production).director)}</span><!--]-->`);
        } else {
          _push(`<!---->`);
        }
        _push(`</p><div class="production-detail__location mt-6 flex flex-wrap gap-4 text-sm" data-v-7797e490>`);
        if (unref(production).venueData) {
          _push(`<div class="production-detail__venue flex items-center gap-2 text-stage-300" data-v-7797e490><svg class="production-detail__location-icon w-4 h-4 text-brand-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="1.5" data-v-7797e490><path stroke-linecap="round" stroke-linejoin="round" d="M15 10.5a3 3 0 11-6 0 3 3 0 016 0z" data-v-7797e490></path><path stroke-linecap="round" stroke-linejoin="round" d="M19.5 10.5c0 7.142-7.5 11.25-7.5 11.25S4.5 17.642 4.5 10.5a7.5 7.5 0 1115 0z" data-v-7797e490></path></svg><a${ssrRenderAttr("href", unref(production).venueData.maps_url || "#")} target="_blank" class="production-detail__venue-link hover:text-brand-400 transition-colors" data-v-7797e490>${ssrInterpolate(unref(production).venueData.name)}, ${ssrInterpolate(unref(production).venueData.city)}</a></div>`);
        } else {
          _push(`<!---->`);
        }
        _push(`</div><div class="production-detail__description mt-8 text-stage-300 leading-relaxed max-w-none prose prose-invert prose-sm sm:prose-base" data-v-7797e490>`);
        _push(ssrRenderComponent(_component_BlockRenderer, {
          content: unref(production).description
        }, null, _parent));
        _push(`</div></div></div></div></section>`);
        if (unref(performances).length) {
          _push(`<section class="production-showtimes production-section py-16" id="showtimes" data-v-7797e490><div class="production-showtimes__container max-w-7xl mx-auto px-4 sm:px-6 lg:px-8" data-v-7797e490><div class="production-showtimes__header flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-8" data-v-7797e490><h2 class="production-showtimes__title section-heading md:text-xl mb-0" data-v-7797e490>Showtimes &amp; Tickets</h2><div class="production-showtimes__view-toggle flex items-center bg-stage-900/50 p-1 rounded-lg border border-stage-800/50" data-v-7797e490><button class="${ssrRenderClass([unref(viewMode) === "calendar" ? "bg-stage-800 text-brand-300 shadow-sm" : "text-stage-300 hover:text-stage-100", "px-3 py-1.5 rounded-md text-xs font-medium transition-all flex items-center gap-2"])}" data-v-7797e490><svg class="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" data-v-7797e490><path stroke-linecap="round" stroke-linejoin="round" d="M6.75 3v2.25M17.25 3v2.25M3 18.75V7.5a2.25 2.25 0 012.25-2.25h13.5A2.25 2.25 0 0121 7.5v11.25m-18 0A2.25 2.25 0 005.25 21h13.5A2.25 2.25 0 0021 18.75m-18 0v-7.5A2.25 2.25 0 015.25 9h13.5A2.25 2.25 0 0121 11.25v7.5" data-v-7797e490></path></svg> Calendar </button><button class="${ssrRenderClass([unref(viewMode) === "list" ? "bg-stage-800 text-brand-300 shadow-sm" : "text-stage-300 hover:text-stage-100", "px-3 py-1.5 rounded-md text-xs font-medium transition-all flex items-center gap-2"])}" data-v-7797e490><svg class="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" data-v-7797e490><path stroke-linecap="round" stroke-linejoin="round" d="M8.25 6.75h12M8.25 12h12m-12 5.25h12M3.75 6.75h.007v.008H3.75V6.75zm.375 0a.375.375 0 11-.75 0 .375.375 0 01.75 0zM3.75 12h.007v.008H3.75V12zm.375 0a.375.375 0 11-.75 0 .375.375 0 01.75 0zm-.375 5.25h.007v.008H3.75v-.008zm.375 0a.375.375 0 11-.75 0 .375.375 0 01.75 0z" data-v-7797e490></path></svg> List </button></div></div>`);
          if (unref(viewMode) === "list") {
            _push(`<div class="production-showtimes__list flex flex-col gap-3" data-v-7797e490><div class="production-showtimes__grid grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3" data-v-7797e490><!--[-->`);
            ssrRenderList(unref(paginatedPerformances), (show) => {
              _push(ssrRenderComponent(_component_NuxtLink, {
                key: show.id,
                to: `/events/${show.slug}`,
                class: ["production-showtimes__card card-glass p-3 border-l-4 transition-all hover:translate-y-[-2px] hover:border-brand-500 group", show.ticket_url ? "border-brand-500/30" : "border-stage-700/30"]
              }, {
                default: withCtx((_, _push2, _parent2, _scopeId) => {
                  if (_push2) {
                    _push2(`<div class="flex items-center justify-between gap-4" data-v-7797e490${_scopeId}><div class="flex flex-col" data-v-7797e490${_scopeId}><span class="text-stage-950 font-bold text-sm leading-tight" data-v-7797e490${_scopeId}>${ssrInterpolate(formatShowtime(show.start_datetime).date)}</span><span class="text-brand-700 text-[11px] font-bold" data-v-7797e490${_scopeId}>${ssrInterpolate(formatShowtime(show.start_datetime).time)}</span></div><div class="flex-shrink-0" data-v-7797e490${_scopeId}>`);
                    if (show.is_sold_out) {
                      _push2(`<span class="text-[9px] font-bold uppercase text-red-600 bg-red-50 px-2 py-1 rounded border border-red-100" data-v-7797e490${_scopeId}> Sold Out </span>`);
                    } else if (show.ticket_url) {
                      _push2(`<span class="text-[9px] font-bold uppercase text-brand-600 bg-brand-50 px-2 py-1 rounded border border-brand-100 group-hover:bg-brand-500 group-hover:text-white transition-colors" data-v-7797e490${_scopeId}> Tickets </span>`);
                    } else {
                      _push2(`<span class="text-[9px] font-bold uppercase text-stage-400 italic" data-v-7797e490${_scopeId}> Soon </span>`);
                    }
                    _push2(`</div></div>`);
                    if (show.tags?.length) {
                      _push2(`<div class="flex flex-wrap gap-1 mt-2" data-v-7797e490${_scopeId}><!--[-->`);
                      ssrRenderList(show.tags.slice(0, 2), (tag) => {
                        _push2(`<span class="text-[9px] px-1.5 py-0.5 rounded bg-stage-50/50 text-stage-600 border border-stage-200/50" data-v-7797e490${_scopeId}>${ssrInterpolate(tag.tags_id?.name || tag.tags_id)}</span>`);
                      });
                      _push2(`<!--]--></div>`);
                    } else {
                      _push2(`<!---->`);
                    }
                  } else {
                    return [
                      createVNode("div", { class: "flex items-center justify-between gap-4" }, [
                        createVNode("div", { class: "flex flex-col" }, [
                          createVNode("span", { class: "text-stage-950 font-bold text-sm leading-tight" }, toDisplayString(formatShowtime(show.start_datetime).date), 1),
                          createVNode("span", { class: "text-brand-700 text-[11px] font-bold" }, toDisplayString(formatShowtime(show.start_datetime).time), 1)
                        ]),
                        createVNode("div", { class: "flex-shrink-0" }, [
                          show.is_sold_out ? (openBlock(), createBlock("span", {
                            key: 0,
                            class: "text-[9px] font-bold uppercase text-red-600 bg-red-50 px-2 py-1 rounded border border-red-100"
                          }, " Sold Out ")) : show.ticket_url ? (openBlock(), createBlock("span", {
                            key: 1,
                            class: "text-[9px] font-bold uppercase text-brand-600 bg-brand-50 px-2 py-1 rounded border border-brand-100 group-hover:bg-brand-500 group-hover:text-white transition-colors"
                          }, " Tickets ")) : (openBlock(), createBlock("span", {
                            key: 2,
                            class: "text-[9px] font-bold uppercase text-stage-400 italic"
                          }, " Soon "))
                        ])
                      ]),
                      show.tags?.length ? (openBlock(), createBlock("div", {
                        key: 0,
                        class: "flex flex-wrap gap-1 mt-2"
                      }, [
                        (openBlock(true), createBlock(Fragment, null, renderList(show.tags.slice(0, 2), (tag) => {
                          return openBlock(), createBlock("span", {
                            key: tag.id,
                            class: "text-[9px] px-1.5 py-0.5 rounded bg-stage-50/50 text-stage-600 border border-stage-200/50"
                          }, toDisplayString(tag.tags_id?.name || tag.tags_id), 1);
                        }), 128))
                      ])) : createCommentVNode("", true)
                    ];
                  }
                }),
                _: 2
              }, _parent));
            });
            _push(`<!--]--></div>`);
            if (unref(totalPages) > 1) {
              _push(`<div class="production-showtimes__pagination flex items-center justify-center gap-4 mt-8 pt-6 border-t border-stage-100/10" data-v-7797e490><button${ssrIncludeBooleanAttr(unref(currentPage) === 1) ? " disabled" : ""} class="p-2 rounded-full bg-stage-900/50 text-stage-400 disabled:opacity-20 hover:text-brand-400 transition-colors" data-v-7797e490><svg class="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" data-v-7797e490><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 19l-7-7 7-7" data-v-7797e490></path></svg></button><div class="flex gap-2" data-v-7797e490><!--[-->`);
              ssrRenderList(unref(totalPages), (p) => {
                _push(`<button class="${ssrRenderClass([unref(currentPage) === p ? "bg-brand-500 text-white shadow-lg" : "bg-stage-900/30 text-stage-400 hover:bg-stage-800", "w-8 h-8 rounded-lg text-xs font-bold transition-all"])}" data-v-7797e490>${ssrInterpolate(p)}</button>`);
              });
              _push(`<!--]--></div><button${ssrIncludeBooleanAttr(unref(currentPage) === unref(totalPages)) ? " disabled" : ""} class="p-2 rounded-full bg-stage-900/50 text-stage-400 disabled:opacity-20 hover:text-brand-400 transition-colors" data-v-7797e490><svg class="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" data-v-7797e490><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5l7 7-7 7" data-v-7797e490></path></svg></button></div>`);
            } else {
              _push(`<!---->`);
            }
            _push(`</div>`);
          } else {
            _push(`<!---->`);
          }
          if (unref(viewMode) === "calendar") {
            _push(`<div class="production-showtimes__calendar" data-v-7797e490><div class="production-showtimes__calendar-wrapper card-glass p-6 md:p-8" data-v-7797e490><div class="flex items-center justify-between mb-8" data-v-7797e490><button class="p-2 rounded-lg hover:bg-stage-100 text-stage-600 transition-colors" data-v-7797e490><svg class="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" data-v-7797e490><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 19l-7-7 7-7" data-v-7797e490></path></svg></button><h3 class="text-xl font-serif font-bold text-stage-900" data-v-7797e490>${ssrInterpolate(unref(monthLabel))}</h3><button class="p-2 rounded-lg hover:bg-stage-100 text-stage-600 transition-colors" data-v-7797e490><svg class="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" data-v-7797e490><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5l7 7-7 7" data-v-7797e490></path></svg></button></div><div class="grid grid-cols-7 gap-px bg-stage-800/30 border border-stage-800/50 rounded-lg overflow-hidden" data-v-7797e490><!--[-->`);
            ssrRenderList(weekDays, (day) => {
              _push(`<div class="py-3 text-center text-[11px] uppercase tracking-wider font-bold text-stage-600 bg-stage-50/50 border-b border-stage-200" data-v-7797e490>${ssrInterpolate(day)}</div>`);
            });
            _push(`<!--]--><!--[-->`);
            ssrRenderList(unref(calendarDays), (day) => {
              _push(`<div class="${ssrRenderClass([[
                day.month !== "current" ? "bg-stage-50/50 opacity-40 text-stage-400" : "bg-white text-stage-700",
                day.isToday ? "ring-1 ring-inset ring-brand-500/20 bg-brand-500/5" : ""
              ], "min-h-[80px] md:min-h-[100px] p-2 flex flex-col transition-colors border-t border-r border-stage-800/50"])}" data-v-7797e490><span class="${ssrRenderClass([day.isToday ? "text-brand-700" : "text-stage-900", "text-xs font-bold mb-1"])}" data-v-7797e490>${ssrInterpolate(day.date)}</span><div class="flex flex-col gap-1.5 mt-1" data-v-7797e490><!--[-->`);
              ssrRenderList(getPerformancesForDate(day.fullDate), (perf) => {
                _push(`<a${ssrRenderAttr("href", perf.ticket_url || "#")}${ssrRenderAttr("target", perf.ticket_url ? "_blank" : "_self")} class="${ssrRenderClass([[
                  perf.ticket_url && !perf.is_sold_out ? "bg-brand-50 border-brand-200 hover:bg-brand-100" : "bg-stage-50 border-stage-200 opacity-90"
                ], "group relative flex flex-col p-1.5 rounded transition-all border-l-2"])}"${ssrRenderAttr("title", `${formatShowtime(perf.start_datetime).time}${perf.is_sold_out ? " (Sold Out)" : ""}`)} data-v-7797e490><div class="flex items-center justify-between gap-1 mb-0.5" data-v-7797e490><span class="text-[9px] md:text-[10px] font-bold text-stage-950" data-v-7797e490>${ssrInterpolate(formatShowtime(perf.start_datetime).time)}</span>`);
                if (perf.ticket_url && !perf.is_sold_out) {
                  _push(`<span class="text-[8px] md:text-[9px] uppercase font-black text-brand-700 group-hover:text-brand-900 transition-colors" data-v-7797e490>Tickets</span>`);
                } else if (perf.is_sold_out) {
                  _push(`<span class="text-[8px] md:text-[9px] uppercase font-black text-red-700" data-v-7797e490>Sold Out</span>`);
                } else {
                  _push(`<!---->`);
                }
                _push(`</div>`);
                if (perf.tags?.length) {
                  _push(`<div class="flex flex-wrap gap-0.5" data-v-7797e490><!--[-->`);
                  ssrRenderList(perf.tags.slice(0, 1), (tag) => {
                    _push(`<span class="text-[8px] md:text-[9px] px-1 py-0.5 rounded-sm bg-stage-50 text-stage-700 border border-stage-200 font-bold truncate max-w-full" data-v-7797e490>${ssrInterpolate(tag.tags_id?.name || tag.tags_id)}</span>`);
                  });
                  _push(`<!--]--></div>`);
                } else {
                  _push(`<!---->`);
                }
                _push(`</a>`);
              });
              _push(`<!--]--></div></div>`);
            });
            _push(`<!--]--></div></div></div>`);
          } else {
            _push(`<!---->`);
          }
          _push(`</div></section>`);
        } else {
          _push(`<!---->`);
        }
        if (unref(production).content) {
          _push(`<section class="production-content py-16 production-section" id="overview" data-v-7797e490><div class="production-content__container max-w-7xl mx-auto px-4 sm:px-6 lg:px-8" data-v-7797e490><div class="production-content__body prose prose-invert prose-lg max-w-none" data-v-7797e490>`);
          _push(ssrRenderComponent(_component_BlockRenderer, {
            content: unref(production).content
          }, null, _parent));
          _push(`</div></div></section>`);
        } else {
          _push(`<!---->`);
        }
        if (unref(cast).length) {
          _push(`<section class="production-cast production-section py-16" id="cast-section" data-v-7797e490><div class="production-cast__container max-w-7xl mx-auto px-4 sm:px-6 lg:px-8" data-v-7797e490><h2 class="production-cast__title section-heading mb-8 md:text-xl" data-v-7797e490>Cast</h2><div class="${ssrRenderClass(["production-cast__grid grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4", { "is-collapsed": !unref(showAllCast) }])}" data-v-7797e490><!--[-->`);
          ssrRenderList(unref(cast), (credit) => {
            _push(ssrRenderComponent(_component_PersonCard, {
              key: credit.person.slug,
              person: credit.person,
              role: credit.role_name,
              class: "production-cast__person-card",
              compact: ""
            }, null, _parent));
          });
          _push(`<!--]--></div>`);
          if (unref(cast).length > 3) {
            _push(`<div class="${ssrRenderClass(["mt-8 flex justify-center see-more-container", `count-${unref(cast).length}`])}" data-v-7797e490><button class="text-brand-400 hover:text-brand-300 font-medium text-sm transition-colors border-b border-brand-400/30 hover:border-brand-300 pb-0.5" data-v-7797e490>${ssrInterpolate(unref(showAllCast) ? "See Less" : "See More")}</button></div>`);
          } else {
            _push(`<!---->`);
          }
          _push(`</div></section>`);
        } else {
          _push(`<!---->`);
        }
        if (unref(crew).length) {
          _push(`<section class="production-crew py-16 production-section" id="crew-section" data-v-7797e490><div class="production-crew__container max-w-7xl mx-auto px-4 sm:px-6 lg:px-8" data-v-7797e490><h2 class="production-crew__title section-heading mb-8 md:text-xl" data-v-7797e490>Creative Team</h2><div class="${ssrRenderClass(["production-crew__grid grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4", { "is-collapsed": !unref(showAllCrew) }])}" data-v-7797e490><!--[-->`);
          ssrRenderList(unref(crew), (credit) => {
            _push(ssrRenderComponent(_component_PersonCard, {
              key: credit.person.slug,
              person: credit.person,
              role: credit.title,
              class: "production-crew__person-card",
              compact: ""
            }, null, _parent));
          });
          _push(`<!--]--></div>`);
          if (unref(crew).length > 3) {
            _push(`<div class="${ssrRenderClass(["mt-8 flex justify-center see-more-container", `count-${unref(crew).length}`])}" data-v-7797e490><button class="text-brand-400 hover:text-brand-300 font-medium text-sm transition-colors border-b border-brand-400/30 hover:border-brand-300 pb-0.5" data-v-7797e490>${ssrInterpolate(unref(showAllCrew) ? "See Less" : "See More")}</button></div>`);
          } else {
            _push(`<!---->`);
          }
          _push(`</div></section>`);
        } else {
          _push(`<!---->`);
        }
        if (unref(galleryIds).length) {
          _push(`<section class="production-gallery py-16 bg-stage-950" id="gallery-section" data-v-7797e490><div class="production-gallery__container max-w-7xl mx-auto px-4 sm:px-6 lg:px-8" data-v-7797e490>`);
          _push(ssrRenderComponent(_component_MediaGallery, {
            images: unref(galleryIds),
            title: "Production Photos",
            viewtype: "dark"
          }, null, _parent));
          _push(`</div></section>`);
        } else {
          _push(`<!---->`);
        }
        if (unref(production).carousel_items?.length) {
          _push(`<section class="production-carousel-section py-16 production-section" id="carousel-section" data-v-7797e490><div class="production-carousel__container max-w-7xl mx-auto" data-v-7797e490>`);
          _push(ssrRenderComponent(_component_MediaCarousel, {
            items: unref(production).carousel_items,
            title: unref(production).carousel_title
          }, null, _parent));
          _push(`</div></section>`);
        } else {
          _push(`<!---->`);
        }
        if (unref(funders).length) {
          _push(`<section class="production-funders py-16 production-section" id="funders-section" data-v-7797e490><div class="production-funders__container max-w-7xl mx-auto px-4 sm:px-6 lg:px-8" data-v-7797e490><h2 class="production-funders__title section-heading mb-8 md:text-xl" data-v-7797e490>Our Funders</h2><div class="production-funders__grid flex flex-wrap items-center justify-center gap-12" data-v-7797e490><!--[-->`);
          ssrRenderList(unref(funders), (funder) => {
            _push(ssrRenderComponent(_component_NuxtLink, {
              key: funder.slug,
              to: `/funders/${funder.slug}`,
              class: "production-funders__item group flex flex-col items-center gap-4 transition-all hover:scale-105",
              title: funder.name
            }, {
              default: withCtx((_, _push2, _parent2, _scopeId) => {
                if (_push2) {
                  _push2(`<div class="production-funders__logo-wrapper w-32 h-32 bg-white rounded-xl shadow-lg border border-stage-800/20 p-5 flex items-center justify-center overflow-hidden group-hover:border-brand-500/50 transition-colors" data-v-7797e490${_scopeId}>`);
                  if (funder.image) {
                    _push2(`<img${ssrRenderAttrs(mergeProps({ ref_for: true }, unref(getImageProps)(funder.image, { sm: 240 }, { quality: 80 }), {
                      alt: funder.name,
                      class: "production-funders__logo w-full h-full object-contain grayscale group-hover:grayscale-0 transition-all duration-500"
                    }))} data-v-7797e490${_scopeId}>`);
                  } else {
                    _push2(`<span class="text-stage-900 font-serif font-bold text-xl" data-v-7797e490${_scopeId}>${ssrInterpolate(funder.name)}</span>`);
                  }
                  _push2(`</div>`);
                } else {
                  return [
                    createVNode("div", { class: "production-funders__logo-wrapper w-32 h-32 bg-white rounded-xl shadow-lg border border-stage-800/20 p-5 flex items-center justify-center overflow-hidden group-hover:border-brand-500/50 transition-colors" }, [
                      funder.image ? (openBlock(), createBlock("img", mergeProps({
                        key: 0,
                        ref_for: true
                      }, unref(getImageProps)(funder.image, { sm: 240 }, { quality: 80 }), {
                        alt: funder.name,
                        class: "production-funders__logo w-full h-full object-contain grayscale group-hover:grayscale-0 transition-all duration-500"
                      }), null, 16, ["alt"])) : (openBlock(), createBlock("span", {
                        key: 1,
                        class: "text-stage-900 font-serif font-bold text-xl"
                      }, toDisplayString(funder.name), 1))
                    ])
                  ];
                }
              }),
              _: 2
            }, _parent));
          });
          _push(`<!--]--></div></div></section>`);
        } else {
          _push(`<!---->`);
        }
        ssrRenderTeleport(_push, (_push2) => {
          if (unref(isLightboxOpen)) {
            _push2(`<div class="fixed inset-0 z-[200] flex items-center justify-center p-4 md:p-12" data-v-7797e490><div class="absolute inset-0 bg-black/95 backdrop-blur-md" data-v-7797e490></div><button class="absolute top-6 right-6 text-stage-400 hover:text-white transition-colors z-[210] p-2 bg-stage-900/50 rounded-full" data-v-7797e490><svg class="w-8 h-8" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2.5" data-v-7797e490><path stroke-linecap="round" stroke-linejoin="round" d="M6 18L18 6M6 6l12 12" data-v-7797e490></path></svg></button><div class="relative max-w-full max-h-full flex items-center justify-center z-[205]" data-v-7797e490>`);
            if (unref(production).poster_image) {
              _push2(`<img${ssrRenderAttrs(mergeProps(unref(getImageProps)(unref(production).poster_image, { sm: 800, md: 1200, lg: 1920 }, { quality: 90 }), {
                alt: unref(production).title,
                class: "max-w-full max-h-[90vh] object-contain shadow-2xl animate-scale-in"
              }))} data-v-7797e490>`);
            } else {
              _push2(`<!---->`);
            }
            _push2(`</div></div>`);
          } else {
            _push2(`<!---->`);
          }
        }, "body", false, _parent);
        _push(`<!--]-->`);
      } else {
        _push(`<!---->`);
      }
      _push(`</div>`);
    };
  }
});
const _sfc_setup = _sfc_main.setup;
_sfc_main.setup = (props, ctx) => {
  const ssrContext = useSSRContext();
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("pages/productions/[slug].vue");
  return _sfc_setup ? _sfc_setup(props, ctx) : void 0;
};
const _slug_ = /* @__PURE__ */ _export_sfc(_sfc_main, [["__scopeId", "data-v-7797e490"]]);

export { _slug_ as default };
//# sourceMappingURL=_slug_-Dd--RqUM.mjs.map
