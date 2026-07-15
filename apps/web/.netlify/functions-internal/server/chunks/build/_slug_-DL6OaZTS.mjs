import { _ as __nuxt_component_0 } from './nuxt-link-cZpXnfBZ.mjs';
import { _ as __nuxt_component_1 } from './BlockRenderer-CUz7VsbB.mjs';
import { _ as __nuxt_component_3 } from './MediaGallery-DVHH1GxR.mjs';
import { defineComponent, withAsyncContext, computed, mergeProps, unref, withCtx, createTextVNode, useSSRContext } from 'vue';
import { ssrRenderAttrs, ssrRenderComponent, ssrInterpolate, ssrRenderList } from 'vue/server-renderer';
import { u as useRoute, c as createError } from './server.mjs';
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
    const { data: posts, error } = ([__temp, __restore] = withAsyncContext(() => useAsyncData(
      `post-${slug}`,
      () => client.request(readItems("posts", {
        filter: { slug: { _eq: slug }, status: { _eq: "published" } },
        fields: [
          "*",
          {
            author: ["first_name", "last_name", "bio"],
            tags: [{ tags_id: ["name"] }],
            gallery: [{ directus_files_id: ["id"] }]
          },
          "content"
        ],
        limit: 1
      }))
    )), __temp = await __temp, __restore(), __temp);
    const post = computed(() => posts.value?.[0] || null);
    if (!post.value && !error.value) {
      throw createError({ statusCode: 404, statusMessage: "Post not found" });
    }
    useSeoMeta({
      title: () => `${post.value?.title || "News"} — Flux Theatre Ensemble`,
      description: () => post.value?.excerpt || ""
    });
    const formattedDate = computed(() => {
      if (!post.value?.publish_date) return "";
      return new Date(post.value.publish_date).toLocaleDateString("en-US", {
        weekday: "long",
        month: "long",
        day: "numeric",
        year: "numeric"
      });
    });
    const authorName = computed(() => {
      const author = post.value?.author;
      if (!author || typeof author === "string") return "Flux Theatre Ensemble";
      return `${author.first_name} ${author.last_name}`;
    });
    const authorInitials = computed(() => {
      const author = post.value?.author;
      if (!author || typeof author === "string") return "F";
      return `${author.first_name[0]}${author.last_name[0]}`;
    });
    const postTags = computed(() => {
      if (!post.value?.tags) return [];
      return post.value.tags.map((t) => t.tags_id?.name).filter(Boolean);
    });
    const galleryIds = computed(() => {
      const rawGallery = post.value?.gallery;
      if (!rawGallery || !Array.isArray(rawGallery)) return [];
      return rawGallery.map((item) => {
        const id = item.directus_files_id?.id || item.directus_files_id;
        return typeof id === "string" ? id : null;
      }).filter(Boolean);
    });
    return (_ctx, _push, _parent, _attrs) => {
      const _component_NuxtLink = __nuxt_component_0;
      const _component_BlockRenderer = __nuxt_component_1;
      const _component_MediaGallery = __nuxt_component_3;
      _push(`<article${ssrRenderAttrs(mergeProps({ class: "news-post pb-24" }, _attrs))}>`);
      if (unref(post)) {
        _push(`<div class="news-post__hero relative h-64 sm:h-80 lg:h-96 bg-stage-900 overflow-hidden" id="post-hero">`);
        if (unref(post).cover_image_override || unref(post).cover_image) {
          _push(`<img${ssrRenderAttrs(mergeProps(unref(getImageProps)(unref(post).cover_image_override || unref(post).cover_image, { sm: 800, md: 1200, lg: 1600 }, { quality: 85 }), {
            alt: unref(post).title,
            class: "news-post__hero-image w-full h-full object-cover object-center"
          }))}>`);
        } else {
          _push(`<div class="news-post__hero-placeholder w-full h-full bg-gradient-to-br from-curtain-700/20 via-stage-900 to-brand-900/10"></div>`);
        }
        _push(`<div class="news-post__hero-gradient absolute inset-0 bg-gradient-to-t from-stage-950 via-stage-950/50 to-transparent"></div></div>`);
      } else {
        _push(`<!---->`);
      }
      if (unref(post)) {
        _push(`<div class="news-post__container max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 -mt-36 relative z-10"><div class="news-post__meta flex flex-wrap items-center gap-3 mb-4">`);
        _push(ssrRenderComponent(_component_NuxtLink, {
          to: "/news",
          class: "news-post__back-link text-xs text-stage-400 hover:text-brand-400 transition-colors"
        }, {
          default: withCtx((_, _push2, _parent2, _scopeId) => {
            if (_push2) {
              _push2(` ← All News `);
            } else {
              return [
                createTextVNode(" ← All News ")
              ];
            }
          }),
          _: 1
        }, _parent));
        _push(`<span class="news-post__meta-divider w-px h-3 bg-stage-700"></span><span class="news-post__date text-xs text-stage-500">${ssrInterpolate(unref(formattedDate))}</span></div><h1 class="news-post__title text-3xl sm:text-4xl lg:text-5xl font-serif font-bold text-stage-50 leading-tight tracking-tight">${ssrInterpolate(unref(post).title)}</h1><div class="news-post__author mt-6 flex items-center gap-3 pb-8 border-b border-stage-800/60"><div class="news-post__author-avatar w-10 h-10 rounded-full bg-gradient-to-br from-brand-400 to-brand-600 flex items-center justify-center flex-shrink-0"><span class="news-post__author-initials text-stage-950 font-sans text-sm font-bold">${ssrInterpolate(unref(authorInitials))}</span></div><div class="news-post__author-info"><p class="news-post__author-name text-sm font-medium text-stage-200">${ssrInterpolate(unref(authorName))}</p>`);
        if (typeof unref(post).author !== "string" && unref(post).author?.bio) {
          _push(`<p class="news-post__author-bio text-xs text-stage-500 line-clamp-1">${ssrInterpolate(unref(post).author.bio)}</p>`);
        } else {
          _push(`<!---->`);
        }
        _push(`</div></div>`);
        if (unref(postTags).length) {
          _push(`<div class="news-post__tags mt-6 flex flex-wrap gap-2"><!--[-->`);
          ssrRenderList(unref(postTags), (tag) => {
            _push(`<span class="news-post__tag text-xs px-2.5 py-1 rounded-full bg-stage-800/80 text-stage-400 border border-stage-700/40">${ssrInterpolate(tag)}</span>`);
          });
          _push(`<!--]--></div>`);
        } else {
          _push(`<!---->`);
        }
        _push(`<div class="news-post__body mt-8" id="post-body">`);
        _push(ssrRenderComponent(_component_BlockRenderer, {
          content: unref(post).content || unref(post).body
        }, null, _parent));
        _push(`</div>`);
        if (unref(galleryIds).length > 0) {
          _push(`<div class="news-post__gallery mt-16" id="post-gallery">`);
          _push(ssrRenderComponent(_component_MediaGallery, {
            images: unref(galleryIds),
            title: "Gallery"
          }, null, _parent));
          _push(`</div>`);
        } else {
          _push(`<!---->`);
        }
        _push(`<div class="news-post__footer mt-12 pt-8 border-t border-stage-800/60 flex items-center justify-between">`);
        _push(ssrRenderComponent(_component_NuxtLink, {
          to: "/news",
          class: "news-post__back-btn btn-secondary text-sm",
          id: "back-to-news"
        }, {
          default: withCtx((_, _push2, _parent2, _scopeId) => {
            if (_push2) {
              _push2(` ← Back to News `);
            } else {
              return [
                createTextVNode(" ← Back to News ")
              ];
            }
          }),
          _: 1
        }, _parent));
        _push(`<div class="news-post__share flex gap-2 text-stage-500 text-xs"><span class="news-post__share-label">Share:</span><a href="#" class="news-post__share-link hover:text-brand-400 transition-colors">Twitter</a><span class="news-post__share-divider">·</span><a href="#" class="news-post__share-link hover:text-brand-400 transition-colors">Facebook</a></div></div></div>`);
      } else {
        _push(`<!---->`);
      }
      _push(`</article>`);
    };
  }
});
const _sfc_setup = _sfc_main.setup;
_sfc_main.setup = (props, ctx) => {
  const ssrContext = useSSRContext();
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("pages/news/[slug].vue");
  return _sfc_setup ? _sfc_setup(props, ctx) : void 0;
};

export { _sfc_main as default };
//# sourceMappingURL=_slug_-DL6OaZTS.mjs.map
