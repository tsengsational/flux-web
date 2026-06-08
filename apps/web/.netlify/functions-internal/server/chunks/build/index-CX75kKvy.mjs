import { _ as __nuxt_component_3 } from './BlogPostCard-DhE25oN6.mjs';
import { defineComponent, withAsyncContext, computed, ref, mergeProps, unref, useSSRContext } from 'vue';
import { ssrRenderAttrs, ssrRenderClass, ssrRenderList, ssrInterpolate, ssrRenderComponent } from 'vue/server-renderer';
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
      title: "News & Updates — Flux Theatre Ensemble",
      description: "The latest announcements, behind-the-scenes stories, and updates from Flux Theatre Ensemble."
    });
    const { client, readItems } = useDirectus();
    const { data: blogPosts, error } = ([__temp, __restore] = withAsyncContext(() => useAsyncData(
      "all-news",
      () => client.request(readItems("posts", {
        filter: { status: { _eq: "published" } },
        sort: ["-publish_date"],
        fields: ["*", { tags: [{ tags_id: ["name"] }] }]
      }))
    )), __temp = await __temp, __restore(), __temp);
    const allTags = computed(() => {
      const posts = blogPosts.value;
      if (!posts) return [];
      const tags = /* @__PURE__ */ new Set();
      posts.forEach((p) => {
        p.tags?.forEach((t) => {
          const tagName = t.tags_id?.name;
          if (tagName) tags.add(tagName);
        });
      });
      return Array.from(tags).sort();
    });
    const activeTag = ref(null);
    const filteredPosts = computed(() => {
      const posts = blogPosts.value;
      if (!posts) return [];
      if (!activeTag.value) return posts;
      return posts.filter(
        (p) => p.tags?.some((t) => t.tags_id?.name === activeTag.value)
      );
    });
    const featuredPost = computed(() => filteredPosts.value[0] || null);
    const remainingPosts = computed(() => filteredPosts.value.slice(1));
    return (_ctx, _push, _parent, _attrs) => {
      const _component_BlogPostCard = __nuxt_component_3;
      _push(`<div${ssrRenderAttrs(mergeProps({ class: "news-page" }, _attrs))}><section class="news-page__header pt-12 pb-6" id="news-header"><div class="news-page__header-container max-w-7xl mx-auto px-4 sm:px-6 lg:px-8"><p class="news-page__subtitle text-brand-400 font-medium text-sm uppercase tracking-[0.15em] mb-2">From the Company</p><h1 class="news-page__title section-heading">News &amp; Updates</h1><p class="news-page__description mt-4 text-stage-400 text-lg max-w-2xl"> Announcements, behind-the-scenes stories, interviews, and dispatches from the Flux ensemble. </p></div></section><section class="news-page__tags-section pb-8" id="news-tags"><div class="news-page__tags-container max-w-7xl mx-auto px-4 sm:px-6 lg:px-8"><div class="news-page__tags flex flex-wrap gap-2"><button class="${ssrRenderClass([!unref(activeTag) ? "bg-brand-500 text-stage-950" : "bg-stage-800/60 text-stage-400 hover:text-stage-200 border border-stage-700/40", "news-page__tag-btn px-3 py-1.5 rounded-full text-xs font-medium transition-all duration-200"])}"> All Posts </button><!--[-->`);
      ssrRenderList(unref(allTags), (tag) => {
        _push(`<button class="${ssrRenderClass([unref(activeTag) === tag ? "bg-brand-500 text-stage-950" : "bg-stage-800/60 text-stage-400 hover:text-stage-200 border border-stage-700/40", "news-page__tag-btn px-3 py-1.5 rounded-full text-xs font-medium transition-all duration-200"])}">${ssrInterpolate(tag)}</button>`);
      });
      _push(`<!--]--></div></div></section><section class="news-page__content-section pb-24" id="news-content"><div class="news-page__content-container max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">`);
      if (unref(featuredPost)) {
        _push(ssrRenderComponent(_component_BlogPostCard, {
          post: unref(featuredPost),
          featured: "",
          view_type: "light",
          class: "news-page__featured-post mb-8"
        }, null, _parent));
      } else {
        _push(`<!---->`);
      }
      _push(`<div class="news-page__grid grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"><!--[-->`);
      ssrRenderList(unref(remainingPosts), (post) => {
        _push(ssrRenderComponent(_component_BlogPostCard, {
          key: post.slug,
          post,
          view_type: "light",
          class: "news-page__card"
        }, null, _parent));
      });
      _push(`<!--]--></div>`);
      if (unref(filteredPosts).length > 4) {
        _push(`<div class="news-page__footer mt-12 text-center"><button class="news-page__load-more btn-secondary" id="load-more-posts"> Load More Posts </button></div>`);
      } else {
        _push(`<!---->`);
      }
      if (unref(filteredPosts).length === 0) {
        _push(`<p class="news-page__empty-text text-center text-stage-500 py-16 text-lg"> No posts match the selected tag. </p>`);
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
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("pages/news/index.vue");
  return _sfc_setup ? _sfc_setup(props, ctx) : void 0;
};

export { _sfc_main as default };
//# sourceMappingURL=index-CX75kKvy.mjs.map
