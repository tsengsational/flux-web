import { _ as __nuxt_component_0 } from './nuxt-link-cZpXnfBZ.mjs';
import { _ as __nuxt_component_1 } from './BlockRenderer-DbBZxoc-.mjs';
import { _ as __nuxt_component_0$1 } from './BaseModal-Bc4BSEMB.mjs';
import { defineComponent, withAsyncContext, computed, ref, unref, mergeProps, withCtx, openBlock, createBlock, createVNode, createTextVNode, toDisplayString, createCommentVNode, useSSRContext } from 'vue';
import { ssrRenderAttrs, ssrRenderComponent, ssrInterpolate, ssrRenderClass, ssrRenderList, ssrRenderAttr } from 'vue/server-renderer';
import { _ as _export_sfc, u as useRoute, c as createError } from './server.mjs';
import { u as useDirectus, a as useAsyncData } from './asyncData-DO9zjVnq.mjs';
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
                  productions_cast_id: [
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
                  productions_crew_id: [
                    "title",
                    "content",
                    "department",
                    {
                      person: ["first_name", "last_name", "slug", "headshot", "bio", "pronouns"]
                    }
                  ]
                }
              ],
              funders: [
                "sort",
                {
                  funders_id: ["name", "slug", "image", "url"]
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
    const activeTab = ref("about");
    const cast = computed(() => {
      if (!playbill.value?.cast_credits) return [];
      return playbill.value.cast_credits.map((c) => c.productions_cast_id).filter(Boolean).map((credit) => ({
        ...credit,
        person: {
          ...credit.person,
          bio: credit.content || credit.person?.bio || null
        }
      }));
    });
    const crew = computed(() => {
      if (!playbill.value?.crew_credits) return [];
      return playbill.value.crew_credits.map((c) => c.productions_crew_id).filter(Boolean).map((credit) => ({
        ...credit,
        person: {
          ...credit.person,
          bio: credit.content || credit.person?.bio || null
        }
      }));
    });
    const crewByDepartment = computed(() => {
      const departments = {};
      crew.value.forEach((credit) => {
        const dept = credit.department || "other";
        if (!departments[dept]) {
          departments[dept] = [];
        }
        departments[dept].push(credit);
      });
      const deptOrder = [
        "direction",
        "production",
        "stage_management",
        "scenic",
        "lighting",
        "sound",
        "costumes",
        "props",
        "dramaturgy",
        "marketing",
        "other"
      ];
      return deptOrder.map((key) => ({
        key,
        name: formatDepartmentName(key),
        credits: departments[key] || []
      })).filter((d) => d.credits.length > 0);
    });
    function formatDepartmentName(key) {
      const names = {
        direction: "Direction & Playwriting",
        production: "Production Team",
        stage_management: "Stage Management",
        scenic: "Scenic Design",
        lighting: "Lighting Design",
        sound: "Sound Design",
        costumes: "Costume & Wardrobe",
        props: "Properties & Stage Dressing",
        dramaturgy: "Dramaturgy & Literary",
        marketing: "Marketing & Press",
        other: "Special Thanks & Staff"
      };
      return names[key] || "Production Team";
    }
    const funders = computed(() => {
      if (!playbill.value?.funders) return [];
      return playbill.value.funders.map((f) => f.funders_id).filter(Boolean);
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
    return (_ctx, _push, _parent, _attrs) => {
      const _component_NuxtLink = __nuxt_component_0;
      const _component_BlockRenderer = __nuxt_component_1;
      const _component_BaseModal = __nuxt_component_0$1;
      if (unref(playbill)) {
        _push(`<div${ssrRenderAttrs(mergeProps({ class: "playbill-view min-h-screen bg-stage-950 text-stage-50 pb-24 font-sans" }, _attrs))} data-v-c918743f><div class="border-b border-stage-800/60 bg-stage-950/80 sticky top-0 z-40 backdrop-blur-md" data-v-c918743f><div class="max-w-3xl mx-auto px-4 py-3 flex items-center justify-between" data-v-c918743f>`);
        _push(ssrRenderComponent(_component_NuxtLink, {
          to: unref(parentLink).url,
          class: "group flex items-center gap-2 text-xs font-semibold text-stage-400 hover:text-brand-400 transition-colors uppercase tracking-widest"
        }, {
          default: withCtx((_, _push2, _parent2, _scopeId) => {
            if (_push2) {
              _push2(`<svg class="w-4 h-4 transition-transform group-hover:-translate-x-1" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2.5" data-v-c918743f${_scopeId}><path stroke-linecap="round" stroke-linejoin="round" d="M15.75 19.5L8.25 12l7.5-7.5" data-v-c918743f${_scopeId}></path></svg> ${ssrInterpolate(unref(parentLink).label)}`);
            } else {
              return [
                (openBlock(), createBlock("svg", {
                  class: "w-4 h-4 transition-transform group-hover:-translate-x-1",
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
        _push(`<span class="text-[10px] uppercase font-bold tracking-widest text-brand-500/80 border border-brand-500/30 px-2 py-0.5 rounded" data-v-c918743f> Official Playbill </span></div></div><header class="playbill-header text-center pt-12 pb-8 max-w-3xl mx-auto px-4" data-v-c918743f><div class="playbill-decorative-borders flex flex-col items-center justify-center gap-2 mb-6" data-v-c918743f><div class="w-20 h-0.5 bg-brand-500/80" data-v-c918743f></div>`);
        if (unref(playbill).supertitle) {
          _push(`<p class="text-xs uppercase tracking-[0.25em] font-extrabold text-brand-400 leading-none" data-v-c918743f>${ssrInterpolate(unref(playbill).supertitle)}</p>`);
        } else {
          _push(`<!---->`);
        }
        _push(`<div class="w-full h-px bg-gradient-to-r from-transparent via-stage-800 to-transparent mt-2" data-v-c918743f></div></div><h1 class="text-4xl sm:text-5xl lg:text-6xl font-serif font-black tracking-tight leading-tight text-stage-50 mb-4" data-v-c918743f>${ssrInterpolate(unref(playbill).title)}</h1>`);
        if (unref(playbill).subtitle) {
          _push(`<p class="text-lg sm:text-xl font-serif italic text-stage-300 leading-relaxed max-w-2xl mx-auto" data-v-c918743f>${ssrInterpolate(unref(playbill).subtitle)}</p>`);
        } else {
          _push(`<!---->`);
        }
        _push(`<div class="mt-6 flex flex-col sm:flex-row items-center justify-center gap-2 sm:gap-6 text-sm text-stage-400 font-serif italic border-t border-b border-stage-900/60 py-3 mt-8" data-v-c918743f>`);
        if (unref(playbill).byline) {
          _push(`<span data-v-c918743f>${ssrInterpolate(unref(playbill).byline)}</span>`);
        } else {
          _push(`<!---->`);
        }
        if (unref(playbill).byline && unref(playbill).director) {
          _push(`<span class="hidden sm:inline text-stage-700" data-v-c918743f>•</span>`);
        } else {
          _push(`<!---->`);
        }
        if (unref(playbill).director) {
          _push(`<span data-v-c918743f>${ssrInterpolate(unref(playbill).director)}</span>`);
        } else {
          _push(`<!---->`);
        }
        _push(`</div></header>`);
        if (unref(playbill).hero_image) {
          _push(`<section class="playbill-hero max-w-2xl mx-auto px-4 mb-10" data-v-c918743f><div class="relative rounded-2xl overflow-hidden aspect-[16/10] border border-stage-800 shadow-2xl bg-stage-900" data-v-c918743f><img${ssrRenderAttrs(mergeProps(unref(getImageProps)(unref(playbill).hero_image, { sm: 600, md: 800, lg: 1200 }, { quality: 85 }), {
            alt: unref(playbill).title,
            class: "w-full h-full object-cover"
          }))} data-v-c918743f><div class="absolute inset-0 bg-gradient-to-t from-stage-950/60 via-transparent to-transparent pointer-events-none" data-v-c918743f></div></div></section>`);
        } else {
          _push(`<!---->`);
        }
        _push(`<nav class="playbill-tabs max-w-md mx-auto px-4 mb-8 sticky top-[49px] z-30 bg-stage-950/95 py-2" data-v-c918743f><div class="grid grid-cols-3 bg-stage-900/80 backdrop-blur border border-stage-800/80 rounded-xl p-1 shadow-xl" data-v-c918743f><button class="${ssrRenderClass([unref(activeTab) === "about" ? "bg-brand-500 text-stage-950 font-black shadow-md" : "text-stage-400 hover:text-stage-200", "py-2.5 rounded-lg text-xs font-bold uppercase tracking-wider transition-all duration-300 flex items-center justify-center gap-1.5"])}" data-v-c918743f> About </button><button class="${ssrRenderClass([unref(activeTab) === "credits" ? "bg-brand-500 text-stage-950 font-black shadow-md" : "text-stage-400 hover:text-stage-200", "py-2.5 rounded-lg text-xs font-bold uppercase tracking-wider transition-all duration-300 flex items-center justify-center gap-1.5"])}" data-v-c918743f> Credits </button><button class="${ssrRenderClass([unref(activeTab) === "support" ? "bg-brand-500 text-stage-950 font-black shadow-md" : "text-stage-400 hover:text-stage-200", "py-2.5 rounded-lg text-xs font-bold uppercase tracking-wider transition-all duration-300 flex items-center justify-center gap-1.5"])}" data-v-c918743f> Sponsors </button></div></nav><main class="max-w-2xl mx-auto px-4" data-v-c918743f>`);
        if (unref(activeTab) === "about") {
          _push(`<div class="space-y-8" data-v-c918743f>`);
          if (unref(playbill).production || unref(playbill).event) {
            _push(`<div class="p-6 rounded-2xl bg-stage-900/40 border border-stage-800/80 card-glass flex items-start gap-4" data-v-c918743f><div class="w-10 h-10 rounded-lg bg-brand-500/10 border border-brand-500/30 flex items-center justify-center text-brand-400 flex-shrink-0" data-v-c918743f><svg class="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="1.5" data-v-c918743f><path stroke-linecap="round" stroke-linejoin="round" d="M16.5 6v.75m0 3v.75m0 3v.75m0 3V18m-9-5.25h5.25M7.5 15h3M3.375 5.25c-.621 0-1.125.504-1.125 1.125v3.026a2.999 2.999 0 010 5.198v3.026c0 .621.504 1.125 1.125 1.125h17.25c.621 0 1.125-.504 1.125-1.125v-3.026a2.999 2.999 0 010-5.198V6.375c0-.621-.504-1.125-1.125-1.125H3.375z" data-v-c918743f></path></svg></div><div data-v-c918743f><h4 class="text-xs uppercase tracking-widest font-black text-brand-400" data-v-c918743f>Flux Presentation</h4><p class="text-sm font-semibold text-stage-100 mt-1 leading-snug" data-v-c918743f> This digital playbill is curated for the ensemble presentation of <span class="font-serif italic font-bold" data-v-c918743f>${ssrInterpolate(unref(playbill).production ? unref(playbill).production.title : unref(playbill).event.title)}</span>. </p>`);
            if (unref(playbill).event && typeof unref(playbill).event === "object") {
              _push(`<div class="mt-2 text-xs text-stage-400 flex items-center gap-1.5" data-v-c918743f><svg class="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" data-v-c918743f><path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M15 10.5a3 3 0 11-6 0 3 3 0 016 0z" data-v-c918743f></path><path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M19.5 10.5c0 7.142-7.5 11.25-7.5 11.25S4.5 17.642 4.5 10.5a7.5 7.5 0 1115 0z" data-v-c918743f></path></svg><span data-v-c918743f>${ssrInterpolate(unref(playbill).event.venue?.name || "Online")}</span></div>`);
            } else {
              _push(`<!---->`);
            }
            _push(`</div></div>`);
          } else {
            _push(`<!---->`);
          }
          if (unref(playbill).content) {
            _push(`<div class="prose prose-invert prose-lg max-w-none" data-v-c918743f>`);
            _push(ssrRenderComponent(_component_BlockRenderer, {
              content: unref(playbill).content
            }, null, _parent));
            _push(`</div>`);
          } else {
            _push(`<div class="text-center py-12 border border-dashed border-stage-800 rounded-2xl bg-stage-900/20" data-v-c918743f><p class="text-stage-500 italic font-serif" data-v-c918743f>Welcome to our Digital Playbill. Tap on the Credits or Sponsors tabs above to explore.</p></div>`);
          }
          _push(`</div>`);
        } else if (unref(activeTab) === "credits") {
          _push(`<div class="space-y-12" data-v-c918743f>`);
          if (unref(cast).length) {
            _push(`<div data-v-c918743f><div class="flex items-center justify-between border-b border-stage-800/80 pb-3 mb-6" data-v-c918743f><h2 class="text-2xl font-serif font-black text-stage-50 tracking-wide flex items-center gap-2" data-v-c918743f> Cast </h2><span class="text-xs uppercase tracking-widest font-semibold text-stage-500 bg-stage-900 px-3 py-1 rounded-full border border-stage-800/40" data-v-c918743f> In Order of Appearance </span></div><div class="space-y-3" data-v-c918743f><!--[-->`);
            ssrRenderList(unref(cast), (credit) => {
              _push(`<button class="w-full text-left p-3 rounded-xl bg-stage-900/30 border border-stage-800/40 hover:bg-stage-800/40 hover:border-brand-500/30 transition-all duration-300 flex items-center gap-4 group" data-v-c918743f><div class="w-12 h-12 rounded-full overflow-hidden border border-stage-800 group-hover:border-brand-500/50 transition-colors bg-stage-950 flex-shrink-0" data-v-c918743f>`);
              if (credit.person?.headshot) {
                _push(`<img${ssrRenderAttrs(mergeProps({ ref_for: true }, unref(getImageProps)(credit.person.headshot, { sm: 100 }, { quality: 70 }), {
                  alt: credit.person.first_name,
                  class: "w-full h-full object-cover"
                }))} data-v-c918743f>`);
              } else {
                _push(`<div class="w-full h-full flex items-center justify-center bg-stage-900 text-stage-600 font-serif font-bold text-lg" data-v-c918743f>${ssrInterpolate(credit.person?.first_name?.[0] || "A")}</div>`);
              }
              _push(`</div><div class="flex-1 min-w-0" data-v-c918743f><p class="font-serif font-bold text-stage-100 group-hover:text-brand-400 transition-colors leading-tight" data-v-c918743f>${ssrInterpolate(credit.person?.first_name || "")} ${ssrInterpolate(credit.person?.last_name || "")}</p>`);
              if (credit.person?.pronouns) {
                _push(`<p class="text-[10px] text-stage-500 mt-0.5" data-v-c918743f>(${ssrInterpolate(credit.person.pronouns)})</p>`);
              } else {
                _push(`<!---->`);
              }
              _push(`</div><div class="text-right min-w-[40%]" data-v-c918743f><p class="text-sm font-semibold text-stage-200 font-serif italic" data-v-c918743f>${ssrInterpolate(credit.role_name)}</p>`);
              if (credit.is_understudy) {
                _push(`<p class="text-[9px] font-bold text-brand-500 uppercase tracking-widest mt-0.5" data-v-c918743f>Understudy</p>`);
              } else {
                _push(`<!---->`);
              }
              _push(`</div><div class="text-stage-600 group-hover:text-brand-400 transition-colors pl-2" data-v-c918743f><svg class="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2.5" data-v-c918743f><path stroke-linecap="round" stroke-linejoin="round" d="M8.25 4.5l7.5 7.5-7.5 7.5" data-v-c918743f></path></svg></div></button>`);
            });
            _push(`<!--]--></div></div>`);
          } else {
            _push(`<!---->`);
          }
          if (unref(crewByDepartment).length) {
            _push(`<div class="space-y-10" data-v-c918743f><!--[-->`);
            ssrRenderList(unref(crewByDepartment), (dept) => {
              _push(`<div class="space-y-4" data-v-c918743f><h3 class="text-lg font-serif font-bold text-brand-400 tracking-wide border-b border-stage-900 pb-2" data-v-c918743f>${ssrInterpolate(dept.name)}</h3><div class="grid grid-cols-1 sm:grid-cols-2 gap-3" data-v-c918743f><!--[-->`);
              ssrRenderList(dept.credits, (credit) => {
                _push(`<button class="w-full text-left p-3 rounded-xl bg-stage-900/20 border border-stage-800/40 hover:bg-stage-800/40 hover:border-brand-500/30 transition-all duration-300 flex items-center justify-between group" data-v-c918743f><div class="min-w-0 pr-4" data-v-c918743f><p class="text-xs font-black text-stage-500 uppercase tracking-widest" data-v-c918743f>${ssrInterpolate(credit.title)}</p><p class="font-serif font-bold text-stage-100 group-hover:text-brand-400 transition-colors mt-0.5 truncate" data-v-c918743f>${ssrInterpolate(credit.person?.first_name || "")} ${ssrInterpolate(credit.person?.last_name || "")}</p></div><div class="text-stage-600 group-hover:text-brand-400 transition-colors flex-shrink-0" data-v-c918743f><svg class="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2.5" data-v-c918743f><path stroke-linecap="round" stroke-linejoin="round" d="M8.25 4.5l7.5 7.5-7.5 7.5" data-v-c918743f></path></svg></div></button>`);
              });
              _push(`<!--]--></div></div>`);
            });
            _push(`<!--]--></div>`);
          } else {
            _push(`<!---->`);
          }
          _push(`</div>`);
        } else if (unref(activeTab) === "support") {
          _push(`<div class="space-y-8 text-center" data-v-c918743f><div class="py-6 border-b border-stage-800/60 max-w-lg mx-auto" data-v-c918743f><h2 class="text-2xl font-serif font-black text-stage-100" data-v-c918743f>Ensemble Funders</h2><p class="text-sm text-stage-400 mt-2 font-serif italic" data-v-c918743f> Our productions, workshops, and playbills are made possible through the generous support of our sponsors. </p></div>`);
          if (unref(funders).length) {
            _push(`<div class="grid grid-cols-2 gap-6 max-w-lg mx-auto pt-4" data-v-c918743f><!--[-->`);
            ssrRenderList(unref(funders), (funder) => {
              _push(`<a${ssrRenderAttr("href", funder.url || "#")} target="_blank" class="group flex flex-col items-center justify-center p-6 rounded-2xl bg-stage-900/30 border border-stage-800/50 hover:border-brand-500/40 hover:bg-stage-900/60 transition-all duration-300 shadow-lg" data-v-c918743f><div class="w-full aspect-square max-h-[100px] bg-white rounded-xl shadow p-4 flex items-center justify-center overflow-hidden border border-stage-800/10 group-hover:border-brand-500/20 transition-colors" data-v-c918743f>`);
              if (funder.image) {
                _push(`<img${ssrRenderAttrs(mergeProps({ ref_for: true }, unref(getImageProps)(funder.image, { sm: 200 }, { quality: 80 }), {
                  alt: funder.name,
                  class: "w-full h-full object-contain grayscale group-hover:grayscale-0 transition-all duration-500"
                }))} data-v-c918743f>`);
              } else {
                _push(`<span class="text-stage-900 font-serif font-bold text-center text-sm leading-tight" data-v-c918743f>${ssrInterpolate(funder.name)}</span>`);
              }
              _push(`</div><span class="text-xs font-semibold text-stage-400 mt-3 group-hover:text-brand-400 transition-colors" data-v-c918743f>${ssrInterpolate(funder.name)}</span></a>`);
            });
            _push(`<!--]--></div>`);
          } else {
            _push(`<div class="py-12 text-stage-500 italic font-serif" data-v-c918743f> Thank you to all who make our works possible. </div>`);
          }
          _push(`<div class="max-w-md mx-auto p-6 rounded-2xl bg-gradient-to-br from-stage-900 to-stage-950 border border-stage-800 shadow-xl mt-12 text-left" data-v-c918743f><h3 class="text-lg font-serif font-black text-stage-50" data-v-c918743f>Support the Ensemble</h3><p class="text-xs text-stage-400 mt-2 leading-relaxed" data-v-c918743f> Flux Theatre Ensemble operates as a collaborative, non-profit community. Your support directly funds local theater makers, playwrights, accessibility tools, and digital programs like this playbill. </p><div class="mt-5 flex items-center gap-3" data-v-c918743f><a href="https://fluxtheatre.org/donate" target="_blank" class="px-5 py-2.5 rounded-lg bg-brand-500 text-stage-950 text-xs font-bold uppercase tracking-wider shadow-lg hover:scale-105 hover:bg-brand-400 transition-all duration-300" data-v-c918743f> Donate Now </a>`);
          _push(ssrRenderComponent(_component_NuxtLink, {
            to: "/",
            class: "text-xs font-semibold text-stage-400 hover:text-brand-400 transition-colors"
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
        _push(`</main>`);
        _push(ssrRenderComponent(_component_BaseModal, {
          "is-open": unref(isModalOpen),
          "max-width": "max-w-xl",
          onClose: closeBioModal
        }, {
          default: withCtx((_, _push2, _parent2, _scopeId) => {
            if (_push2) {
              if (unref(selectedPerson)) {
                _push2(`<div class="p-6 md:p-8 flex flex-col sm:flex-row gap-6 sm:items-start text-left" data-v-c918743f${_scopeId}>`);
                if (unref(selectedPerson).headshot) {
                  _push2(`<div class="w-28 h-28 sm:w-36 sm:h-44 rounded-xl overflow-hidden border border-stage-800/80 shadow-lg bg-stage-950 flex-shrink-0 mx-auto sm:mx-0" data-v-c918743f${_scopeId}><img${ssrRenderAttrs(mergeProps(unref(getImageProps)(unref(selectedPerson).headshot, { sm: 200 }, { quality: 85 }), {
                    alt: unref(selectedPerson).name,
                    class: "w-full h-full object-cover animate-scale-in"
                  }))} data-v-c918743f${_scopeId}></div>`);
                } else {
                  _push2(`<!---->`);
                }
                _push2(`<div class="flex-1 min-w-0" data-v-c918743f${_scopeId}><div class="flex flex-col sm:flex-row sm:items-baseline sm:justify-between gap-1" data-v-c918743f${_scopeId}><h3 class="text-2xl font-serif font-bold text-stage-50 tracking-wide" data-v-c918743f${_scopeId}>${ssrInterpolate(unref(selectedPerson).name)}</h3>`);
                if (unref(selectedPerson).pronouns) {
                  _push2(`<span class="text-[10px] uppercase font-black tracking-widest text-stage-500" data-v-c918743f${_scopeId}>${ssrInterpolate(unref(selectedPerson).pronouns)}</span>`);
                } else {
                  _push2(`<!---->`);
                }
                _push2(`</div><p class="text-xs font-black tracking-wider text-brand-400 uppercase mt-1" data-v-c918743f${_scopeId}>${ssrInterpolate(unref(selectedPerson).role)}</p><div class="mt-4 pt-4 border-t border-stage-800/40 prose prose-invert prose-sm text-stage-300 max-w-none leading-relaxed" data-v-c918743f${_scopeId}>`);
                if (unref(selectedPerson).bio) {
                  _push2(ssrRenderComponent(_component_BlockRenderer, {
                    content: unref(selectedPerson).bio
                  }, null, _parent2, _scopeId));
                } else {
                  _push2(`<p class="italic text-stage-500" data-v-c918743f${_scopeId}>No biography override or details added yet.</p>`);
                }
                _push2(`</div></div></div>`);
              } else {
                _push2(`<!---->`);
              }
            } else {
              return [
                unref(selectedPerson) ? (openBlock(), createBlock("div", {
                  key: 0,
                  class: "p-6 md:p-8 flex flex-col sm:flex-row gap-6 sm:items-start text-left"
                }, [
                  unref(selectedPerson).headshot ? (openBlock(), createBlock("div", {
                    key: 0,
                    class: "w-28 h-28 sm:w-36 sm:h-44 rounded-xl overflow-hidden border border-stage-800/80 shadow-lg bg-stage-950 flex-shrink-0 mx-auto sm:mx-0"
                  }, [
                    createVNode("img", mergeProps(unref(getImageProps)(unref(selectedPerson).headshot, { sm: 200 }, { quality: 85 }), {
                      alt: unref(selectedPerson).name,
                      class: "w-full h-full object-cover animate-scale-in"
                    }), null, 16, ["alt"])
                  ])) : createCommentVNode("", true),
                  createVNode("div", { class: "flex-1 min-w-0" }, [
                    createVNode("div", { class: "flex flex-col sm:flex-row sm:items-baseline sm:justify-between gap-1" }, [
                      createVNode("h3", { class: "text-2xl font-serif font-bold text-stage-50 tracking-wide" }, toDisplayString(unref(selectedPerson).name), 1),
                      unref(selectedPerson).pronouns ? (openBlock(), createBlock("span", {
                        key: 0,
                        class: "text-[10px] uppercase font-black tracking-widest text-stage-500"
                      }, toDisplayString(unref(selectedPerson).pronouns), 1)) : createCommentVNode("", true)
                    ]),
                    createVNode("p", { class: "text-xs font-black tracking-wider text-brand-400 uppercase mt-1" }, toDisplayString(unref(selectedPerson).role), 1),
                    createVNode("div", { class: "mt-4 pt-4 border-t border-stage-800/40 prose prose-invert prose-sm text-stage-300 max-w-none leading-relaxed" }, [
                      unref(selectedPerson).bio ? (openBlock(), createBlock(_component_BlockRenderer, {
                        key: 0,
                        content: unref(selectedPerson).bio
                      }, null, 8, ["content"])) : (openBlock(), createBlock("p", {
                        key: 1,
                        class: "italic text-stage-500"
                      }, "No biography override or details added yet."))
                    ])
                  ])
                ])) : createCommentVNode("", true)
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
const _sfc_setup = _sfc_main.setup;
_sfc_main.setup = (props, ctx) => {
  const ssrContext = useSSRContext();
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("pages/playbills/[slug].vue");
  return _sfc_setup ? _sfc_setup(props, ctx) : void 0;
};
const _slug_ = /* @__PURE__ */ _export_sfc(_sfc_main, [["__scopeId", "data-v-c918743f"]]);

export { _slug_ as default };
//# sourceMappingURL=_slug_-COVgqki9.mjs.map
