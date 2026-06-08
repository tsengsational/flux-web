import { _ as __nuxt_component_0 } from './nuxt-link-cZpXnfBZ.mjs';
import { _ as __nuxt_component_1 } from './BlockRenderer-D_tsRLZz.mjs';
import { _ as __nuxt_component_2 } from './EventCard-XmG8E8E7.mjs';
import { _ as __nuxt_component_3 } from './BlogPostCard-DhE25oN6.mjs';
import { _ as __nuxt_component_2$1 } from './PersonCard-Bd3SjMa7.mjs';
import { defineComponent, withAsyncContext, computed, ref, watch, unref, mergeProps, withCtx, createVNode, createTextVNode, useSSRContext } from 'vue';
import { ssrRenderAttrs, ssrRenderComponent, ssrInterpolate, ssrRenderStyle, ssrRenderList, ssrIncludeBooleanAttr } from 'vue/server-renderer';
import { _ as _export_sfc, u as useRoute } from './server.mjs';
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
import 'date-fns-tz';
import './BaseModal-Bc4BSEMB.mjs';
import '../routes/renderer.mjs';
import 'vue-bundle-renderer/runtime';
import 'unhead/server';
import 'devalue';
import 'unhead/plugins';
import 'unhead/utils';
import 'vue-router';
import '@directus/sdk';

