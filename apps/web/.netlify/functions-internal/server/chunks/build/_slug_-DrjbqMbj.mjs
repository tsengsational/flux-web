import { _ as __nuxt_component_0 } from './nuxt-link-cZpXnfBZ.mjs';
import { _ as __nuxt_component_1, a as __nuxt_component_3 } from './BlockRenderer-D_tsRLZz.mjs';
import { _ as __nuxt_component_0$1 } from './BaseModal-Bc4BSEMB.mjs';
import { defineComponent, withAsyncContext, computed, ref, watch, nextTick, unref, mergeProps, withCtx, openBlock, createBlock, createVNode, createTextVNode, toDisplayString, createCommentVNode, useSSRContext } from 'vue';
import { ssrRenderAttrs, ssrRenderComponent, ssrInterpolate, ssrRenderClass, ssrRenderList, ssrRenderAttr } from 'vue/server-renderer';
import { _ as _export_sfc, u as useRoute, c as createError } from './server.mjs';
import { u as useDirectus, a as useAsyncData } from './asyncData-BxKqmOFY.mjs';
import { u as useSeoMeta } from './composables-DOi4jpYZ.mjs';
import '../_/nitro.mjs';
import 'node:http';
import 'node:https';
import 'node:events';
import 'node:buffer';
import 'node:fs';
import 'node:path';
import 'node:crypto';
import '../routes/renderer.mjs';
import 'vue-bundle-renderer/runtime';
import 'unhead/server';
import 'devalue';
import 'unhead/plugins';
import 'unhead/utils';
import 'vue-router';
import '@directus/sdk';

