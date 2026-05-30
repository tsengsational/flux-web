import { _ as __nuxt_component_0$1 } from './nuxt-link-cZpXnfBZ.mjs';
import { defineComponent, withAsyncContext, computed, ref, mergeProps, unref, withCtx, createVNode, openBlock, createBlock, toDisplayString, createCommentVNode, Fragment, renderList, useSSRContext } from 'vue';
import { ssrRenderAttrs, ssrRenderClass, ssrRenderList, ssrInterpolate, ssrRenderComponent } from 'vue/server-renderer';
import { u as useDirectus, a as useAsyncData } from './asyncData-DO9zjVnq.mjs';
import { _ as _export_sfc } from './server.mjs';
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
  __name: "GroupCard",
  __ssrInlineRender: true,
  props: {
    group: {},
    view_type: { default: "light" }
  },
  setup(__props) {
    const { getImageProps } = useDirectus();
    return (_ctx, _push, _parent, _attrs) => {
      const _component_NuxtLink = __nuxt_component_0$1;
      _push(ssrRenderComponent(_component_NuxtLink, mergeProps({
        to: `/groups/${__props.group.slug}`,
        class: "group-card card-glass group block overflow-hidden h-full",
        id: `group-card-${__props.group.slug}`
      }, _attrs), {
        default: withCtx((_, _push2, _parent2, _scopeId) => {
          if (_push2) {
            _push2(`<div class="group-card__image-container relative aspect-[16/9] bg-stage-800 overflow-hidden" data-v-fce57006${_scopeId}>`);
            if (__props.group.hero_image) {
              _push2(`<img${ssrRenderAttrs(mergeProps(unref(getImageProps)(__props.group.hero_image, { sm: 400, md: 600 }), {
                alt: __props.group.title,
                class: "group-card__image w-full h-full object-cover transition-transform duration-500 group-hover:scale-105",
                loading: "lazy"
              }))} data-v-fce57006${_scopeId}>`);
            } else {
              _push2(`<div class="group-card__placeholder w-full h-full flex items-center justify-center bg-gradient-to-br from-stage-800 to-stage-900" data-v-fce57006${_scopeId}><svg class="group-card__placeholder-icon w-12 h-12 text-stage-700" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="1" data-v-fce57006${_scopeId}><path stroke-linecap="round" stroke-linejoin="round" d="M18 18.72a9.094 9.094 0 003.741-.479 3 3 0 00-4.682-2.72m.94 3.198l.001.031c0 .225-.012.447-.037.666A11.944 11.944 0 0112 21c-2.17 0-4.207-.576-5.963-1.584A6.062 6.062 0 016 18.719m12 0a5.971 5.971 0 00-.941-3.197m0 0A5.995 5.995 0 0012 12.75a5.995 5.995 0 00-5.058 2.772m0 0a5.97 5.97 0 00-.94 3.197M15 6.75a3 3 0 11-6 0 3 3 0 016 0zm6 3a2.25 2.25 0 11-4.5 0 2.25 2.25 0 014.5 0zm-13.5 0a2.25 2.25 0 11-4.5 0 2.25 2.25 0 014.5 0z" data-v-fce57006${_scopeId}></path></svg></div>`);
            }
            _push2(`<div class="absolute inset-0 bg-gradient-to-t from-stage-950/60 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" data-v-fce57006${_scopeId}></div></div><div class="group-card__content p-5 flex flex-col h-[calc(100%-aspect-ratio)]" data-v-fce57006${_scopeId}><h3 class="${ssrRenderClass([__props.view_type === "light" ? "text-stage-950" : "text-stage-50", "group-card__title text-xl font-serif font-bold group-hover:text-brand-400 transition-colors"])}" data-v-fce57006${_scopeId}>${ssrInterpolate(__props.group.title)}</h3>`);
            if (__props.group.subtitle) {
              _push2(`<p class="group-card__subtitle text-xs mt-1 font-semibold text-brand-500 uppercase tracking-widest" data-v-fce57006${_scopeId}>${ssrInterpolate(__props.group.subtitle)}</p>`);
            } else {
              _push2(`<!---->`);
            }
            if (__props.group.tags && __props.group.tags.length) {
              _push2(`<div class="group-card__tags mt-4 flex flex-wrap gap-1.5" data-v-fce57006${_scopeId}><!--[-->`);
              ssrRenderList(__props.group.tags, (tag) => {
                _push2(`<span class="${ssrRenderClass([__props.view_type === "light" ? "bg-stage-100 text-stage-600 border border-stage-200" : "bg-stage-800/80 text-stage-400 border border-stage-700/40", "group-card__tag text-[10px] px-2 py-0.5 rounded-full uppercase tracking-wider font-bold"])}" data-v-fce57006${_scopeId}>${ssrInterpolate(tag.tags_id?.name)}</span>`);
              });
              _push2(`<!--]--></div>`);
            } else {
              _push2(`<!---->`);
            }
            _push2(`<div class="mt-auto pt-6 flex items-center justify-end" data-v-fce57006${_scopeId}><span class="text-sm font-medium text-brand-400 group-hover:translate-x-1 transition-transform" data-v-fce57006${_scopeId}> Explore Group → </span></div></div>`);
          } else {
            return [
              createVNode("div", { class: "group-card__image-container relative aspect-[16/9] bg-stage-800 overflow-hidden" }, [
                __props.group.hero_image ? (openBlock(), createBlock("img", mergeProps({ key: 0 }, unref(getImageProps)(__props.group.hero_image, { sm: 400, md: 600 }), {
                  alt: __props.group.title,
                  class: "group-card__image w-full h-full object-cover transition-transform duration-500 group-hover:scale-105",
                  loading: "lazy"
                }), null, 16, ["alt"])) : (openBlock(), createBlock("div", {
                  key: 1,
                  class: "group-card__placeholder w-full h-full flex items-center justify-center bg-gradient-to-br from-stage-800 to-stage-900"
                }, [
                  (openBlock(), createBlock("svg", {
                    class: "group-card__placeholder-icon w-12 h-12 text-stage-700",
                    fill: "none",
                    viewBox: "0 0 24 24",
                    stroke: "currentColor",
                    "stroke-width": "1"
                  }, [
                    createVNode("path", {
                      "stroke-linecap": "round",
                      "stroke-linejoin": "round",
                      d: "M18 18.72a9.094 9.094 0 003.741-.479 3 3 0 00-4.682-2.72m.94 3.198l.001.031c0 .225-.012.447-.037.666A11.944 11.944 0 0112 21c-2.17 0-4.207-.576-5.963-1.584A6.062 6.062 0 016 18.719m12 0a5.971 5.971 0 00-.941-3.197m0 0A5.995 5.995 0 0012 12.75a5.995 5.995 0 00-5.058 2.772m0 0a5.97 5.97 0 00-.94 3.197M15 6.75a3 3 0 11-6 0 3 3 0 016 0zm6 3a2.25 2.25 0 11-4.5 0 2.25 2.25 0 014.5 0zm-13.5 0a2.25 2.25 0 11-4.5 0 2.25 2.25 0 014.5 0z"
                    })
                  ]))
                ])),
                createVNode("div", { class: "absolute inset-0 bg-gradient-to-t from-stage-950/60 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" })
              ]),
              createVNode("div", { class: "group-card__content p-5 flex flex-col h-[calc(100%-aspect-ratio)]" }, [
                createVNode("h3", {
                  class: ["group-card__title text-xl font-serif font-bold group-hover:text-brand-400 transition-colors", __props.view_type === "light" ? "text-stage-950" : "text-stage-50"]
                }, toDisplayString(__props.group.title), 3),
                __props.group.subtitle ? (openBlock(), createBlock("p", {
                  key: 0,
                  class: "group-card__subtitle text-xs mt-1 font-semibold text-brand-500 uppercase tracking-widest"
                }, toDisplayString(__props.group.subtitle), 1)) : createCommentVNode("", true),
                __props.group.tags && __props.group.tags.length ? (openBlock(), createBlock("div", {
                  key: 1,
                  class: "group-card__tags mt-4 flex flex-wrap gap-1.5"
                }, [
                  (openBlock(true), createBlock(Fragment, null, renderList(__props.group.tags, (tag) => {
                    return openBlock(), createBlock("span", {
                      key: tag.id,
                      class: ["group-card__tag text-[10px] px-2 py-0.5 rounded-full uppercase tracking-wider font-bold", __props.view_type === "light" ? "bg-stage-100 text-stage-600 border border-stage-200" : "bg-stage-800/80 text-stage-400 border border-stage-700/40"]
                    }, toDisplayString(tag.tags_id?.name), 3);
                  }), 128))
                ])) : createCommentVNode("", true),
                createVNode("div", { class: "mt-auto pt-6 flex items-center justify-end" }, [
                  createVNode("span", { class: "text-sm font-medium text-brand-400 group-hover:translate-x-1 transition-transform" }, " Explore Group → ")
                ])
              ])
            ];
          }
        }),
        _: 1
      }, _parent));
    };
  }
});
const _sfc_setup$1 = _sfc_main$1.setup;
_sfc_main$1.setup = (props, ctx) => {
  const ssrContext = useSSRContext();
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("components/GroupCard.vue");
  return _sfc_setup$1 ? _sfc_setup$1(props, ctx) : void 0;
};
const __nuxt_component_0 = /* @__PURE__ */ Object.assign(_export_sfc(_sfc_main$1, [["__scopeId", "data-v-fce57006"]]), { __name: "GroupCard" });
const _sfc_main = /* @__PURE__ */ defineComponent({
  __name: "index",
  __ssrInlineRender: true,
  async setup(__props) {
    let __temp, __restore;
    useSeoMeta({
      title: "Groups — Flux Theatre Ensemble",
      description: "Explore our artistic groups, collectives, and community initiatives."
    });
    const { client, readItems } = useDirectus();
    const { data: groups, error } = ([__temp, __restore] = withAsyncContext(() => useAsyncData(
      "all-groups",
      () => client.request(readItems("groups", {
        filter: { status: { _eq: "published" } },
        fields: ["*", { tags: [{ tags_id: ["name"] }] }]
      }))
    )), __temp = await __temp, __restore(), __temp);
    const allTags = computed(() => {
      const items = groups.value;
      if (!items) return [];
      const tags = /* @__PURE__ */ new Set();
      items.forEach((g) => {
        g.tags?.forEach((t) => {
          const tagName = t.tags_id?.name;
          if (tagName) tags.add(tagName);
        });
      });
      return Array.from(tags).sort();
    });
    const activeTag = ref(null);
    const filteredGroups = computed(() => {
      const items = groups.value;
      if (!items) return [];
      if (!activeTag.value) return items;
      return items.filter(
        (g) => g.tags?.some((t) => t.tags_id?.name === activeTag.value)
      );
    });
    return (_ctx, _push, _parent, _attrs) => {
      const _component_GroupCard = __nuxt_component_0;
      _push(`<div${ssrRenderAttrs(mergeProps({ class: "groups-page" }, _attrs))}><section class="groups-page__header pt-12 pb-6" id="groups-header"><div class="groups-page__header-container max-w-7xl mx-auto px-4 sm:px-6 lg:px-8"><p class="groups-page__subtitle text-brand-400 font-medium text-sm uppercase tracking-[0.15em] mb-2">Our Community</p><h1 class="groups-page__title section-heading">Groups &amp; Collectives</h1><p class="groups-page__description mt-4 text-stage-400 text-lg max-w-2xl"> Discover the various groups and artistic collectives that make up the Flux ecosystem. </p></div></section><section class="groups-page__tags-section pb-8" id="groups-tags"><div class="groups-page__tags-container max-w-7xl mx-auto px-4 sm:px-6 lg:px-8"><div class="groups-page__tags flex flex-wrap gap-2"><button class="${ssrRenderClass([!unref(activeTag) ? "bg-brand-500 text-stage-950" : "bg-stage-800/60 text-stage-400 hover:text-stage-200 border border-stage-700/40", "groups-page__tag-btn px-3 py-1.5 rounded-full text-xs font-medium transition-all duration-200"])}"> All Groups </button><!--[-->`);
      ssrRenderList(unref(allTags), (tag) => {
        _push(`<button class="${ssrRenderClass([unref(activeTag) === tag ? "bg-brand-500 text-stage-950" : "bg-stage-800/60 text-stage-400 hover:text-stage-200 border border-stage-700/40", "groups-page__tag-btn px-3 py-1.5 rounded-full text-xs font-medium transition-all duration-200"])}">${ssrInterpolate(tag)}</button>`);
      });
      _push(`<!--]--></div></div></section><section class="groups-page__content-section pb-24" id="groups-content"><div class="groups-page__content-container max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">`);
      if (unref(filteredGroups).length > 0) {
        _push(`<div class="groups-page__grid grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8"><!--[-->`);
        ssrRenderList(unref(filteredGroups), (group) => {
          _push(ssrRenderComponent(_component_GroupCard, {
            key: group.id,
            group,
            view_type: "light",
            class: "groups-page__card"
          }, null, _parent));
        });
        _push(`<!--]--></div>`);
      } else {
        _push(`<p class="groups-page__empty-text text-center text-stage-500 py-16 text-lg"> No groups match the selected tag. </p>`);
      }
      _push(`</div></section></div>`);
    };
  }
});
const _sfc_setup = _sfc_main.setup;
_sfc_main.setup = (props, ctx) => {
  const ssrContext = useSSRContext();
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("pages/groups/index.vue");
  return _sfc_setup ? _sfc_setup(props, ctx) : void 0;
};

export { _sfc_main as default };
//# sourceMappingURL=index-DX1c72J9.mjs.map
