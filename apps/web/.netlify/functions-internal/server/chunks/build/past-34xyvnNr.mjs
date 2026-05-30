import { _ as __nuxt_component_0 } from './nuxt-link-cZpXnfBZ.mjs';
import { _ as __nuxt_component_2 } from './EventCard-D3M1g4iQ.mjs';
import { defineComponent, computed, withAsyncContext, ref, mergeProps, withCtx, openBlock, createBlock, createVNode, createTextVNode, unref, useSSRContext } from 'vue';
import { ssrRenderAttrs, ssrRenderComponent, ssrRenderList, ssrRenderClass, ssrInterpolate, ssrIncludeBooleanAttr } from 'vue/server-renderer';
import { u as useSeoMeta } from './composables-DOi4jpYZ.mjs';
import { u as useDirectus, a as useAsyncData } from './asyncData-DO9zjVnq.mjs';
import { u as useRoute, a as useRouter } from './server.mjs';
import '../_/nitro.mjs';
import 'node:http';
import 'node:https';
import 'node:events';
import 'node:buffer';
import 'node:fs';
import 'node:path';
import 'node:crypto';
import 'date-fns-tz';
import '../routes/renderer.mjs';
import 'vue-bundle-renderer/runtime';
import 'unhead/server';
import 'devalue';
import 'unhead/plugins';
import 'unhead/utils';
import '@directus/sdk';
import 'vue-router';

