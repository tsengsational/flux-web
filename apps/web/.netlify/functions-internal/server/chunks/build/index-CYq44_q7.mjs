import { _ as __nuxt_component_0 } from './nuxt-link-cZpXnfBZ.mjs';
import { _ as __nuxt_component_0$1 } from './ProductionCard-V7SgolUz.mjs';
import { _ as __nuxt_component_2 } from './EventCard-D3M1g4iQ.mjs';
import { _ as __nuxt_component_3 } from './BlogPostCard-DQjYsPgS.mjs';
import { defineComponent, withAsyncContext, computed, ref, mergeProps, unref, withCtx, createTextVNode, toDisplayString, useSSRContext } from 'vue';
import { ssrRenderAttrs, ssrRenderList, ssrRenderClass, ssrInterpolate, ssrRenderComponent, ssrRenderAttr, ssrRenderStyle } from 'vue/server-renderer';
import { u as useDirectus, a as useAsyncData } from './asyncData-DO9zjVnq.mjs';
import { _ as _export_sfc } from './server.mjs';
import '../_/nitro.mjs';
import 'node:http';
import 'node:https';
import 'node:events';
import 'node:buffer';
import 'node:fs';
import 'node:path';
import 'node:crypto';
import 'date-fns-tz';
import '@directus/sdk';
import '../routes/renderer.mjs';
import 'vue-bundle-renderer/runtime';
import 'unhead/server';
import 'devalue';
import 'unhead/plugins';
import 'unhead/utils';
import 'vue-router';

