import { _ as __nuxt_component_1 } from './BlockRenderer-CUz7VsbB.mjs';
import { _ as __nuxt_component_0 } from './nuxt-link-cZpXnfBZ.mjs';
import { defineComponent, withAsyncContext, computed, unref, mergeProps, withCtx, createVNode, openBlock, createBlock, createCommentVNode, toDisplayString, createTextVNode, useSSRContext } from 'vue';
import { ssrRenderAttrs, ssrInterpolate, ssrRenderAttr, ssrRenderComponent, ssrRenderList } from 'vue/server-renderer';
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
    const slug = route.params.slug;
    const { client, readItems, getImageProps } = useDirectus();
    const { data: funderRecord, error } = ([__temp, __restore] = withAsyncContext(async () => useAsyncData(`funder-${slug}`, async () => {
      const f = await client.request(readItems("funder", {
        filter: { slug: { _eq: slug } },
        fields: [
          "*",
          {
            productions: ["*", { production_id: ["title", "slug", "season", "poster_image"] }],
            events: ["*", { event_id: ["title", "slug", "start_datetime", "cover_image"] }],
            pages: ["*", { page_id: ["title", "slug"] }]
          }
        ],
        limit: 1
      }));
      if (!f.length) return null;
      const funder = f[0];
      return {
        ...funder,
        productionsData: (funder.productions || []).map((p) => p.production_id).filter(Boolean),
        eventsData: (funder.events || []).map((e) => e.event_id).filter(Boolean),
        pagesData: (funder.pages || []).map((p) => p.page_id).filter(Boolean)
      };
    })), __temp = await __temp, __restore(), __temp);
    if (error.value) {
      throw createError({
        statusCode: 500,
        statusMessage: `Failed to fetch funder data: ${error.value.message || "Unknown error"}`
      });
    }
    if (!funderRecord.value) {
      throw createError({ statusCode: 404, statusMessage: "Funder not found" });
    }
    useSeoMeta({
      title: () => `${funderRecord.value?.name} — Flux Theatre Ensemble`,
      description: () => funderRecord.value?.name || ""
    });
    const hasAnyConnections = computed(() => {
      return (funderRecord.value?.productionsData?.length || 0) > 0 || (funderRecord.value?.eventsData?.length || 0) > 0 || (funderRecord.value?.pagesData?.length || 0) > 0;
    });
    return (_ctx, _push, _parent, _attrs) => {
      const _component_BlockRenderer = __nuxt_component_1;
      const _component_NuxtLink = __nuxt_component_0;
      if (unref(funderRecord)) {
        _push(`<div${ssrRenderAttrs(mergeProps({ class: "funder-page pb-24" }, _attrs))} data-v-56791d68><section class="funder-page__hero pt-16 pb-12 bg-stage-950 border-b border-stage-800/30" id="funder-hero" data-v-56791d68><div class="funder-page__hero-container max-w-5xl mx-auto px-4 sm:px-6 lg:px-8" data-v-56791d68><div class="funder-page__layout flex flex-col md:flex-row gap-8 lg:gap-12 items-center md:items-start" data-v-56791d68><div class="funder-page__image-col w-48 md:w-1/3 lg:w-1/4" data-v-56791d68><div class="funder-page__image-wrapper aspect-square rounded-2xl overflow-hidden border border-stage-700/50 shadow-2xl bg-white p-6 flex items-center justify-center" data-v-56791d68>`);
        if (unref(funderRecord).image) {
          _push(`<img${ssrRenderAttrs(mergeProps(unref(getImageProps)(unref(funderRecord).image, { sm: 400 }, { quality: 85 }), {
            alt: unref(funderRecord).name,
            class: "funder-page__image w-full h-full object-contain"
          }))} data-v-56791d68>`);
        } else {
          _push(`<div class="funder-page__image-placeholder w-full h-full flex items-center justify-center text-stage-200" data-v-56791d68><span class="text-4xl font-serif font-bold text-stage-600" data-v-56791d68>${ssrInterpolate(unref(funderRecord).name.charAt(0))}</span></div>`);
        }
        _push(`</div></div><div class="funder-page__info-col flex-1 text-center md:text-left" data-v-56791d68><div class="funder-page__meta mb-4" data-v-56791d68>`);
        if (unref(funderRecord).url) {
          _push(`<a${ssrRenderAttr("href", unref(funderRecord).url)} target="_blank" class="funder-page__website text-xs font-bold uppercase tracking-widest text-brand-400 hover:text-brand-300 transition-colors flex items-center justify-center md:justify-start gap-1" data-v-56791d68> Visit Website <svg class="w-3 h-3" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2" data-v-56791d68><path stroke-linecap="round" stroke-linejoin="round" d="M13.5 6H5.25A2.25 2.25 0 003 8.25v10.5A2.25 2.25 0 005.25 21h10.5A2.25 2.25 0 0018 18.75V10.5M13.5 6L21 3m0 0h-5.25M21 3v5.25" data-v-56791d68></path></svg></a>`);
        } else {
          _push(`<!---->`);
        }
        _push(`</div><h1 class="funder-page__name text-4xl sm:text-5xl font-serif font-bold text-stage-50 mb-6" data-v-56791d68>${ssrInterpolate(unref(funderRecord).name)}</h1>`);
        if (unref(funderRecord).description) {
          _push(`<div class="funder-page__description prose prose-invert prose-lg max-w-none text-stage-300" data-v-56791d68>`);
          _push(ssrRenderComponent(_component_BlockRenderer, {
            content: unref(funderRecord).description
          }, null, _parent));
          _push(`</div>`);
        } else {
          _push(`<!---->`);
        }
        _push(`</div></div></div></section>`);
        if (unref(hasAnyConnections)) {
          _push(`<section class="funder-page__connections py-20" id="funder-connections" data-v-56791d68><div class="funder-page__connections-container max-w-5xl mx-auto px-4 sm:px-6 lg:px-8" data-v-56791d68><h2 class="funder-page__section-title text-2xl font-serif font-bold text-stage-100 mb-10 pb-4 border-b border-stage-800" data-v-56791d68> Supported Work &amp; Initiatives </h2><div class="funder-page__connections-grid grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8" data-v-56791d68>`);
          if (unref(funderRecord).productionsData.length) {
            _push(`<div class="funder-page__group lg:col-span-1" data-v-56791d68><h3 class="funder-page__group-title text-xs font-bold uppercase tracking-[0.2em] text-stage-500 mb-6" data-v-56791d68> Productions </h3><ul class="space-y-4" data-v-56791d68><!--[-->`);
            ssrRenderList(unref(funderRecord).productionsData, (prod) => {
              _push(`<li data-v-56791d68>`);
              _push(ssrRenderComponent(_component_NuxtLink, {
                to: `/productions/${prod.slug}`,
                class: "flex items-center gap-4 group"
              }, {
                default: withCtx((_, _push2, _parent2, _scopeId) => {
                  if (_push2) {
                    _push2(`<div class="w-12 h-16 bg-stage-800 rounded overflow-hidden flex-shrink-0" data-v-56791d68${_scopeId}>`);
                    if (prod.poster_image) {
                      _push2(`<img${ssrRenderAttrs(mergeProps({ ref_for: true }, unref(getImageProps)(prod.poster_image, { sm: 100 }, { quality: 70 }), { class: "w-full h-full object-cover" }))} data-v-56791d68${_scopeId}>`);
                    } else {
                      _push2(`<!---->`);
                    }
                    _push2(`</div><div data-v-56791d68${_scopeId}><p class="text-sm font-bold text-stage-100 group-hover:text-brand-400 transition-colors" data-v-56791d68${_scopeId}>${ssrInterpolate(prod.title)}</p><p class="text-xs text-stage-500" data-v-56791d68${_scopeId}>${ssrInterpolate(prod.season)}</p></div>`);
                  } else {
                    return [
                      createVNode("div", { class: "w-12 h-16 bg-stage-800 rounded overflow-hidden flex-shrink-0" }, [
                        prod.poster_image ? (openBlock(), createBlock("img", mergeProps({
                          key: 0,
                          ref_for: true
                        }, unref(getImageProps)(prod.poster_image, { sm: 100 }, { quality: 70 }), { class: "w-full h-full object-cover" }), null, 16)) : createCommentVNode("", true)
                      ]),
                      createVNode("div", null, [
                        createVNode("p", { class: "text-sm font-bold text-stage-100 group-hover:text-brand-400 transition-colors" }, toDisplayString(prod.title), 1),
                        createVNode("p", { class: "text-xs text-stage-500" }, toDisplayString(prod.season), 1)
                      ])
                    ];
                  }
                }),
                _: 2
              }, _parent));
              _push(`</li>`);
            });
            _push(`<!--]--></ul></div>`);
          } else {
            _push(`<!---->`);
          }
          if (unref(funderRecord).eventsData.length) {
            _push(`<div class="funder-page__group lg:col-span-1" data-v-56791d68><h3 class="funder-page__group-title text-xs font-bold uppercase tracking-[0.2em] text-stage-500 mb-6" data-v-56791d68> Events </h3><ul class="space-y-4" data-v-56791d68><!--[-->`);
            ssrRenderList(unref(funderRecord).eventsData, (event) => {
              _push(`<li data-v-56791d68>`);
              _push(ssrRenderComponent(_component_NuxtLink, {
                to: `/events/${event.slug}`,
                class: "flex items-center gap-4 group"
              }, {
                default: withCtx((_, _push2, _parent2, _scopeId) => {
                  if (_push2) {
                    _push2(`<div class="w-12 h-12 bg-stage-800 rounded overflow-hidden flex-shrink-0" data-v-56791d68${_scopeId}>`);
                    if (event.cover_image) {
                      _push2(`<img${ssrRenderAttrs(mergeProps({ ref_for: true }, unref(getImageProps)(event.cover_image, { sm: 100 }, { quality: 70 }), { class: "w-full h-full object-cover" }))} data-v-56791d68${_scopeId}>`);
                    } else {
                      _push2(`<!---->`);
                    }
                    _push2(`</div><div data-v-56791d68${_scopeId}><p class="text-sm font-bold text-stage-100 group-hover:text-brand-400 transition-colors" data-v-56791d68${_scopeId}>${ssrInterpolate(event.title)}</p><p class="text-xs text-stage-500" data-v-56791d68${_scopeId}>${ssrInterpolate(new Date(event.start_datetime).getFullYear())}</p></div>`);
                  } else {
                    return [
                      createVNode("div", { class: "w-12 h-12 bg-stage-800 rounded overflow-hidden flex-shrink-0" }, [
                        event.cover_image ? (openBlock(), createBlock("img", mergeProps({
                          key: 0,
                          ref_for: true
                        }, unref(getImageProps)(event.cover_image, { sm: 100 }, { quality: 70 }), { class: "w-full h-full object-cover" }), null, 16)) : createCommentVNode("", true)
                      ]),
                      createVNode("div", null, [
                        createVNode("p", { class: "text-sm font-bold text-stage-100 group-hover:text-brand-400 transition-colors" }, toDisplayString(event.title), 1),
                        createVNode("p", { class: "text-xs text-stage-500" }, toDisplayString(new Date(event.start_datetime).getFullYear()), 1)
                      ])
                    ];
                  }
                }),
                _: 2
              }, _parent));
              _push(`</li>`);
            });
            _push(`<!--]--></ul></div>`);
          } else {
            _push(`<!---->`);
          }
          if (unref(funderRecord).pagesData.length) {
            _push(`<div class="funder-page__group lg:col-span-1" data-v-56791d68><h3 class="funder-page__group-title text-xs font-bold uppercase tracking-[0.2em] text-stage-500 mb-6" data-v-56791d68> Programs &amp; Initiatives </h3><ul class="space-y-4" data-v-56791d68><!--[-->`);
            ssrRenderList(unref(funderRecord).pagesData, (page) => {
              _push(`<li data-v-56791d68>`);
              _push(ssrRenderComponent(_component_NuxtLink, {
                to: `/${page.slug}`,
                class: "block p-3 rounded-lg border border-stage-800 hover:border-brand-500/50 hover:bg-brand-500/5 transition-all group"
              }, {
                default: withCtx((_, _push2, _parent2, _scopeId) => {
                  if (_push2) {
                    _push2(`<p class="text-sm font-bold text-stage-100 group-hover:text-brand-400 transition-colors" data-v-56791d68${_scopeId}>${ssrInterpolate(page.title)}</p>`);
                  } else {
                    return [
                      createVNode("p", { class: "text-sm font-bold text-stage-100 group-hover:text-brand-400 transition-colors" }, toDisplayString(page.title), 1)
                    ];
                  }
                }),
                _: 2
              }, _parent));
              _push(`</li>`);
            });
            _push(`<!--]--></ul></div>`);
          } else {
            _push(`<!---->`);
          }
          _push(`</div></div></section>`);
        } else {
          _push(`<!---->`);
        }
        _push(`<section class="funder-page__cta py-20 border-t border-stage-800/40" data-v-56791d68><div class="max-w-3xl mx-auto px-4 text-center" data-v-56791d68><h2 class="text-2xl font-serif font-bold text-stage-900 mb-4" data-v-56791d68>Support Collective Care</h2><p class="text-stage-400 mb-8 leading-relaxed" data-v-56791d68> Flux Theatre Ensemble is profoundly grateful for our institutional funders. Your support ensures we can continue to produce transformative, artist-centered work. </p>`);
        _push(ssrRenderComponent(_component_NuxtLink, {
          to: "/donate",
          class: "btn-primary text-brand-400"
        }, {
          default: withCtx((_, _push2, _parent2, _scopeId) => {
            if (_push2) {
              _push2(`Donate to Flux`);
            } else {
              return [
                createTextVNode("Donate to Flux")
              ];
            }
          }),
          _: 1
        }, _parent));
        _push(`</div></section></div>`);
      } else {
        _push(`<!---->`);
      }
    };
  }
});
const _sfc_setup = _sfc_main.setup;
_sfc_main.setup = (props, ctx) => {
  const ssrContext = useSSRContext();
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("pages/funders/[slug].vue");
  return _sfc_setup ? _sfc_setup(props, ctx) : void 0;
};
const _slug_ = /* @__PURE__ */ _export_sfc(_sfc_main, [["__scopeId", "data-v-56791d68"]]);

export { _slug_ as default };
//# sourceMappingURL=_slug_-CI5vHafg.mjs.map
