import { _ as __nuxt_component_1 } from './BlockRenderer-D_tsRLZz.mjs';
import { _ as __nuxt_component_2 } from './PersonCard-Bd3SjMa7.mjs';
import { _ as __nuxt_component_3 } from './MediaGallery-DVHH1GxR.mjs';
import { _ as __nuxt_component_0 } from './nuxt-link-cZpXnfBZ.mjs';
import { defineComponent, withAsyncContext, computed, unref, mergeProps, withCtx, createVNode, openBlock, createBlock, toDisplayString, useSSRContext } from 'vue';
import { ssrRenderAttrs, ssrInterpolate, ssrRenderComponent, ssrRenderList } from 'vue/server-renderer';
import { _ as _export_sfc, u as useRoute, c as createError } from './server.mjs';
import { u as useDirectus, a as useAsyncData } from './asyncData-BxKqmOFY.mjs';
import { a as useHead } from './composables-DOi4jpYZ.mjs';
import './BaseModal-Bc4BSEMB.mjs';
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
  __name: "[...slug]",
  __ssrInlineRender: true,
  async setup(__props) {
    let __temp, __restore;
    const route = useRoute();
    const { client, readItems } = useDirectus();
    const slugParam = route.params.slug;
    const slug = Array.isArray(slugParam) ? slugParam.join("/") : slugParam;
    const { data: pages, error } = ([__temp, __restore] = withAsyncContext(async () => useAsyncData(`page-${slug}`, async () => {
      const result = await client.request(readItems("pages", {
        filter: { slug: { _eq: slug }, status: { _eq: "published" } },
        fields: [
          "*",
          "content",
          {
            funders: ["*", { funder_id: ["name", "slug", "image", "url"] }],
            gallery: [{ directus_files_id: ["id"] }],
            people: ["sort", { people_id: ["first_name", "last_name", "slug", "headshot", "bio", "pronouns"] }]
          }
        ],
        limit: 1
      }));
      return result;
    })), __temp = await __temp, __restore(), __temp);
    const page = computed(() => pages.value?.[0] || null);
    if (!page.value && !error.value) {
      const isSystemFile = slug.includes(".") || slug.includes("_nuxt");
      if (!isSystemFile) {
        throw createError({ statusCode: 404, statusMessage: `Page "${slug}" not found in Directus`, fatal: true });
      }
    }
    const { getImageProps } = useDirectus();
    const people = computed(() => {
      return (page.value?.people || []).filter((p) => p && typeof p.people_id !== "string").sort((a, b) => (a.sort || 0) - (b.sort || 0)).map((p) => p.people_id);
    });
    const funders = computed(() => {
      return (page.value?.funders || []).map((f) => f.funder_id).filter(Boolean);
    });
    const galleryIds = computed(() => {
      const rawGallery = page.value?.gallery;
      if (!rawGallery || !Array.isArray(rawGallery)) return [];
      return rawGallery.map((item) => {
        const id = item.directus_files_id?.id || item.directus_files_id;
        return typeof id === "string" ? id : null;
      }).filter(Boolean);
    });
    useHead({
      title: page.value?.meta_title || page.value?.title || "Page",
      meta: [
        { name: "description", content: page.value?.meta_description || "" }
      ]
    });
    return (_ctx, _push, _parent, _attrs) => {
      const _component_BlockRenderer = __nuxt_component_1;
      const _component_PersonCard = __nuxt_component_2;
      const _component_MediaGallery = __nuxt_component_3;
      const _component_NuxtLink = __nuxt_component_0;
      if (unref(page)) {
        _push(`<main${ssrRenderAttrs(mergeProps({ class: "page-detail prose-custom py-16 sm:py-24" }, _attrs))} data-v-fded5036><div class="page-detail__container max-w-4xl mx-auto px-4 sm:px-6 lg:px-8" data-v-fded5036><h1 class="page-detail__title text-4xl sm:text-5xl font-serif font-bold text-stage-950 mb-12" data-v-fded5036>${ssrInterpolate(unref(page).title)}</h1><div class="page-detail__content" data-v-fded5036>`);
        _push(ssrRenderComponent(_component_BlockRenderer, {
          content: unref(page).content || unref(page).body
        }, null, _parent));
        _push(`</div>`);
        if (unref(people).length) {
          _push(`<section class="page-detail__people mt-24 pt-12 border-t border-stage-200" data-v-fded5036><h2 class="text-xl font-serif font-bold text-stage-950 mb-8 text-center uppercase tracking-widest" data-v-fded5036>${ssrInterpolate(unref(page).people_label || "People")}</h2><div class="grid grid-cols-2 sm:grid-cols-3 gap-6" data-v-fded5036><!--[-->`);
          ssrRenderList(unref(people), (person) => {
            _push(ssrRenderComponent(_component_PersonCard, {
              key: person.slug,
              person,
              compact: ""
            }, null, _parent));
          });
          _push(`<!--]--></div></section>`);
        } else {
          _push(`<!---->`);
        }
        if (unref(galleryIds).length > 0) {
          _push(`<div class="page-detail__gallery mt-24" data-v-fded5036>`);
          _push(ssrRenderComponent(_component_MediaGallery, {
            images: unref(galleryIds),
            title: "Gallery",
            viewtype: "light"
          }, null, _parent));
          _push(`</div>`);
        } else {
          _push(`<!---->`);
        }
        if (unref(funders).length) {
          _push(`<div class="page-detail__funders mt-24 pt-12 border-t border-stage-200" data-v-fded5036><h2 class="text-xl font-serif font-bold text-stage-950 mb-8 text-center uppercase tracking-widest" data-v-fded5036>Supported By</h2><div class="flex flex-wrap items-center justify-center gap-10" data-v-fded5036><!--[-->`);
          ssrRenderList(unref(funders), (funder) => {
            _push(ssrRenderComponent(_component_NuxtLink, {
              key: funder.slug,
              to: `/funders/${funder.slug}`,
              class: "group flex flex-col items-center gap-3 transition-transform hover:scale-105"
            }, {
              default: withCtx((_, _push2, _parent2, _scopeId) => {
                if (_push2) {
                  _push2(`<div class="w-24 h-24 bg-white rounded-lg shadow-md p-4 flex items-center justify-center overflow-hidden border border-stage-200 group-hover:border-brand-500/30 transition-colors" data-v-fded5036${_scopeId}>`);
                  if (funder.image) {
                    _push2(`<img${ssrRenderAttrs(mergeProps({ ref_for: true }, unref(getImageProps)(funder.image, { sm: 240 }, { quality: 80 }), {
                      alt: funder.name,
                      class: "w-full h-full object-contain grayscale group-hover:grayscale-0 transition-all duration-500"
                    }))} data-v-fded5036${_scopeId}>`);
                  } else {
                    _push2(`<span class="text-stage-900 font-serif font-bold text-sm text-center" data-v-fded5036${_scopeId}>${ssrInterpolate(funder.name)}</span>`);
                  }
                  _push2(`</div>`);
                } else {
                  return [
                    createVNode("div", { class: "w-24 h-24 bg-white rounded-lg shadow-md p-4 flex items-center justify-center overflow-hidden border border-stage-200 group-hover:border-brand-500/30 transition-colors" }, [
                      funder.image ? (openBlock(), createBlock("img", mergeProps({
                        key: 0,
                        ref_for: true
                      }, unref(getImageProps)(funder.image, { sm: 240 }, { quality: 80 }), {
                        alt: funder.name,
                        class: "w-full h-full object-contain grayscale group-hover:grayscale-0 transition-all duration-500"
                      }), null, 16, ["alt"])) : (openBlock(), createBlock("span", {
                        key: 1,
                        class: "text-stage-900 font-serif font-bold text-sm text-center"
                      }, toDisplayString(funder.name), 1))
                    ])
                  ];
                }
              }),
              _: 2
            }, _parent));
          });
          _push(`<!--]--></div></div>`);
        } else {
          _push(`<!---->`);
        }
        _push(`</div></main>`);
      } else {
        _push(`<!---->`);
      }
    };
  }
});
const _sfc_setup = _sfc_main.setup;
_sfc_main.setup = (props, ctx) => {
  const ssrContext = useSSRContext();
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("pages/[...slug].vue");
  return _sfc_setup ? _sfc_setup(props, ctx) : void 0;
};
const ____slug_ = /* @__PURE__ */ _export_sfc(_sfc_main, [["__scopeId", "data-v-fded5036"]]);

export { ____slug_ as default };
//# sourceMappingURL=_...slug_-B6ZUVXyW.mjs.map
