import { _ as __nuxt_component_0 } from './ProductionCard-CPipeFgh.mjs';
import { defineComponent, withAsyncContext, ref, computed, mergeProps, unref, useSSRContext } from 'vue';
import { ssrRenderAttrs, ssrRenderList, ssrRenderClass, ssrInterpolate, ssrRenderComponent } from 'vue/server-renderer';
import { u as useSeoMeta } from './composables-DOi4jpYZ.mjs';
import { u as useDirectus, a as useAsyncData } from './asyncData-BxKqmOFY.mjs';
import './nuxt-link-cZpXnfBZ.mjs';
import '../_/nitro.mjs';
import 'node:http';
import 'node:https';
import 'node:events';
import 'node:buffer';
import 'node:fs';
import 'node:path';
import 'node:crypto';
import './server.mjs';
import '../routes/renderer.mjs';
import 'vue-bundle-renderer/runtime';
import 'unhead/server';
import 'devalue';
import 'unhead/plugins';
import 'unhead/utils';
import 'vue-router';
import '@directus/sdk';

const _sfc_main = /* @__PURE__ */ defineComponent({
  __name: "index",
  __ssrInlineRender: true,
  async setup(__props) {
    let __temp, __restore;
    useSeoMeta({
      title: "Productions — Flux Theatre Ensemble",
      description: "Browse current and past productions from Flux Theatre Ensemble in New York City."
    });
    const { client, readItems } = useDirectus();
    const { data: allProductions } = ([__temp, __restore] = withAsyncContext(() => useAsyncData(
      "all-productions",
      () => client.request(readItems("productions", {
        filter: { status: { _eq: "published" } },
        fields: ["*", { Venue: [{ venues_id: ["name", "city"] }] }],
        sort: ["-opening_date"]
      }))
    )), __temp = await __temp, __restore(), __temp);
    const activeFilter = ref("all");
    const filteredProductions = computed(() => {
      if (!allProductions.value) return [];
      const now = /* @__PURE__ */ new Date();
      if (activeFilter.value === "current") {
        return allProductions.value.filter((p) => !p.closing_date || new Date(p.closing_date) >= now);
      }
      if (activeFilter.value === "past") {
        return allProductions.value.filter((p) => p.closing_date && new Date(p.closing_date) < now);
      }
      return allProductions.value;
    });
    const filters = [
      { label: "All", value: "all" },
      { label: "Current & Upcoming", value: "current" },
      { label: "Past Seasons", value: "past" }
    ];
    return (_ctx, _push, _parent, _attrs) => {
      const _component_ProductionCard = __nuxt_component_0;
      _push(`<div${ssrRenderAttrs(mergeProps({ class: "productions-page" }, _attrs))}><section class="productions-page__header pt-12 pb-8" id="productions-header"><div class="productions-page__header-container max-w-7xl mx-auto px-4 sm:px-6 lg:px-8"><p class="productions-page__subtitle text-brand-400 font-medium text-sm uppercase tracking-[0.15em] mb-2">Our Work</p><h1 class="productions-page__title section-heading">Productions</h1><p class="productions-page__description mt-4 text-stage-400 text-lg max-w-2xl"> From world premieres to reimagined classics — explore the bold, adventurous work of Flux Theatre Ensemble. </p></div></section><section class="productions-page__filters-section pb-8" id="production-filters"><div class="productions-page__filters-container max-w-7xl mx-auto px-4 sm:px-6 lg:px-8"><div class="productions-page__filters flex gap-2 border-b border-stage-800/60 pb-px"><!--[-->`);
      ssrRenderList(filters, (f) => {
        _push(`<button class="${ssrRenderClass([unref(activeFilter) === f.value ? "productions-page__filter-btn--active text-brand-400 bg-stage-300/50 border-b-2 border-brand-400 -mb-px" : "productions-page__filter-btn--inactive text-stage-400 hover:text-stage-200 hover:bg-stage-300/30", "productions-page__filter-btn px-4 py-2.5 text-sm font-medium rounded-t-lg transition-all duration-200"])}">${ssrInterpolate(f.label)}</button>`);
      });
      _push(`<!--]--></div></div></section><section class="productions-page__grid-section pb-24" id="productions-grid"><div class="productions-page__grid-container max-w-7xl mx-auto px-4 sm:px-6 lg:px-8"><div${ssrRenderAttrs({
        class: "productions-page__grid grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6",
        "enter-active-class": "transition-all duration-300 ease-out",
        "enter-from-class": "opacity-0 scale-95",
        "enter-to-class": "opacity-100 scale-100",
        "leave-active-class": "transition-all duration-200 ease-in",
        "leave-from-class": "opacity-100 scale-100",
        "leave-to-class": "opacity-0 scale-95"
      })}>`);
      ssrRenderList(unref(filteredProductions), (prod) => {
        _push(ssrRenderComponent(_component_ProductionCard, {
          key: prod.slug,
          production: prod,
          class: "productions-page__card"
        }, null, _parent));
      });
      _push(`</div>`);
      if (unref(filteredProductions).length === 0) {
        _push(`<p class="productions-page__empty-text text-center text-stage-500 py-16 text-lg"> No productions match the current filter. </p>`);
      } else {
        _push(`<!---->`);
      }
      _push(`</div></section></div>`);
    };
  }
});
const _sfc_setup = _sfc_main.setup;
_sfc_main.setup = (props, ctx) => {
  const ssrContext = useSSRContext();
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("pages/productions/index.vue");
  return _sfc_setup ? _sfc_setup(props, ctx) : void 0;
};

export { _sfc_main as default };
//# sourceMappingURL=index-B1fmNLKf.mjs.map