const _sfc_main = /* @__PURE__ */ defineComponent({
  __name: "index",
  __ssrInlineRender: true,
  async setup(__props) {
    let __temp, __restore;
    const { client, readItems, readSingleton, getImageProps } = useDirectus();
    const { data: homeData } = ([__temp, __restore] = withAsyncContext(async () => useAsyncData("home-data", async () => {
      const raw = await client.request(readSingleton("homepage", {
        fields: [
          "*",
          {
            hero_slides: [
              "*",
              { cta_primary_link: ["collection", { item: { productions: ["slug"], posts: ["slug"], pages: ["slug"], events: ["slug"] } }] },
              { cta_secondary_link: ["collection", { item: { productions: ["slug"], posts: ["slug"], pages: ["slug"], events: ["slug"] } }] }
            ]
          }
        ]
      }));
      return raw;
    })), __temp = await __temp, __restore(), __temp);
    const { data: onStageItems } = ([__temp, __restore] = withAsyncContext(async () => useAsyncData("home-on-stage", async () => {
      const nowStr = (/* @__PURE__ */ new Date()).toISOString();
      const prodRaw = await client.request(readItems("productions", {
        fields: ["*", "featured"],
        filter: {
          status: { _eq: "published" },
          _or: [
            { closing_date: { _gte: nowStr } },
            { closing_date: { _null: true } }
          ]
        },
        limit: 6
      }));
      const eventsRaw = await client.request(readItems("events", {
        fields: [
          "*",
          "featured",
          "venue.*",
          { tags: ["*", { tags_id: ["*"] }] }
        ],
        filter: {
          status: { _eq: "published" },
          start_datetime: { _gte: nowStr }
        },
        limit: 6
      }));
      const merged = [
        ...prodRaw.map((p) => ({ _type: "production", data: p })),
        ...eventsRaw.map((e) => ({ _type: "event", data: e }))
      ];
      merged.sort((a, b) => {
        const featA = a.data.featured ? 1 : 0;
        const featB = b.data.featured ? 1 : 0;
        if (featA !== featB) return featB - featA;
        const dateA = new Date(a.data.opening_date || a.data.start_datetime).getTime();
        const dateB = new Date(b.data.opening_date || b.data.start_datetime).getTime();
        if (dateA !== dateB) return dateA - dateB;
        return a._type === "production" ? -1 : 1;
      });
      return merged.slice(0, 3);
    })), __temp = await __temp, __restore(), __temp);
    const { data: newsHighlights } = ([__temp, __restore] = withAsyncContext(() => useAsyncData(
      "home-news",
      () => client.request(readItems("posts", {
        filter: { status: { _eq: "published" } },
        sort: ["-publish_date"],
        limit: 2
      }))
    )), __temp = await __temp, __restore(), __temp);
    const publishedSlides = computed(() => {
      const slides = homeData.value?.hero_slides;
      if (!slides || !Array.isArray(slides)) return [];
      return slides.filter((s) => {
        if (Array.isArray(s.status)) return s.status.includes("published");
        return s.status === "published";
      }).sort((a, b) => (a.sort ?? 0) - (b.sort ?? 0));
    });
    const hasSlides = computed(() => publishedSlides.value.length > 0);
    const currentSlide = ref(0);
    function getSlideUrl(slide, primary) {
      const type = primary ? slide.cta_primary_type : slide.cta_secondary_type;
      if (type === "external") return primary ? slide.cta_primary_external : slide.cta_secondary_external;
      let link = primary ? slide.cta_primary_link : slide.cta_secondary_link;
      if (Array.isArray(link)) {
        link = link[0];
      }
      if (!link || !link.item || !link.collection) return primary ? slide.cta_primary_url : slide.cta_secondary_url;
      const paths = {
        "pages": "/",
        "posts": "/news/",
        "productions": "/productions/",
        "events": "/events/"
      };
      const prefix = paths[link.collection] || "/";
      const slug = link.item.slug || link.item;
      if (!slug) return primary ? slide.cta_primary_url : slide.cta_secondary_url;
      return prefix + slug;
    }
    return (_ctx, _push, _parent, _attrs) => {
      const _component_NuxtLink = __nuxt_component_0;
      const _component_ProductionCard = __nuxt_component_0$1;
      const _component_EventCard = __nuxt_component_2;
      const _component_BlogPostCard = __nuxt_component_3;
      _push(`<div${ssrRenderAttrs(mergeProps({ class: "home-page" }, _attrs))} data-v-d4e29e04><section class="home-hero relative min-h-[85vh] flex items-center overflow-hidden" id="hero-section" data-v-d4e29e04>`);
      if (unref(hasSlides)) {
        _push(`<!--[--><!--[-->`);
        ssrRenderList(unref(publishedSlides), (slide, i) => {
          _push(`<div class="${ssrRenderClass([{ "hero-slide--active": i === unref(currentSlide) }, "hero-slide absolute inset-0"])}" data-v-d4e29e04>`);
          if (slide.background_image) {
            _push(`<img${ssrRenderAttrs(mergeProps({ ref_for: true }, unref(getImageProps)(slide.background_image, { sm: 800, md: 1200, lg: 1920 }, { quality: 85 }), {
              class: "absolute inset-0 w-full h-full object-cover",
              alt: ""
            }))} data-v-d4e29e04>`);
          } else {
            _push(`<!---->`);
          }
          _push(`<div class="absolute inset-0 bg-gradient-to-br from-stage-950 via-stage-900/80 to-curtain-700/20" data-v-d4e29e04></div><div class="absolute inset-0 bg-stage-950/20" data-v-d4e29e04></div><div class="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-24 h-full flex items-center" data-v-d4e29e04><div class="${ssrRenderClass([{ "hero-slide__content--active": i === unref(currentSlide) }, "max-w-3xl hero-slide__content"])}" data-v-d4e29e04>`);
          if (slide.subtitle) {
            _push(`<p class="text-brand-400 font-medium text-sm uppercase tracking-[0.2em] mb-4" data-v-d4e29e04>${ssrInterpolate(slide.subtitle)}</p>`);
          } else {
            _push(`<!---->`);
          }
          _push(`<h1 class="text-5xl sm:text-6xl lg:text-7xl font-serif font-bold text-stage-50 leading-[1.1] tracking-tight hero-title-dynamic" data-v-d4e29e04>${slide.title ?? ""}</h1>`);
          if (slide.description) {
            _push(`<p class="mt-6 text-lg sm:text-xl text-stage-300 leading-relaxed max-w-xl" data-v-d4e29e04>${ssrInterpolate(slide.description)}</p>`);
          } else {
            _push(`<!---->`);
          }
          _push(`<div class="mt-8 flex gap-4 flex-wrap" data-v-d4e29e04>`);
          if (slide.cta_primary_label && getSlideUrl(slide, true)) {
            _push(ssrRenderComponent(_component_NuxtLink, {
              to: getSlideUrl(slide, true),
              class: "btn-primary text-brand-400 hover:text-brand-200 transition-colors underline underline-offset-4",
              id: `hero-cta-primary-${i}`
            }, {
              default: withCtx((_, _push2, _parent2, _scopeId) => {
                if (_push2) {
                  _push2(`${ssrInterpolate(slide.cta_primary_label)}`);
                } else {
                  return [
                    createTextVNode(toDisplayString(slide.cta_primary_label), 1)
                  ];
                }
              }),
              _: 2
            }, _parent));
          } else {
            _push(`<!---->`);
          }
          if (slide.cta_secondary_label && getSlideUrl(slide, false)) {
            _push(ssrRenderComponent(_component_NuxtLink, {
              to: getSlideUrl(slide, false),
              class: "btn-secondary text-brand-400 hover:text-brand-200 transition-colors underline underline-offset-4",
              id: `hero-cta-secondary-${i}`
            }, {
              default: withCtx((_, _push2, _parent2, _scopeId) => {
                if (_push2) {
                  _push2(`${ssrInterpolate(slide.cta_secondary_label)}`);
                } else {
                  return [
                    createTextVNode(toDisplayString(slide.cta_secondary_label), 1)
                  ];
                }
              }),
              _: 2
            }, _parent));
          } else {
            _push(`<!---->`);
          }
          _push(`</div></div></div></div>`);
        });
        _push(`<!--]-->`);
        if (unref(publishedSlides).length > 1) {
          _push(`<button class="hero-arrow hero-arrow--prev absolute left-4 top-1/2 -translate-y-1/2 z-20" aria-label="Previous slide" data-v-d4e29e04><svg width="32" height="32" viewBox="0 0 32 32" fill="none" data-v-d4e29e04><circle cx="16" cy="16" r="16" fill="rgba(0,0,0,0.4)" data-v-d4e29e04></circle><path d="M19 10l-6 6 6 6" stroke="white" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" data-v-d4e29e04></path></svg></button>`);
        } else {
          _push(`<!---->`);
        }
        if (unref(publishedSlides).length > 1) {
          _push(`<button class="hero-arrow hero-arrow--next absolute right-4 top-1/2 -translate-y-1/2 z-20" aria-label="Next slide" data-v-d4e29e04><svg width="32" height="32" viewBox="0 0 32 32" fill="none" data-v-d4e29e04><circle cx="16" cy="16" r="16" fill="rgba(0,0,0,0.4)" data-v-d4e29e04></circle><path d="M13 10l6 6-6 6" stroke="white" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" data-v-d4e29e04></path></svg></button>`);
        } else {
          _push(`<!---->`);
        }
        if (unref(publishedSlides).length > 1) {
          _push(`<div class="hero-dots absolute bottom-16 left-1/2 -translate-x-1/2 z-20 flex gap-2" data-v-d4e29e04><!--[-->`);
          ssrRenderList(unref(publishedSlides), (_, i) => {
            _push(`<button class="${ssrRenderClass([{ "hero-dot--active": i === unref(currentSlide) }, "hero-dot"])}"${ssrRenderAttr("aria-label", `Go to slide ${i + 1}`)} data-v-d4e29e04></button>`);
          });
          _push(`<!--]--></div>`);
        } else {
          _push(`<!---->`);
        }
        _push(`<div class="absolute top-0 right-0 w-[600px] h-[600px] rounded-full bg-brand-500/5 blur-3xl pointer-events-none" data-v-d4e29e04></div><div class="absolute bottom-0 left-0 w-[400px] h-[400px] rounded-full bg-curtain-500/5 blur-3xl pointer-events-none" data-v-d4e29e04></div><!--]-->`);
      } else {
        _push(`<!--[--><div class="home-hero__bg absolute inset-0" data-v-d4e29e04>`);
        if (unref(homeData)?.hero_image) {
          _push(`<img${ssrRenderAttrs(mergeProps(unref(getImageProps)(unref(homeData).hero_image, { sm: 800, md: 1200, lg: 1920 }, { quality: 85 }), {
            class: "absolute inset-0 w-full h-full object-cover",
            alt: "Hero background"
          }))} data-v-d4e29e04>`);
        } else {
          _push(`<!---->`);
        }
        _push(`<div class="absolute inset-0 bg-gradient-to-br from-stage-950 via-stage-900/80 to-curtain-700/20" data-v-d4e29e04></div>`);
        if (unref(homeData)?.hero_image) {
          _push(`<div class="absolute inset-0 bg-stage-950/10" data-v-d4e29e04></div>`);
        } else {
          _push(`<!---->`);
        }
        _push(`<div class="absolute top-0 right-0 w-[600px] h-[600px] rounded-full bg-brand-500/5 blur-3xl" data-v-d4e29e04></div><div class="absolute bottom-0 left-0 w-[400px] h-[400px] rounded-full bg-curtain-500/5 blur-3xl" data-v-d4e29e04></div></div><div class="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-24" data-v-d4e29e04><div class="max-w-3xl" data-v-d4e29e04><p class="text-brand-400 font-medium text-sm uppercase tracking-[0.2em] mb-4 animate-fade-in" data-v-d4e29e04>${ssrInterpolate(unref(homeData)?.hero_tagline || "Now in our 20th Season")}</p>`);
        if (unref(homeData)?.hero_title) {
          _push(`<h1 class="hero-title-dynamic text-5xl sm:text-6xl lg:text-7xl font-serif font-bold text-stage-50 leading-[1.1] tracking-tight animate-slide-up" data-v-d4e29e04>${unref(homeData).hero_title ?? ""}</h1>`);
        } else {
          _push(`<h1 class="text-5xl sm:text-6xl lg:text-7xl font-serif font-bold text-stage-50 leading-[1.1] tracking-tight animate-slide-up" data-v-d4e29e04> Adventurous Theatre<br data-v-d4e29e04><span class="bg-gradient-to-r from-brand-400 to-brand-200 bg-clip-text text-transparent" data-v-d4e29e04>in New York City</span></h1>`);
        }
        _push(`<p class="mt-6 text-lg sm:text-xl text-stage-300 leading-relaxed max-w-xl animate-slide-up" style="${ssrRenderStyle({ "animation-delay": "0.1s" })}" data-v-d4e29e04>${ssrInterpolate(unref(homeData)?.hero_description || "Flux Theatre Ensemble builds new works and reimagines classics with a company of adventurous artists and an engaged audience.")}</p><div class="mt-8 flex gap-4 animate-slide-up flex-wrap" style="${ssrRenderStyle({ "animation-delay": "0.2s" })}" data-v-d4e29e04>`);
        _push(ssrRenderComponent(_component_NuxtLink, {
          to: unref(homeData)?.hero_cta_primary_link || "/productions",
          class: "btn-primary text-brand-400 hover:text-brand-200 transition-colors underline underline-offset-4",
          id: "hero-cta-tickets"
        }, {
          default: withCtx((_, _push2, _parent2, _scopeId) => {
            if (_push2) {
              _push2(`${ssrInterpolate(unref(homeData)?.hero_cta_primary_text || "View Current Season")}`);
            } else {
              return [
                createTextVNode(toDisplayString(unref(homeData)?.hero_cta_primary_text || "View Current Season"), 1)
              ];
            }
          }),
          _: 1
        }, _parent));
        _push(ssrRenderComponent(_component_NuxtLink, {
          to: unref(homeData)?.hero_cta_secondary_link || "/about",
          class: "btn-secondary text-brand-400 hover:text-brand-200 transition-colors underline underline-offset-4",
          id: "hero-cta-about"
        }, {
          default: withCtx((_, _push2, _parent2, _scopeId) => {
            if (_push2) {
              _push2(`${ssrInterpolate(unref(homeData)?.hero_cta_secondary_text || "Our Story")}`);
            } else {
              return [
                createTextVNode(toDisplayString(unref(homeData)?.hero_cta_secondary_text || "Our Story"), 1)
              ];
            }
          }),
          _: 1
        }, _parent));
        _push(`</div></div></div><!--]-->`);
      }
      _push(`<div class="mb-14 absolute bottom-8 left-1/2 -translate-x-1/2 animate-bounce z-20" data-v-d4e29e04><div class="w-6 h-10 rounded-full border-2 border-stage-600 flex items-start justify-center p-2" data-v-d4e29e04><div class="w-1 h-2.5 rounded-full bg-brand-400" data-v-d4e29e04></div></div></div></section><section class="upcoming-productions py-24 bg-stage-950" id="upcoming-productions" data-v-d4e29e04><div class="upcoming-productions__container max-w-7xl mx-auto px-4 sm:px-6 lg:px-8" data-v-d4e29e04><div class="upcoming-productions__header flex items-end justify-between mb-12" data-v-d4e29e04><div class="upcoming-productions__titles" data-v-d4e29e04><p class="text-brand-400 font-medium text-sm uppercase tracking-[0.15em] mb-2" data-v-d4e29e04>On Stage &amp; Upcoming</p><h2 class="section-heading text-stage-50" data-v-d4e29e04>Productions &amp; Events</h2></div></div>`);
      if (unref(onStageItems) && unref(onStageItems).length > 0) {
        _push(`<div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6" data-v-d4e29e04><!--[-->`);
        ssrRenderList(unref(onStageItems), (item) => {
          _push(`<!--[-->`);
          if (item._type === "production") {
            _push(ssrRenderComponent(_component_ProductionCard, {
              production: item.data,
              view_type: "dark"
            }, null, _parent));
          } else if (item._type === "event") {
            _push(ssrRenderComponent(_component_EventCard, {
              event: { ...item.data, view_type: "dark" }
            }, null, _parent));
          } else {
            _push(`<!---->`);
          }
          _push(`<!--]-->`);
        });
        _push(`<!--]--></div>`);
      } else {
        _push(`<div class="text-stage-400 italic" data-v-d4e29e04>No upcoming productions or events scheduled.</div>`);
      }
      _push(`<div class="mt-8 flex gap-4 justify-center" data-v-d4e29e04>`);
      _push(ssrRenderComponent(_component_NuxtLink, {
        to: "/productions",
        class: "btn-secondary"
      }, {
        default: withCtx((_, _push2, _parent2, _scopeId) => {
          if (_push2) {
            _push2(`View Past Productions`);
          } else {
            return [
              createTextVNode("View Past Productions")
            ];
          }
        }),
        _: 1
      }, _parent));
      _push(`</div></div></section><section class="mission py-24 relative overflow-hidden" id="mission-section" data-v-d4e29e04>`);
      if (unref(homeData)?.mission_background_image) {
        _push(`<img${ssrRenderAttrs(mergeProps(unref(getImageProps)(unref(homeData).mission_background_image, { sm: 800, md: 1200, lg: 1920 }, { quality: 70 }), {
          class: "absolute inset-0 w-full h-full object-cover",
          alt: "Mission background"
        }))} data-v-d4e29e04>`);
      } else {
        _push(`<!---->`);
      }
      _push(`<div class="absolute inset-0 bg-gradient-to-b from-stage-950 via-stage-900/10 to-stage-950" data-v-d4e29e04></div>`);
      if (unref(homeData)?.mission_background_image) {
        _push(`<div class="absolute inset-0 bg-stage-950/10" data-v-d4e29e04></div>`);
      } else {
        _push(`<!---->`);
      }
      _push(`<div class="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[400px] rounded-full bg-brand-500/3 blur-3xl" data-v-d4e29e04></div><div class="relative max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center" data-v-d4e29e04><p class="text-brand-400 font-medium text-sm uppercase tracking-[0.15em] mb-4" data-v-d4e29e04>Our Mission</p>`);
      if (unref(homeData)?.mission_statement) {
        _push(`<blockquote class="text-2xl sm:text-3xl lg:text-4xl font-serif text-stage-100 leading-relaxed" data-v-d4e29e04>${unref(homeData).mission_statement ?? ""}</blockquote>`);
      } else {
        _push(`<blockquote class="text-2xl sm:text-3xl lg:text-4xl font-serif text-stage-100 leading-relaxed" data-v-d4e29e04> “To create theatre that is <em class="text-brand-400 not-italic font-semibold" data-v-d4e29e04>alive</em>, <em class="text-brand-300 not-italic font-semibold" data-v-d4e29e04>daring</em>, and <em class="text-brand-200 not-italic font-semibold" data-v-d4e29e04>communal</em> — where artists and audiences take risks together.” </blockquote>`);
      }
      _push(`<div class="mt-8" data-v-d4e29e04>`);
      _push(ssrRenderComponent(_component_NuxtLink, {
        to: "/about",
        class: "text-brand-400 font-medium text-sm hover:text-brand-300 transition-colors underline underline-offset-4"
      }, {
        default: withCtx((_, _push2, _parent2, _scopeId) => {
          if (_push2) {
            _push2(` Learn more about Flux → `);
          } else {
            return [
              createTextVNode(" Learn more about Flux → ")
            ];
          }
        }),
        _: 1
      }, _parent));
      _push(`</div></div></section><section class="news-highlights py-24 bg-stage-950" id="news-highlights" data-v-d4e29e04><div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8" data-v-d4e29e04><div class="flex items-end justify-between mb-12" data-v-d4e29e04><div data-v-d4e29e04><p class="text-brand-400 font-medium text-sm uppercase tracking-[0.15em] mb-2" data-v-d4e29e04>Latest</p><h2 class="section-heading text-stage-50" data-v-d4e29e04>News &amp; Updates</h2></div>`);
      _push(ssrRenderComponent(_component_NuxtLink, {
        to: "/news",
        class: "btn-secondary hidden sm:inline-flex text-brand-400 hover:text-brand-200 transition-colors",
        id: "view-all-news"
      }, {
        default: withCtx((_, _push2, _parent2, _scopeId) => {
          if (_push2) {
            _push2(`All News`);
          } else {
            return [
              createTextVNode("All News")
            ];
          }
        }),
        _: 1
      }, _parent));
      _push(`</div>`);
      if (unref(newsHighlights)) {
        _push(`<div class="grid grid-cols-1 md:grid-cols-2 gap-6" data-v-d4e29e04><!--[-->`);
        ssrRenderList(unref(newsHighlights), (post) => {
          _push(ssrRenderComponent(_component_BlogPostCard, {
            key: post.slug,
            post,
            view_type: "dark"
          }, null, _parent));
        });
        _push(`<!--]--></div>`);
      } else {
        _push(`<!---->`);
      }
      _push(`</div></section><section class="newsletter py-24 sm:py-32 relative overflow-hidden border-t border-stage-800/50" id="newsletter-cta" data-v-d4e29e04><div class="absolute inset-0 bg-stage-950" data-v-d4e29e04></div><div class="absolute inset-0 overflow-hidden pointer-events-none opacity-50" data-v-d4e29e04><div class="orb orb-1 bg-brand-500/40" data-v-d4e29e04></div><div class="orb orb-2 bg-curtain-600/30" data-v-d4e29e04></div><div class="orb orb-3 bg-brand-300/20" data-v-d4e29e04></div></div><div class="absolute inset-0 opacity-[0.06] mix-blend-overlay pointer-events-none" style="${ssrRenderStyle({ "background-image": "url('data:image/svg+xml,%3Csvg viewBox=%220 0 200 200%22 xmlns=%22http://www.w3.org/2000/svg%22%3E%3Cfilter id=%22noiseFilter%22%3E%3CfeTurbulence type=%22fractalNoise%22 baseFrequency=%220.8%22 numOctaves=%223%22 stitchTiles=%22stitch%22/%3E%3C/filter%3E%3Crect width=%22100%25%22 height=%22100%25%22 filter=%22url(%23noiseFilter)%22/%3E%3C/svg%3E')" })}" data-v-d4e29e04></div><div class="relative max-w-2xl mx-auto px-4 sm:px-6 lg:px-8 text-center z-10" data-v-d4e29e04><h2 class="text-3xl sm:text-4xl lg:text-5xl font-serif font-bold text-transparent bg-clip-text bg-gradient-to-br from-stage-50 to-stage-400 mb-4 tracking-tight drop-shadow-xl" data-v-d4e29e04> Stay in the Loop </h2><p class="text-lg text-stage-200 mb-10 max-w-xl mx-auto font-medium tracking-wide drop-shadow-md" data-v-d4e29e04> Get updates on auditions, upcoming shows, and behind-the-scenes stories. </p><div class="backdrop-blur-2xl bg-stage-900/30 border border-stage-500/20 p-2 sm:p-3 rounded-2xl shadow-2xl shadow-brand-900/20 max-w-md mx-auto transform transition-transform hover:scale-[1.01]" data-v-d4e29e04><form action="https://fluxtheatre.us11.list-manage.com/subscribe/post?u=c140115304951f2b16fb2ffde&amp;id=5fdf6f58f7&amp;f_id=00c9dfe3f0" method="post" id="mc-embedded-subscribe-form" name="mc-embedded-subscribe-form" class="flex flex-col sm:flex-row gap-3 relative" target="_blank" data-v-d4e29e04><input type="email" name="EMAIL" placeholder="your@email.com" class="flex-1 px-5 py-4 rounded-xl bg-stage-950/50 border border-stage-700/50 text-stage-50 placeholder-stage-400 focus:outline-none focus:ring-2 focus:ring-brand-400/50 transition-all text-lg shadow-inner" id="mce-EMAIL" required data-v-d4e29e04><div style="${ssrRenderStyle({ "position": "absolute", "left": "-5000px" })}" aria-hidden="true" data-v-d4e29e04><input type="text" name="b_c140115304951f2b16fb2ffde_5fdf6f58f7" tabindex="-1" value="" data-v-d4e29e04></div><button type="submit" name="subscribe" class="bg-brand-500 hover:bg-brand-400 text-stage-950 font-bold px-8 py-4 rounded-xl transition-all hover:shadow-[0_0_20px_rgba(255,85,51,0.4)] active:scale-95 whitespace-nowrap text-lg" id="mc-embedded-subscribe" data-v-d4e29e04> Subscribe </button></form></div></div></section></div>`);
    };
  }
});
const _sfc_setup = _sfc_main.setup;
_sfc_main.setup = (props, ctx) => {
  const ssrContext = useSSRContext();
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("pages/index.vue");
  return _sfc_setup ? _sfc_setup(props, ctx) : void 0;
};
const index = /* @__PURE__ */ _export_sfc(_sfc_main, [["__scopeId", "data-v-d4e29e04"]]);

export { index as default };
//# sourceMappingURL=index-CYq44_q7.mjs.map