const _sfc_main = /* @__PURE__ */ defineComponent({
  __name: "[slug]",
  __ssrInlineRender: true,
  async setup(__props) {
    let __temp, __restore;
    const route = useRoute();
    const slugParam = route.params.slug;
    const slug = Array.isArray(slugParam) ? slugParam[0] : slugParam;
    const { client, readItems, getImageProps } = useDirectus();
    const { data: playbills, error } = ([__temp, __restore] = withAsyncContext(async () => useAsyncData(`playbill-${slug}`, async () => {
      try {
        const result = await client.request(readItems("playbills", {
          filter: { slug: { _eq: slug }, status: { _eq: "published" } },
          fields: [
            "*",
            {
              production: ["title", "slug", "poster_image"],
              event: ["title", "slug", "start_datetime", "venue", { venue: ["name", "address", "city", "state"] }],
              cast_credits: [
                "sort",
                {
                  cast_credits_id: [
                    "role_name",
                    "content",
                    "is_understudy",
                    {
                      person: ["first_name", "last_name", "slug", "headshot", "bio", "pronouns"]
                    }
                  ]
                }
              ],
              crew_credits: [
                "sort",
                {
                  crew_credits_id: [
                    "title",
                    "content",
                    "department",
                    "sort",
                    {
                      person: ["first_name", "last_name", "slug", "headshot", "bio", "pronouns"]
                    }
                  ]
                }
              ],
              funders: [
                "sort",
                {
                  funder_id: ["name", "slug", "image", "url"]
                }
              ]
            }
          ],
          deep: {
            cast_credits: { _sort: ["sort"] },
            crew_credits: { _sort: ["sort"] },
            funders: { _sort: ["sort"] }
          },
          limit: 1
        }));
        return result;
      } catch (err) {
        {
          console.error(`[SSR Playbill Error] Slug: "${slug}"`, err);
        }
        throw err;
      }
    })), __temp = await __temp, __restore(), __temp);
    const playbill = computed(() => playbills.value?.[0] || null);
    if (!playbill.value && !error.value) {
      throw createError({ statusCode: 404, statusMessage: "Playbill not found" });
    }
    useSeoMeta({
      title: () => `${playbill.value?.title || "Playbill"} — Flux Theatre Ensemble`,
      description: () => playbill.value?.subtitle || "Digital Theatre Playbill"
    });
    const activeTab = ref("credits");
    const displayedTab = ref("credits");
    const isFlipping = ref(false);
    watch(activeTab, async (newTab, oldTab) => {
      if (newTab === oldTab) return;
      isFlipping.value = true;
      await new Promise((resolve) => setTimeout(resolve, 300));
      displayedTab.value = newTab;
      await nextTick();
      await new Promise((resolve) => setTimeout(resolve, 300));
      isFlipping.value = false;
    });
    const cast = computed(() => {
      if (!playbill.value?.cast_credits) return [];
      return playbill.value.cast_credits.map((c) => c.cast_credits_id).filter(Boolean).map((credit) => ({
        ...credit,
        person: {
          ...credit.person,
          bio: credit.content || credit.person?.bio || null
        }
      }));
    });
    const sortedCrew = computed(() => {
      if (!playbill.value?.crew_credits) return [];
      const mapped = playbill.value.crew_credits.filter((c) => c && c.crew_credits_id).map((c) => {
        const credit = c.crew_credits_id;
        const sortValue = c.sort !== null && c.sort !== void 0 ? c.sort : credit.sort !== null && credit.sort !== void 0 ? credit.sort : null;
        return {
          ...credit,
          sortValue,
          person: {
            ...credit.person,
            bio: credit.content || credit.person?.bio || null
          }
        };
      });
      return mapped.sort((a, b) => {
        const sortA = a.sortValue;
        const sortB = b.sortValue;
        const hasSortA = sortA !== null && sortA !== void 0;
        const hasSortB = sortB !== null && sortB !== void 0;
        if (hasSortA && hasSortB) {
          if (sortA !== sortB) {
            return sortA - sortB;
          }
        } else if (hasSortA) {
          return -1;
        } else if (hasSortB) {
          return 1;
        }
        const lastNameA = (a.person?.last_name || "").trim().toLowerCase();
        const lastNameB = (b.person?.last_name || "").trim().toLowerCase();
        if (lastNameA !== lastNameB) {
          return lastNameA.localeCompare(lastNameB);
        }
        const firstNameA = (a.person?.first_name || "").trim().toLowerCase();
        const firstNameB = (b.person?.first_name || "").trim().toLowerCase();
        return firstNameA.localeCompare(firstNameB);
      });
    });
    const funders = computed(() => {
      if (!playbill.value?.funders) return [];
      return playbill.value.funders.map((f) => f.funder_id).filter(Boolean);
    });
    const parentLink = computed(() => {
      if (playbill.value?.production && typeof playbill.value.production === "object") {
        return {
          url: `/productions/${playbill.value.production.slug}`,
          label: `Production: ${playbill.value.production.title}`
        };
      }
      if (playbill.value?.event && typeof playbill.value.event === "object") {
        return {
          url: `/events/${playbill.value.event.slug}`,
          label: `Event: ${playbill.value.event.title}`
        };
      }
      return { url: "/", label: "Home" };
    });
    const isModalOpen = ref(false);
    const selectedPerson = ref(null);
    function closeBioModal() {
      isModalOpen.value = false;
      selectedPerson.value = null;
    }
    const isHeroLightboxOpen = ref(false);
    const closeHeroLightbox = () => {
      isHeroLightboxOpen.value = false;
    };
    return (_ctx, _push, _parent, _attrs) => {
      const _component_NuxtLink = __nuxt_component_0;
      const _component_BlockRenderer = __nuxt_component_1;
      const _component_BaseModal = __nuxt_component_0$1;
      const _component_BaseLightbox = __nuxt_component_3;
      if (unref(playbill)) {
        _push(`<div${ssrRenderAttrs(mergeProps({ class: "playbill-view min-h-screen pb-24 font-sans flex flex-col items-center" }, _attrs))} data-v-1a6e69c0><div class="playbill-view__top-bar w-full border-b border-stage-900 bg-[#0e0c0a]/90 sticky top-0 z-40 backdrop-blur-md" data-v-1a6e69c0><div class="playbill-view__top-bar-container max-w-5xl mx-auto px-6 py-3.5 flex items-center justify-between" data-v-1a6e69c0>`);
        _push(ssrRenderComponent(_component_NuxtLink, {
          to: unref(parentLink).url,
          class: "playbill-view__back-link group flex items-center gap-2 text-xs font-bold text-stage-400 hover:text-brand-400 transition-colors uppercase tracking-widest"
        }, {
          default: withCtx((_, _push2, _parent2, _scopeId) => {
            if (_push2) {
              _push2(`<svg class="playbill-view__back-link-icon w-4 h-4 transition-transform group-hover:-translate-x-1" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2.5" data-v-1a6e69c0${_scopeId}><path stroke-linecap="round" stroke-linejoin="round" d="M15.75 19.5L8.25 12l7.5-7.5" data-v-1a6e69c0${_scopeId}></path></svg> ${ssrInterpolate(unref(parentLink).label)}`);
            } else {
              return [
                (openBlock(), createBlock("svg", {
                  class: "playbill-view__back-link-icon w-4 h-4 transition-transform group-hover:-translate-x-1",
                  fill: "none",
                  viewBox: "0 0 24 24",
                  stroke: "currentColor",
                  "stroke-width": "2.5"
                }, [
                  createVNode("path", {
                    "stroke-linecap": "round",
                    "stroke-linejoin": "round",
                    d: "M15.75 19.5L8.25 12l7.5-7.5"
                  })
                ])),
                createTextVNode(" " + toDisplayString(unref(parentLink).label), 1)
              ];
            }
          }),
          _: 1
        }, _parent));
        _push(`<span class="playbill-view__official-badge text-[10px] uppercase font-black tracking-[0.2em] text-brand-500 border border-brand-500/40 px-3 py-1 rounded" data-v-1a6e69c0> Official Digital Playbill </span></div></div><div class="playbill-table w-full max-w-5xl px-4 md:px-8 mt-8 flex justify-center" data-v-1a6e69c0><div class="playbill-book relative w-full flex flex-col md:flex-row items-stretch rounded-2xl shadow-[0_50px_100px_-20px_rgba(0,0,0,0.85)]" data-v-1a6e69c0><div class="playbill-book__spine hidden md:block" data-v-1a6e69c0></div><div class="playbill-book__page playbill-book__page--left hidden md:flex flex-col paper-texture p-8 flex-1 border-r border-[#d4d0b8]" data-v-1a6e69c0><div class="playbill-book__inner flex flex-col h-full justify-between" data-v-1a6e69c0><header class="playbill-book__header text-center pt-4" data-v-1a6e69c0><div class="playbill-book__header-decor flex flex-col items-center justify-center gap-2 mb-4" data-v-1a6e69c0><div class="playbill-book__decor-line w-12 h-[3px] bg-[#1c1c15] mb-1" data-v-1a6e69c0></div>`);
        if (unref(playbill).supertitle) {
          _push(`<p class="playbill-book__supertitle text-[10px] uppercase tracking-[0.25em] font-black text-[#6b664d] leading-none" data-v-1a6e69c0>${ssrInterpolate(unref(playbill).supertitle)}</p>`);
        } else {
          _push(`<!---->`);
        }
        _push(`<div class="playbill-book__decor-divider w-full h-[3px] border-t border-b border-[#1c1c15] mt-1.5" data-v-1a6e69c0></div></div><h1 class="playbill-book__title text-3xl lg:text-4xl font-serif font-black tracking-tight leading-tight text-[#1c1c15] mt-3 mb-2" data-v-1a6e69c0>${ssrInterpolate(unref(playbill).title)}</h1>`);
        if (unref(playbill).subtitle) {
          _push(`<p class="playbill-book__subtitle text-md font-serif italic text-[#4a4632] leading-relaxed max-w-md mx-auto mb-4" data-v-1a6e69c0>${ssrInterpolate(unref(playbill).subtitle)}</p>`);
        } else {
          _push(`<!---->`);
        }
        _push(`<div class="playbill-book__meta flex flex-col gap-1 items-center justify-center text-xs font-serif text-[#6b664d] py-2.5 border-t border-b border-dashed border-[#c5c1a8] my-4" data-v-1a6e69c0>`);
        if (unref(playbill).byline) {
          _push(`<span class="font-bold font-sans tracking-wide uppercase text-[10px] text-[#1c1c15]" data-v-1a6e69c0>${ssrInterpolate(unref(playbill).byline)}</span>`);
        } else {
          _push(`<!---->`);
        }
        if (unref(playbill).director) {
          _push(`<span class="italic" data-v-1a6e69c0>${ssrInterpolate(unref(playbill).director)}</span>`);
        } else {
          _push(`<!---->`);
        }
        _push(`</div></header>`);
        if (unref(playbill).hero_image) {
          _push(`<div class="playbill-book__hero-container relative border border-[#c5c1a8] bg-[#ebe8dd] my-4 flex items-center justify-center overflow-hidden cursor-pointer group" data-v-1a6e69c0><img${ssrRenderAttrs(mergeProps(unref(getImageProps)(unref(playbill).hero_image, { sm: 600, md: 800 }, { quality: 85 }), {
            alt: unref(playbill).title,
            class: "playbill-book__hero-image w-full max-h-[280px] object-contain opacity-95 contrast-110 transition-transform duration-750 group-hover:scale-[1.02]"
          }))} data-v-1a6e69c0><div class="absolute inset-0 bg-[#1c1c15]/5 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center" data-v-1a6e69c0><div class="w-10 h-10 rounded-full bg-[#1c1c15]/90 backdrop-blur-md flex items-center justify-center text-[#fcf9ee] scale-75 group-hover:scale-100 transition-transform shadow-md" data-v-1a6e69c0><svg class="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" data-v-1a6e69c0><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2.5" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0zM10 7v3m0 0v3m0-3h3m-3 0H7" data-v-1a6e69c0></path></svg></div></div><div class="playbill-book__hero-shading absolute inset-0 pointer-events-none" data-v-1a6e69c0></div></div>`);
        } else {
          _push(`<!---->`);
        }
        _push(`<footer class="playbill-book__footer flex items-center justify-between text-[10px] uppercase font-bold tracking-widest text-[#8c8872] pt-4 mt-auto border-t border-[#ebe8dd]" data-v-1a6e69c0><span data-v-1a6e69c0>Flux Theatre Ensemble</span><span data-v-1a6e69c0>Page I</span></footer></div></div><div class="${ssrRenderClass([{ "playbill-book__page--flipping": unref(isFlipping) }, "playbill-book__page playbill-book__page--right flex flex-col paper-texture p-6 md:p-8 flex-1 relative"])}" data-v-1a6e69c0><nav class="playbill-book__tabs-nav sticky top-[48px] flex items-center gap-1.5 -mx-6 md:-mx-8 -mt-6 md:-mt-8 px-6 md:px-8 pt-6 md:pt-8 pb-3 mb-6 bg-[#fcf9ee] z-30 border-b border-[#ebe8dd]/60" data-v-1a6e69c0><button class="${ssrRenderClass([[
          unref(activeTab) === "credits" ? "playbill-book__tab-card--active shadow-md text-[#1c1c15] font-black" : "playbill-book__tab-card--inactive text-[#6b664d] hover:text-[#1c1c15]"
        ], "playbill-book__tab-card flex-1 pt-3.5 pb-2 rounded-b-xl text-center text-[10px] uppercase font-black tracking-widest transition-all duration-300 border-t-0"])}" data-v-1a6e69c0> Credits </button><button class="${ssrRenderClass([[
          unref(activeTab) === "about" ? "playbill-book__tab-card--active shadow-md text-[#1c1c15] font-black" : "playbill-book__tab-card--inactive text-[#6b664d] hover:text-[#1c1c15]"
        ], "playbill-book__tab-card flex-1 pt-3.5 pb-2 rounded-b-xl text-center text-[10px] uppercase font-black tracking-widest transition-all duration-300 border-t-0"])}" data-v-1a6e69c0> Program </button><button class="${ssrRenderClass([[
          unref(activeTab) === "support" ? "playbill-book__tab-card--active shadow-md text-[#1c1c15] font-black" : "playbill-book__tab-card--inactive text-[#6b664d] hover:text-[#1c1c15]"
        ], "playbill-book__tab-card flex-1 pt-3.5 pb-2 rounded-b-xl text-center text-[10px] uppercase font-black tracking-widest transition-all duration-300 border-t-0"])}" data-v-1a6e69c0> Sponsors </button></nav><div class="playbill-book__inner flex flex-col h-full justify-between" data-v-1a6e69c0><div class="playbill-book__page-content flex-1" data-v-1a6e69c0>`);
        if (unref(displayedTab) === "credits") {
          _push(`<header class="playbill-book__mobile-header block md:hidden text-center pb-6 border-b border-[#ebe8dd] mb-6" data-v-1a6e69c0><h1 class="playbill-book__title text-3xl font-serif font-black tracking-tight leading-tight text-[#1c1c15] mb-2" data-v-1a6e69c0>${ssrInterpolate(unref(playbill).title)}</h1>`);
          if (unref(playbill).subtitle) {
            _push(`<p class="playbill-book__subtitle text-sm font-serif italic text-[#4a4632] leading-relaxed mb-3" data-v-1a6e69c0>${ssrInterpolate(unref(playbill).subtitle)}</p>`);
          } else {
            _push(`<!---->`);
          }
          if (unref(playbill).hero_image) {
            _push(`<div class="playbill-book__hero-container relative border border-[#c5c1a8] bg-[#ebe8dd] mb-4 flex items-center justify-center overflow-hidden cursor-pointer group" data-v-1a6e69c0><img${ssrRenderAttrs(mergeProps(unref(getImageProps)(unref(playbill).hero_image, { sm: 600 }, { quality: 80 }), {
              alt: unref(playbill).title,
              class: "playbill-book__hero-image w-full max-h-[220px] object-contain opacity-95 contrast-110 transition-transform duration-750 group-hover:scale-[1.02]"
            }))} data-v-1a6e69c0><div class="absolute inset-0 bg-[#1c1c15]/5 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center" data-v-1a6e69c0><div class="w-10 h-10 rounded-full bg-[#1c1c15]/90 backdrop-blur-md flex items-center justify-center text-[#fcf9ee] scale-75 group-hover:scale-100 transition-transform shadow-md" data-v-1a6e69c0><svg class="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" data-v-1a6e69c0><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2.5" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0zM10 7v3m0 0v3m0-3h3m-3 0H7" data-v-1a6e69c0></path></svg></div></div><div class="playbill-book__hero-shading absolute inset-0 pointer-events-none" data-v-1a6e69c0></div></div>`);
          } else {
            _push(`<!---->`);
          }
          _push(`<div class="text-[10px] font-sans font-bold tracking-widest text-[#1c1c15] uppercase" data-v-1a6e69c0>${ssrInterpolate(unref(playbill).byline)} • ${ssrInterpolate(unref(playbill).director)}</div></header>`);
        } else {
          _push(`<!---->`);
        }
        if (unref(displayedTab) === "about") {
          _push(`<div id="about" class="playbill-book__pane space-y-6" data-v-1a6e69c0>`);
          if (unref(playbill).production || unref(playbill).event) {
            _push(`<div class="playbill-book__promo p-5 rounded-xl border border-[#c5c1a8]/60 bg-[#ffffff]/60 flex items-start gap-4 shadow-sm" data-v-1a6e69c0><div class="playbill-book__promo-icon w-9 h-9 rounded-lg bg-[#1c1c15]/5 border border-[#1c1c15]/20 flex items-center justify-center text-[#1c1c15] flex-shrink-0" data-v-1a6e69c0><svg class="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2" data-v-1a6e69c0><path stroke-linecap="round" stroke-linejoin="round" d="M16.5 6v.75m0 3v.75m0 3v.75m0 3V18m-9-5.25h5.25M7.5 15h3M3.375 5.25c-.621 0-1.125.504-1.125 1.125v3.026a2.999 2.999 0 010 5.198v3.026c0 .621.504 1.125 1.125 1.125h17.25c.621 0 1.125-.504 1.125-1.125v-3.026a2.999 2.999 0 010-5.198V6.375c0-.621-.504-1.125-1.125-1.125H3.375z" data-v-1a6e69c0></path></svg></div><div class="playbill-book__promo-body" data-v-1a6e69c0><h4 class="text-[9px] uppercase tracking-[0.2em] font-black text-[#6b664d]" data-v-1a6e69c0>Flux Presentation</h4><p class="text-xs font-semibold text-[#1c1c15] mt-1 leading-normal" data-v-1a6e69c0> This digital playbill is for the presentation of <span class="font-serif italic font-bold text-[#1c1c15]" data-v-1a6e69c0>${ssrInterpolate(unref(playbill).production ? unref(playbill).production.title : unref(playbill).event.title)}</span>. </p></div></div>`);
          } else {
            _push(`<!---->`);
          }
          if (unref(playbill).content) {
            _push(`<div class="playbill-book__rich-content prose prose-stone prose-sm max-w-none text-[#1c1c15]" data-v-1a6e69c0>`);
            _push(ssrRenderComponent(_component_BlockRenderer, {
              content: unref(playbill).content
            }, null, _parent));
            _push(`</div>`);
          } else {
            _push(`<div class="text-center py-12 border border-dashed border-[#c5c1a8] rounded-xl bg-[#ffffff]/30" data-v-1a6e69c0><p class="text-xs text-[#8c8872] italic font-serif" data-v-1a6e69c0>Welcome to our Digital Playbill. Tap on the Credits or Sponsors tabs above to explore.</p></div>`);
          }
          _push(`</div>`);
        } else if (unref(displayedTab) === "credits") {
          _push(`<div id="credits" class="playbill-book__pane space-y-8" data-v-1a6e69c0>`);
          if (unref(cast).length) {
            _push(`<div class="playbill-book__section" data-v-1a6e69c0><div class="playbill-book__section-header flex items-center justify-between border-b-2 border-[#1c1c15] pb-2 mb-4" data-v-1a6e69c0><h2 class="text-xl font-serif font-black text-[#1c1c15] tracking-wide" data-v-1a6e69c0> Cast </h2><span class="text-[9px] uppercase tracking-widest font-black text-[#6b664d]" data-v-1a6e69c0> Company </span></div><div class="playbill-book__credits-list space-y-2" data-v-1a6e69c0><!--[-->`);
            ssrRenderList(unref(cast), (credit) => {
              _push(`<button class="playbill-book__credit-card relative w-full text-left p-3.5 rounded-xl border border-[#c5c1a8] hover:border-[#1c1c15] hover:bg-[#ffffff] hover:shadow-md transition-all duration-300 flex items-center gap-4 group" data-v-1a6e69c0>`);
              if (credit.person?.headshot) {
                _push(`<img${ssrRenderAttrs(mergeProps({ ref_for: true }, unref(getImageProps)(credit.person.headshot, { sm: 400, md: 800 }, { quality: 85 }), {
                  class: "absolute w-px h-px opacity-0 pointer-events-none",
                  loading: "lazy",
                  alt: ""
                }))} data-v-1a6e69c0>`);
              } else {
                _push(`<!---->`);
              }
              _push(`<div class="w-10 h-10 rounded-lg overflow-hidden border border-[#c5c1a8] group-hover:border-[#1c1c15] transition-colors bg-[#ebe8dd] flex-shrink-0 shadow-inner" data-v-1a6e69c0>`);
              if (credit.person?.headshot) {
                _push(`<img${ssrRenderAttrs(mergeProps({ ref_for: true }, unref(getImageProps)(credit.person.headshot, { sm: 100 }, { quality: 70 }), {
                  alt: credit.person.first_name,
                  class: "w-full h-full object-contain brightness-95 transition-all duration-300",
                  loading: "lazy"
                }))} data-v-1a6e69c0>`);
              } else {
                _push(`<div class="w-full h-full flex items-center justify-center bg-[#c5c1a8]/40 text-[#6b664d] font-serif font-bold text-sm" data-v-1a6e69c0>${ssrInterpolate(credit.person?.first_name?.[0] || "A")}</div>`);
              }
              _push(`</div><div class="flex-1 min-w-0" data-v-1a6e69c0><p class="font-serif font-bold text-sm text-[#1c1c15] group-hover:text-[#682805] transition-colors leading-tight" data-v-1a6e69c0>${ssrInterpolate(credit.person?.first_name || "")} ${ssrInterpolate(credit.person?.last_name || "")}</p>`);
              if (credit.person?.pronouns) {
                _push(`<p class="text-[9px] text-[#6b664d] font-medium mt-0.5" data-v-1a6e69c0>(${ssrInterpolate(credit.person.pronouns)})</p>`);
              } else {
                _push(`<!---->`);
              }
              _push(`</div><div class="text-right min-w-[35%]" data-v-1a6e69c0><p class="text-xs font-bold font-serif italic text-[#1c1c15]" data-v-1a6e69c0>${ssrInterpolate(credit.role_name)}</p>`);
              if (credit.is_understudy) {
                _push(`<p class="text-[8px] font-black text-[#682805] uppercase tracking-widest mt-0.5" data-v-1a6e69c0>Understudy</p>`);
              } else {
                _push(`<!---->`);
              }
              _push(`</div></button>`);
            });
            _push(`<!--]--></div></div>`);
          } else {
            _push(`<!---->`);
          }
          if (unref(sortedCrew).length) {
            _push(`<div class="playbill-book__section space-y-4 pt-4" data-v-1a6e69c0><div class="playbill-book__section-header flex items-center justify-between border-b-2 border-[#1c1c15] pb-2 mb-4" data-v-1a6e69c0><h2 class="text-xl font-serif font-black text-[#1c1c15] tracking-wide" data-v-1a6e69c0> Creative &amp; Production Team </h2><span class="text-[9px] uppercase tracking-widest font-black text-[#6b664d]" data-v-1a6e69c0> Crew </span></div><div class="grid grid-cols-1 sm:grid-cols-2 gap-2" data-v-1a6e69c0><!--[-->`);
            ssrRenderList(unref(sortedCrew), (credit) => {
              _push(`<button class="playbill-book__credit-card relative w-full text-left p-3 rounded-lg border border-[#c5c1a8] hover:border-[#1c1c15] hover:bg-[#ffffff] hover:shadow-md transition-all duration-300 flex items-center justify-between group" data-v-1a6e69c0>`);
              if (credit.person?.headshot) {
                _push(`<img${ssrRenderAttrs(mergeProps({ ref_for: true }, unref(getImageProps)(credit.person.headshot, { sm: 400, md: 800 }, { quality: 85 }), {
                  class: "absolute w-px h-px opacity-0 pointer-events-none",
                  loading: "lazy",
                  alt: ""
                }))} data-v-1a6e69c0>`);
              } else {
                _push(`<!---->`);
              }
              _push(`<div class="min-w-0 pr-4" data-v-1a6e69c0><p class="text-[8px] font-black text-[#8c8872] uppercase tracking-widest leading-none" data-v-1a6e69c0>${ssrInterpolate(credit.title)}</p><p class="font-serif font-bold text-sm text-[#1c1c15] group-hover:text-[#682805] transition-colors mt-1.5 truncate" data-v-1a6e69c0>${ssrInterpolate(credit.person?.first_name || "")} ${ssrInterpolate(credit.person?.last_name || "")}</p></div><svg class="w-3.5 h-3.5 text-[#8c8872] group-hover:text-[#1c1c15] transition-colors flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2.5" data-v-1a6e69c0><path stroke-linecap="round" stroke-linejoin="round" d="M8.25 4.5l7.5 7.5-7.5 7.5" data-v-1a6e69c0></path></svg></button>`);
            });
            _push(`<!--]--></div></div>`);
          } else {
            _push(`<!---->`);
          }
          _push(`</div>`);
        } else if (unref(displayedTab) === "support") {
          _push(`<div id="support" class="playbill-book__pane space-y-6 text-center" data-v-1a6e69c0><div class="py-4 border-b border-[#ebe8dd] max-w-md mx-auto" data-v-1a6e69c0><h2 class="text-xl font-serif font-black text-[#1c1c15]" data-v-1a6e69c0>Ensemble Funders</h2><p class="text-xs text-[#6b664d] mt-1.5 font-serif italic" data-v-1a6e69c0> Made possible through the generous support of our sponsors. </p></div>`);
          if (unref(funders).length) {
            _push(`<div class="grid grid-cols-2 gap-4 max-w-md mx-auto pt-2" data-v-1a6e69c0><!--[-->`);
            ssrRenderList(unref(funders), (funder) => {
              _push(`<a${ssrRenderAttr("href", funder.url || "#")} target="_blank" class="group flex flex-col items-center justify-center p-4 rounded-xl border border-[#c5c1a8] hover:border-[#1c1c15] hover:bg-[#ffffff] hover:shadow-md transition-all duration-300" data-v-1a6e69c0><div class="w-full aspect-square max-h-[80px] bg-[#ffffff] rounded-lg shadow-inner p-3 flex items-center justify-center overflow-hidden border border-[#ebe8dd]" data-v-1a6e69c0>`);
              if (funder.image) {
                _push(`<img${ssrRenderAttrs(mergeProps({ ref_for: true }, unref(getImageProps)(funder.image, { sm: 200 }, { quality: 80 }), {
                  alt: funder.name,
                  class: "w-full h-full object-contain opacity-90 group-hover:opacity-100 transition-all duration-500",
                  loading: "lazy"
                }))} data-v-1a6e69c0>`);
              } else {
                _push(`<span class="text-[#1c1c15] font-serif font-bold text-center text-xs leading-tight" data-v-1a6e69c0>${ssrInterpolate(funder.name)}</span>`);
              }
              _push(`</div><span class="text-[10px] font-bold text-[#6b664d] mt-2.5 group-hover:text-[#682805] transition-colors uppercase tracking-wider truncate max-w-full" data-v-1a6e69c0>${ssrInterpolate(funder.name)}</span></a>`);
            });
            _push(`<!--]--></div>`);
          } else {
            _push(`<div class="py-12 text-[#8c8872] italic font-serif text-sm" data-v-1a6e69c0> Thank you to all who make our works possible. </div>`);
          }
          _push(`<div class="playbill-book__cta max-w-md mx-auto p-5 rounded-xl border border-[#c5c1a8] bg-[#ffffff]/60 text-left shadow-sm mt-8" data-v-1a6e69c0><h3 class="text-md font-serif font-black text-[#1c1c15]" data-v-1a6e69c0>Support the Ensemble</h3><p class="text-[11px] text-[#6b664d] mt-1.5 leading-relaxed" data-v-1a6e69c0> Flux Theatre Ensemble operates as a collaborative, non-profit community. Your support directly funds local theater makers, playwrights, and accessibility tools. </p><div class="mt-4 flex items-center gap-3" data-v-1a6e69c0><a href="https://fluxtheatre.org/donate" target="_blank" class="px-4 py-2 rounded-lg bg-[#461600] text-[#ffffff] hover:bg-[#682805] text-[10px] font-black uppercase tracking-wider shadow hover:scale-[1.03] transition-all duration-300" data-v-1a6e69c0> Donate Now </a>`);
          _push(ssrRenderComponent(_component_NuxtLink, {
            to: "/",
            class: "text-[10px] font-black text-[#6b664d] hover:text-[#1c1c15] transition-colors uppercase tracking-widest"
          }, {
            default: withCtx((_, _push2, _parent2, _scopeId) => {
              if (_push2) {
                _push2(` Learn More → `);
              } else {
                return [
                  createTextVNode(" Learn More → ")
                ];
              }
            }),
            _: 1
          }, _parent));
          _push(`</div></div></div>`);
        } else {
          _push(`<!---->`);
        }
        _push(`</div><footer class="playbill-book__footer flex items-center justify-between text-[10px] uppercase font-bold tracking-widest text-[#8c8872] pt-4 mt-8 border-t border-[#ebe8dd]" data-v-1a6e69c0><span data-v-1a6e69c0>Official Program</span><span data-v-1a6e69c0>Page ${ssrInterpolate(unref(displayedTab) === "credits" ? "II" : unref(displayedTab) === "about" ? "III" : "IV")}</span></footer></div></div></div></div>`);
        _push(ssrRenderComponent(_component_BaseModal, {
          "is-open": unref(isModalOpen),
          "max-width": "max-w-xl",
          onClose: closeBioModal
        }, {
          default: withCtx((_, _push2, _parent2, _scopeId) => {
            if (_push2) {
              if (unref(selectedPerson)) {
                _push2(`<div class="playbill-modal p-0 overflow-hidden text-left flex flex-col" data-v-1a6e69c0${_scopeId}>`);
                if (unref(selectedPerson).headshot) {
                  _push2(`<div class="w-full aspect-[4/5] max-h-[420px] overflow-hidden border-b border-[#c5c1a8] bg-[#ebe8dd]" data-v-1a6e69c0${_scopeId}><img${ssrRenderAttrs(mergeProps(unref(getImageProps)(unref(selectedPerson).headshot, { sm: 400, md: 800 }, { quality: 85 }), {
                    alt: unref(selectedPerson).name,
                    class: "w-full h-full object-contain brightness-95 animate-scale-in"
                  }))} data-v-1a6e69c0${_scopeId}></div>`);
                } else {
                  _push2(`<!---->`);
                }
                _push2(`<div class="p-6 md:p-8 flex flex-col" data-v-1a6e69c0${_scopeId}><div class="flex flex-col sm:flex-row sm:items-baseline sm:justify-between gap-1 border-b border-[#ebe8dd] pb-2" data-v-1a6e69c0${_scopeId}><h3 class="text-2xl font-serif font-bold text-[#1c1c15] tracking-wide" data-v-1a6e69c0${_scopeId}>${ssrInterpolate(unref(selectedPerson).name)}</h3>`);
                if (unref(selectedPerson).pronouns) {
                  _push2(`<span class="text-[9px] uppercase font-black tracking-widest text-[#8c8872]" data-v-1a6e69c0${_scopeId}>${ssrInterpolate(unref(selectedPerson).pronouns)}</span>`);
                } else {
                  _push2(`<!---->`);
                }
                _push2(`</div><p class="text-[10px] font-black tracking-widest text-[#682805] uppercase mt-2" data-v-1a6e69c0${_scopeId}>${ssrInterpolate(unref(selectedPerson).role)}</p><div class="mt-4 pt-2 prose prose-stone prose-sm text-[#4a4632] max-w-none leading-relaxed" data-v-1a6e69c0${_scopeId}>`);
                if (unref(selectedPerson).bio) {
                  _push2(ssrRenderComponent(_component_BlockRenderer, {
                    content: unref(selectedPerson).bio
                  }, null, _parent2, _scopeId));
                } else {
                  _push2(`<p class="italic text-[#8c8872] text-xs" data-v-1a6e69c0${_scopeId}>No biography details added yet.</p>`);
                }
                _push2(`</div></div></div>`);
              } else {
                _push2(`<!---->`);
              }
            } else {
              return [
                unref(selectedPerson) ? (openBlock(), createBlock("div", {
                  key: 0,
                  class: "playbill-modal p-0 overflow-hidden text-left flex flex-col"
                }, [
                  unref(selectedPerson).headshot ? (openBlock(), createBlock("div", {
                    key: 0,
                    class: "w-full aspect-[4/5] max-h-[420px] overflow-hidden border-b border-[#c5c1a8] bg-[#ebe8dd]"
                  }, [
                    createVNode("img", mergeProps(unref(getImageProps)(unref(selectedPerson).headshot, { sm: 400, md: 800 }, { quality: 85 }), {
                      alt: unref(selectedPerson).name,
                      class: "w-full h-full object-contain brightness-95 animate-scale-in"
                    }), null, 16, ["alt"])
                  ])) : createCommentVNode("", true),
                  createVNode("div", { class: "p-6 md:p-8 flex flex-col" }, [
                    createVNode("div", { class: "flex flex-col sm:flex-row sm:items-baseline sm:justify-between gap-1 border-b border-[#ebe8dd] pb-2" }, [
                      createVNode("h3", { class: "text-2xl font-serif font-bold text-[#1c1c15] tracking-wide" }, toDisplayString(unref(selectedPerson).name), 1),
                      unref(selectedPerson).pronouns ? (openBlock(), createBlock("span", {
                        key: 0,
                        class: "text-[9px] uppercase font-black tracking-widest text-[#8c8872]"
                      }, toDisplayString(unref(selectedPerson).pronouns), 1)) : createCommentVNode("", true)
                    ]),
                    createVNode("p", { class: "text-[10px] font-black tracking-widest text-[#682805] uppercase mt-2" }, toDisplayString(unref(selectedPerson).role), 1),
                    createVNode("div", { class: "mt-4 pt-2 prose prose-stone prose-sm text-[#4a4632] max-w-none leading-relaxed" }, [
                      unref(selectedPerson).bio ? (openBlock(), createBlock(_component_BlockRenderer, {
                        key: 0,
                        content: unref(selectedPerson).bio
                      }, null, 8, ["content"])) : (openBlock(), createBlock("p", {
                        key: 1,
                        class: "italic text-[#8c8872] text-xs"
                      }, "No biography details added yet."))
                    ])
                  ])
                ])) : createCommentVNode("", true)
              ];
            }
          }),
          _: 1
        }, _parent));
        _push(ssrRenderComponent(_component_BaseLightbox, {
          "is-open": unref(isHeroLightboxOpen),
          "image-id": unref(playbill).hero_image,
          alt: unref(playbill).title,
          caption: unref(playbill).title + (unref(playbill).subtitle ? " — " + unref(playbill).subtitle : ""),
          onClose: closeHeroLightbox
        }, null, _parent));
        _push(`</div>`);
      } else {
        _push(`<!---->`);
      }
    };
  }
});
const _sfc_setup = _sfc_main.setup;
_sfc_main.setup = (props, ctx) => {
  const ssrContext = useSSRContext();
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("pages/playbills/[slug].vue");
  return _sfc_setup ? _sfc_setup(props, ctx) : void 0;
};
const _slug_ = /* @__PURE__ */ _export_sfc(_sfc_main, [["__scopeId", "data-v-1a6e69c0"]]);

export { _slug_ as default };
//# sourceMappingURL=_slug_-DrjbqMbj.mjs.map