const pageSize = 12;
const _sfc_main = /* @__PURE__ */ defineComponent({
  __name: "past",
  __ssrInlineRender: true,
  async setup(__props) {
    let __temp, __restore;
    useSeoMeta({
      title: "Past Events — Flux Theatre Ensemble",
      description: "A look back at our past workshops, readings, talkbacks, and community events."
    });
    const { client, readItems } = useDirectus();
    const route = useRoute();
    useRouter();
    const currentPage = computed(() => Number(route.query.page) || 1);
    const { data: cmsData } = ([__temp, __restore] = withAsyncContext(async () => useAsyncData(`events-past-${currentPage.value}`, async () => {
      const [items, meta] = await Promise.all([
        client.request(readItems("events", {
          filter: {
            status: { _eq: "published" },
            start_datetime: { _lt: (/* @__PURE__ */ new Date()).toISOString() }
          },
          fields: ["*", { venue: ["name"] }],
          sort: ["-start_datetime"],
          limit: pageSize,
          page: currentPage.value
        })),
        client.request(readItems("events", {
          filter: {
            status: { _eq: "published" },
            start_datetime: { _lt: (/* @__PURE__ */ new Date()).toISOString() }
          },
          aggregate: { count: "*" }
        }))
      ]);
      return {
        items,
        totalCount: Number(meta[0].count)
      };
    })), __temp = await __temp, __restore(), __temp);
    const events = computed(() => cmsData.value?.items || []);
    const totalPages = computed(() => Math.ceil((cmsData.value?.totalCount || 0) / pageSize));
    const activeFormat = ref("all");
    const activeCategory = ref("all");
    const filteredEvents = computed(() => {
      return events.value.filter((e) => {
        const matchesFormat = activeFormat.value === "all" || e.format === activeFormat.value;
        const matchesCategory = activeCategory.value === "all" || e.category === activeCategory.value;
        return matchesFormat && matchesCategory;
      });
    });
    const formatFilters = [
      { label: "All Formats", value: "all" },
      { label: "In Person", value: "in_person" },
      { label: "Digital", value: "digital" },
      { label: "Hybrid", value: "hybrid" }
    ];
    const categoryFilters = [
      { label: "All Types", value: "all" },
      { label: "Workshops", value: "workshop" },
      { label: "Readings", value: "reading" },
      { label: "Talkbacks", value: "talkback" },
      { label: "Fundraisers", value: "fundraiser" },
      { label: "Auditions", value: "audition" },
      { label: "Masterclasses", value: "masterclass" },
      { label: "Community", value: "community" }
    ];
    return (_ctx, _push, _parent, _attrs) => {
      const _component_NuxtLink = __nuxt_component_0;
      const _component_EventCard = __nuxt_component_2;
      _push(`<div${ssrRenderAttrs(mergeProps({ class: "events-page events-page--past" }, _attrs))}><section class="events-page__header pt-12 pb-6" id="past-events-header"><div class="events-page__header-container max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">`);
      _push(ssrRenderComponent(_component_NuxtLink, {
        to: "/events",
        class: "inline-flex items-center text-sm text-brand-400 hover:text-brand-300 transition-colors mb-4 group"
      }, {
        default: withCtx((_, _push2, _parent2, _scopeId) => {
          if (_push2) {
            _push2(`<svg class="w-4 h-4 mr-1 transition-transform group-hover:-translate-x-1" fill="none" viewBox="0 0 24 24" stroke="currentColor"${_scopeId}><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 19l-7-7 7-7"${_scopeId}></path></svg> Back to Upcoming `);
          } else {
            return [
              (openBlock(), createBlock("svg", {
                class: "w-4 h-4 mr-1 transition-transform group-hover:-translate-x-1",
                fill: "none",
                viewBox: "0 0 24 24",
                stroke: "currentColor"
              }, [
                createVNode("path", {
                  "stroke-linecap": "round",
                  "stroke-linejoin": "round",
                  "stroke-width": "2",
                  d: "M15 19l-7-7 7-7"
                })
              ])),
              createTextVNode(" Back to Upcoming ")
            ];
          }
        }),
        _: 1
      }, _parent));
      _push(`<h1 class="events-page__title section-heading">Past Events</h1><p class="events-page__description mt-4 text-stage-400 text-lg max-w-2xl"> A history of our readings, workshops, and community gatherings. </p></div></section><section class="events-page__filters-section pb-8" id="past-event-filters"><div class="events-page__filters-container max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-4"><div class="flex flex-wrap gap-2"><!--[-->`);
      ssrRenderList(formatFilters, (f) => {
        _push(`<button class="${ssrRenderClass([unref(activeFormat) === f.value ? "bg-brand-500 text-stage-950" : "bg-stage-800 text-stage-400 hover:text-stage-200 border border-stage-700/40", "px-3 py-1.5 rounded-full text-xs font-medium transition-all duration-200"])}">${ssrInterpolate(f.label)}</button>`);
      });
      _push(`<!--]--></div><div class="flex flex-wrap gap-2"><!--[-->`);
      ssrRenderList(categoryFilters, (c) => {
        _push(`<button class="${ssrRenderClass([unref(activeCategory) === c.value ? "bg-brand-500 text-stage-950" : "bg-stage-800 text-stage-400 hover:text-stage-200 border border-stage-700/40", "px-3 py-1.5 rounded-full text-xs font-medium transition-all duration-200"])}">${ssrInterpolate(c.label)}</button>`);
      });
      _push(`<!--]--></div></div></section><section class="events-page__grid-section pb-12" id="past-events-grid"><div class="events-page__grid-container max-w-7xl mx-auto px-4 sm:px-6 lg:px-8"><div class="events-page__grid grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6"><!--[-->`);
      ssrRenderList(unref(filteredEvents), (ev) => {
        _push(ssrRenderComponent(_component_EventCard, {
          key: ev.slug,
          event: { ...ev, view_type: "light" },
          class: "events-page__card opacity-90 hover:opacity-100 grayscale hover:grayscale-0 transition-all duration-500"
        }, null, _parent));
      });
      _push(`<!--]--></div>`);
      if (unref(filteredEvents).length === 0) {
        _push(`<p class="text-center text-stage-500 py-16 text-lg"> No past events found matching these criteria. </p>`);
      } else {
        _push(`<!---->`);
      }
      if (unref(totalPages) > 1) {
        _push(`<div class="events-page__pagination mt-12 flex justify-center items-center gap-2"><button${ssrIncludeBooleanAttr(unref(currentPage) === 1) ? " disabled" : ""} class="p-2 rounded-lg bg-stage-800 text-stage-400 disabled:opacity-30 hover:text-stage-100 transition-colors"><svg class="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 19l-7-7 7-7"></path></svg></button><div class="flex items-center gap-1"><!--[-->`);
        ssrRenderList(unref(totalPages), (p) => {
          _push(`<button class="${ssrRenderClass([unref(currentPage) === p ? "bg-brand-500 text-stage-950" : "bg-stage-800 text-stage-400 hover:bg-stage-700", "w-10 h-10 rounded-lg text-sm font-bold transition-all"])}">${ssrInterpolate(p)}</button>`);
        });
        _push(`<!--]--></div><button${ssrIncludeBooleanAttr(unref(currentPage) === unref(totalPages)) ? " disabled" : ""} class="p-2 rounded-lg bg-stage-800 text-stage-400 disabled:opacity-30 hover:text-stage-100 transition-colors"><svg class="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5l7 7-7 7"></path></svg></button></div>`);
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
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("pages/events/past.vue");
  return _sfc_setup ? _sfc_setup(props, ctx) : void 0;
};

export { _sfc_main as default };
//# sourceMappingURL=past-34xyvnNr.mjs.map