const pageSize = 16;
const _sfc_main = /* @__PURE__ */ defineComponent({
  __name: "[slug]",
  __ssrInlineRender: true,
  async setup(__props) {
    let __temp, __restore;
    const route = useRoute();
    const slug = route.params.slug;
    const { client, readItems, getImageProps } = useDirectus();
    const { data: groupData, error } = ([__temp, __restore] = withAsyncContext(() => useAsyncData(
      `group-${slug}`,
      () => client.request(readItems("groups", {
        filter: { slug: { _eq: slug }, status: { _eq: "published" } },
        fields: ["*", "tag_label", { tags: [{ tags_id: ["id", "name"] }] }],
        limit: 1
      }))
    )), __temp = await __temp, __restore(), __temp);
    const group = computed(() => groupData.value?.[0]);
    if (!group.value && !error.value) ;
    const tagIds = computed(() => {
      if (!group.value?.tags) return [];
      return group.value.tags.map((t) => t.tags_id?.id).filter(Boolean);
    });
    const currentPage = ref(1);
    const allDocuments = ref([]);
    const hasMore = ref(true);
    const isLoadingMore = ref(false);
    const fetchDocuments = async (page) => {
      const ids = tagIds.value;
      if (!ids || ids.length === 0) return [];
      const offset = (page - 1) * pageSize;
      const [events, posts, people] = await Promise.all([
        client.request(readItems("events", {
          filter: {
            status: { _eq: "published" },
            tags: { tags_id: { id: { _in: ids } } }
          },
          fields: ["*", { tags: [{ tags_id: ["name"] }] }, { venue: ["name"] }],
          limit: pageSize,
          offset
        })).catch(() => []),
        client.request(readItems("posts", {
          filter: {
            status: { _eq: "published" },
            tags: { tags_id: { id: { _in: ids } } }
          },
          fields: ["*", { tags: [{ tags_id: ["name"] }] }, { author: ["first_name", "last_name"] }],
          limit: pageSize,
          offset
        })).catch(() => []),
        client.request(readItems("people", {
          filter: {
            status: { _eq: "published" },
            tags: { tags_id: { id: { _in: ids } } }
          },
          fields: ["*", { tags: [{ tags_id: ["name"] }] }],
          limit: 24,
          offset: (page - 1) * 24
        })).catch(() => [])
      ]);
      const newItems = [
        ...events.map((e) => ({ type: "event", data: e })),
        ...posts.map((p) => ({ type: "post", data: p })),
        ...people.map((p) => ({ type: "person", data: p }))
      ];
      hasMore.value = events.length === pageSize || posts.length === pageSize || people.length === 24;
      return newItems;
    };
    const { data: initialDocs } = ([__temp, __restore] = withAsyncContext(async () => useAsyncData(`group-docs-${slug}`, async () => {
      return await fetchDocuments(1);
    }, { watch: [tagIds] })), __temp = await __temp, __restore(), __temp);
    if (initialDocs.value) {
      allDocuments.value = [...initialDocs.value];
    }
    watch(initialDocs, (newItems) => {
      if (newItems) {
        allDocuments.value = [...newItems];
        currentPage.value = 1;
      }
    });
    const sortedDocuments = computed(() => {
      if (!allDocuments.value) return [];
      return [...allDocuments.value].sort((a, b) => {
        const dateA = a.data.start_datetime || a.data.publish_date || a.data.date_created || "";
        const dateB = b.data.start_datetime || b.data.publish_date || b.data.date_created || "";
        return new Date(dateB).getTime() - new Date(dateA).getTime();
      });
    });
    useSeoMeta({
      title: () => `${group.value?.title || "Group"} — Flux Theatre Ensemble`,
      description: () => group.value?.subtitle || ""
    });
    return (_ctx, _push, _parent, _attrs) => {
      const _component_NuxtLink = __nuxt_component_0;
      const _component_BlockRenderer = __nuxt_component_1;
      const _component_EventCard = __nuxt_component_2;
      const _component_BlogPostCard = __nuxt_component_3;
      const _component_PersonCard = __nuxt_component_2$1;
      if (unref(group)) {
        _push(`<div${ssrRenderAttrs(mergeProps({ class: "group-page" }, _attrs))} data-v-1088b614><header class="group-page__hero relative h-[50vh] min-h-[400px] flex items-end pb-16 overflow-hidden" data-v-1088b614>`);
        if (unref(group).hero_image) {
          _push(`<img${ssrRenderAttrs(mergeProps(unref(getImageProps)(unref(group).hero_image, { sm: 800, md: 1200, lg: 1600 }, { quality: 85 }), {
            class: "absolute inset-0 w-full h-full object-cover",
            alt: ""
          }))} data-v-1088b614>`);
        } else {
          _push(`<div class="absolute inset-0 bg-gradient-to-br from-stage-900 to-stage-950" data-v-1088b614></div>`);
        }
        _push(`<div class="absolute inset-0 bg-gradient-to-t from-stage-950 via-stage-950/60 to-transparent" data-v-1088b614></div><div class="absolute inset-0 bg-stage-950/20" data-v-1088b614></div><div class="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full" data-v-1088b614>`);
        _push(ssrRenderComponent(_component_NuxtLink, {
          to: "/groups",
          class: "text-xs text-brand-400 hover:text-brand-300 transition-colors mb-6 inline-flex items-center gap-2 group/back"
        }, {
          default: withCtx((_, _push2, _parent2, _scopeId) => {
            if (_push2) {
              _push2(`<span class="group-hover/back:-translate-x-1 transition-transform" data-v-1088b614${_scopeId}>←</span> Back to Groups `);
            } else {
              return [
                createVNode("span", { class: "group-hover/back:-translate-x-1 transition-transform" }, "←"),
                createTextVNode(" Back to Groups ")
              ];
            }
          }),
          _: 1
        }, _parent));
        _push(`<div class="max-w-4xl" data-v-1088b614>`);
        if (unref(group).subtitle) {
          _push(`<p class="text-brand-400 font-medium text-lg mb-2 font-serif italic animate-fade-in" data-v-1088b614>${ssrInterpolate(unref(group).subtitle)}</p>`);
        } else {
          _push(`<!---->`);
        }
        _push(`<h1 class="text-4xl sm:text-5xl lg:text-7xl font-serif font-bold text-stage-50 leading-tight tracking-tight animate-slide-up" data-v-1088b614>${ssrInterpolate(unref(group).title)}</h1>`);
        if (unref(group).tags && unref(group).tags.length) {
          _push(`<div class="mt-8 flex flex-wrap gap-2 animate-slide-up" style="${ssrRenderStyle({ "animation-delay": "0.1s" })}" data-v-1088b614><!--[-->`);
          ssrRenderList(unref(group).tags, (tag) => {
            _push(`<span class="text-xs px-4 py-1.5 rounded-full bg-brand-500 text-stage-950 font-bold uppercase tracking-wider shadow-lg" data-v-1088b614>${ssrInterpolate(tag.tags_id?.name)}</span>`);
          });
          _push(`<!--]--></div>`);
        } else {
          _push(`<!---->`);
        }
        _push(`</div></div></header><section class="group-page__content py-24 bg-stage-950" data-v-1088b614><div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8" data-v-1088b614><div class="max-w-4xl mx-auto" data-v-1088b614><div class="prose prose-invert prose-lg max-w-none text-stage-100" data-v-1088b614>`);
        _push(ssrRenderComponent(_component_BlockRenderer, {
          content: unref(group).content
        }, null, _parent));
        _push(`</div></div></div></section><section class="group-page__documents py-24 bg-stage-900/20 border-t border-stage-800/40" id="related-content" data-v-1088b614><div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8" data-v-1088b614><div class="flex flex-col md:flex-row md:items-end justify-between mb-16 gap-4" data-v-1088b614><div data-v-1088b614><h2 class="text-3xl sm:text-4xl font-serif font-bold text-stage-50" data-v-1088b614>${ssrInterpolate(unref(group).tag_label || "Related Documents")}</h2><div class="h-1 w-20 bg-brand-500 mt-4 rounded-full" data-v-1088b614></div></div></div>`);
        if (unref(sortedDocuments).length > 0) {
          _push(`<div class="group-page__documents-grid-wrapper" data-v-1088b614><div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8" data-v-1088b614><!--[-->`);
          ssrRenderList(unref(sortedDocuments), (doc) => {
            _push(`<!--[-->`);
            if (doc.type === "event") {
              _push(ssrRenderComponent(_component_EventCard, {
                event: { ...doc.data, view_type: "dark" }
              }, null, _parent));
            } else if (doc.type === "post") {
              _push(ssrRenderComponent(_component_BlogPostCard, {
                post: doc.data,
                view_type: "dark"
              }, null, _parent));
            } else if (doc.type === "person") {
              _push(ssrRenderComponent(_component_PersonCard, {
                person: doc.data
              }, null, _parent));
            } else {
              _push(`<!---->`);
            }
            _push(`<!--]-->`);
          });
          _push(`<!--]--></div>`);
          if (unref(hasMore)) {
            _push(`<div class="mt-16 flex justify-center" data-v-1088b614><button class="btn-secondary group/more px-8 py-3 text-brand-500 flex items-center gap-3"${ssrIncludeBooleanAttr(unref(isLoadingMore)) ? " disabled" : ""} data-v-1088b614>`);
            if (unref(isLoadingMore)) {
              _push(`<span class="animate-spin h-4 w-4 border-2 text-brand-500 border-brand-500 border-t-transparent rounded-full" data-v-1088b614></span>`);
            } else {
              _push(`<!---->`);
            }
            _push(` ${ssrInterpolate(unref(isLoadingMore) ? "Loading..." : "Show More")} `);
            if (!unref(isLoadingMore)) {
              _push(`<svg class="w-4 h-4 transition-transform group-hover/more:translate-y-1" fill="none" viewBox="0 0 24 24" stroke="currentColor" data-v-1088b614><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 9l-7 7-7-7" data-v-1088b614></path></svg>`);
            } else {
              _push(`<!---->`);
            }
            _push(`</button></div>`);
          } else {
            _push(`<!---->`);
          }
          _push(`</div>`);
        } else {
          _push(`<div class="text-center py-32 card-glass rounded-3xl border border-dashed border-stage-800/60" data-v-1088b614><div class="max-w-xs mx-auto" data-v-1088b614><svg class="w-12 h-12 text-stage-700 mx-auto mb-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" data-v-1088b614><path stroke-linecap="round" stroke-linejoin="round" stroke-width="1" d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" data-v-1088b614></path></svg><p class="text-stage-500 font-medium italic" data-v-1088b614>No related documents have been tagged with this group&#39;s focus areas yet.</p></div></div>`);
        }
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
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("pages/groups/[slug].vue");
  return _sfc_setup ? _sfc_setup(props, ctx) : void 0;
};
const _slug_ = /* @__PURE__ */ _export_sfc(_sfc_main, [["__scopeId", "data-v-1088b614"]]);

export { _slug_ as default };
//# sourceMappingURL=_slug_-9FbdCYMO.mjs.map
