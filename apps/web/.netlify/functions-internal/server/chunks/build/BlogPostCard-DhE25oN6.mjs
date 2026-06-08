import { _ as __nuxt_component_0 } from './nuxt-link-cZpXnfBZ.mjs';
import { defineComponent, computed, mergeProps, withCtx, unref, createTextVNode, toDisplayString, createVNode, openBlock, createBlock, createCommentVNode, Fragment, renderList, useSSRContext } from 'vue';
import { ssrRenderComponent, ssrRenderAttrs, ssrRenderClass, ssrInterpolate, ssrRenderList } from 'vue/server-renderer';
import { u as useDirectus } from './asyncData-BxKqmOFY.mjs';

const _sfc_main = /* @__PURE__ */ defineComponent({
  __name: "BlogPostCard",
  __ssrInlineRender: true,
  props: {
    post: {},
    featured: { type: Boolean, default: false },
    view_type: { default: "light" }
  },
  setup(__props) {
    const props = __props;
    const { getImageProps } = useDirectus();
    const formattedDate = computed(() => {
      return new Date(props.post.publish_date).toLocaleDateString("en-US", {
        month: "long",
        day: "numeric",
        year: "numeric"
      });
    });
    const authorName = computed(() => {
      const author = props.post.author;
      if (!author || typeof author === "string") return "Flux Theatre";
      return `${author.first_name} ${author.last_name}`;
    });
    return (_ctx, _push, _parent, _attrs) => {
      const _component_NuxtLink = __nuxt_component_0;
      if (__props.featured) {
        _push(ssrRenderComponent(_component_NuxtLink, mergeProps({
          to: `/news/${__props.post.slug}`,
          class: "blog-post-card blog-post-card--featured card-glass group grid grid-cols-1 lg:grid-cols-2 overflow-hidden",
          id: `blog-featured-${__props.post.slug}`
        }, _attrs), {
          default: withCtx((_, _push2, _parent2, _scopeId) => {
            if (_push2) {
              _push2(`<div class="blog-post-card__image-container relative aspect-video lg:aspect-auto lg:min-h-[320px] bg-stage-800 overflow-hidden"${_scopeId}>`);
              if (__props.post.cover_image_override || __props.post.cover_image) {
                _push2(`<img${ssrRenderAttrs(mergeProps(unref(getImageProps)(__props.post.cover_image_override || __props.post.cover_image, { sm: 800, md: 1e3, lg: 1200 }), {
                  alt: __props.post.title,
                  class: "blog-post-card__image w-full h-full object-cover transition-transform duration-500 group-hover:scale-105",
                  loading: "lazy"
                }))}${_scopeId}>`);
              } else {
                _push2(`<div class="blog-post-card__placeholder w-full h-full flex items-center justify-center bg-gradient-to-br from-stage-800 to-stage-900"${_scopeId}><svg class="blog-post-card__placeholder-icon w-16 h-16 text-stage-700" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="1"${_scopeId}><path stroke-linecap="round" stroke-linejoin="round" d="M12 7.5h1.5m-1.5 3h1.5m-7.5 3h7.5m-7.5 3h7.5m3-9h3.375c.621 0 1.125.504 1.125 1.125V18a2.25 2.25 0 01-2.25 2.25M16.5 7.5V18a2.25 2.25 0 002.25 2.25M16.5 7.5V4.875c0-.621-.504-1.125-1.125-1.125H4.125C3.504 3.75 3 4.254 3 4.875V18a2.25 2.25 0 002.25 2.25h13.5M6 7.5h3v3H6v-3z"${_scopeId}></path></svg></div>`);
              }
              _push2(`<div class="blog-post-card__overlay absolute inset-0 bg-gradient-to-r from-transparent to-stage-950/30 lg:bg-none"${_scopeId}></div></div><div class="blog-post-card__content p-6 lg:p-8 flex flex-col justify-center"${_scopeId}><div class="blog-post-card__meta flex items-center gap-3 mb-3"${_scopeId}><span class="${ssrRenderClass([__props.view_type === "light" ? "bg-brand-600 text-white" : "bg-brand-500/20 text-brand-300", "blog-post-card__badge px-2.5 py-1 rounded-full text-xs font-bold"])}"${_scopeId}> Featured </span><span class="${ssrRenderClass([__props.view_type === "light" ? "text-stage-600" : "text-stage-500", "blog-post-card__date text-xs"])}"${_scopeId}>${ssrInterpolate(unref(formattedDate))}</span></div><h2 class="${ssrRenderClass([__props.view_type === "light" ? "text-stage-950" : "text-stage-50", "blog-post-card__title text-2xl lg:text-3xl font-serif font-bold group-hover:text-brand-400 transition-colors leading-tight"])}"${_scopeId}>${ssrInterpolate(__props.post.title)}</h2>`);
              if (__props.post.excerpt) {
                _push2(`<p class="${ssrRenderClass([__props.view_type === "light" ? "text-stage-700" : "text-stage-400", "blog-post-card__excerpt mt-3 leading-relaxed line-clamp-3"])}"${_scopeId}>${ssrInterpolate(__props.post.excerpt)}</p>`);
              } else {
                _push2(`<!---->`);
              }
              _push2(`<div class="${ssrRenderClass([__props.view_type === "light" ? "text-stage-700" : "text-stage-500", "blog-post-card__footer mt-4 flex items-center justify-between"])}"${_scopeId}><span class="blog-post-card__author text-xs"${_scopeId}> By `);
              if (__props.post.author && typeof __props.post.author !== "string") {
                _push2(ssrRenderComponent(_component_NuxtLink, {
                  to: `/people/${__props.post.author.slug}`,
                  class: "hover:text-brand-400 transition-colors"
                }, {
                  default: withCtx((_2, _push3, _parent3, _scopeId2) => {
                    if (_push3) {
                      _push3(`${ssrInterpolate(unref(authorName))}`);
                    } else {
                      return [
                        createTextVNode(toDisplayString(unref(authorName)), 1)
                      ];
                    }
                  }),
                  _: 1
                }, _parent2, _scopeId));
              } else {
                _push2(`<span${_scopeId}>${ssrInterpolate(unref(authorName))}</span>`);
              }
              _push2(`</span><span class="blog-post-card__more text-sm text-brand-400 font-medium group-hover:translate-x-1 transition-transform"${_scopeId}> Read more → </span></div>`);
              if (__props.post.tags && __props.post.tags.length) {
                _push2(`<div class="blog-post-card__tags mt-4 flex flex-wrap gap-2"${_scopeId}><!--[-->`);
                ssrRenderList(__props.post.tags.slice(0, 3), (tag) => {
                  _push2(`<span class="${ssrRenderClass([__props.view_type === "light" ? "bg-stage-50 text-stage-700 border border-stage-200" : "bg-stage-800/80 text-stage-400 border border-stage-700/40", "blog-post-card__tag text-xs px-2 py-0.5 rounded-full"])}"${_scopeId}>${ssrInterpolate(tag.tags_id?.name)}</span>`);
                });
                _push2(`<!--]--></div>`);
              } else {
                _push2(`<!---->`);
              }
              _push2(`</div>`);
            } else {
              return [
                createVNode("div", { class: "blog-post-card__image-container relative aspect-video lg:aspect-auto lg:min-h-[320px] bg-stage-800 overflow-hidden" }, [
                  __props.post.cover_image_override || __props.post.cover_image ? (openBlock(), createBlock("img", mergeProps({ key: 0 }, unref(getImageProps)(__props.post.cover_image_override || __props.post.cover_image, { sm: 800, md: 1e3, lg: 1200 }), {
                    alt: __props.post.title,
                    class: "blog-post-card__image w-full h-full object-cover transition-transform duration-500 group-hover:scale-105",
                    loading: "lazy"
                  }), null, 16, ["alt"])) : (openBlock(), createBlock("div", {
                    key: 1,
                    class: "blog-post-card__placeholder w-full h-full flex items-center justify-center bg-gradient-to-br from-stage-800 to-stage-900"
                  }, [
                    (openBlock(), createBlock("svg", {
                      class: "blog-post-card__placeholder-icon w-16 h-16 text-stage-700",
                      fill: "none",
                      viewBox: "0 0 24 24",
                      stroke: "currentColor",
                      "stroke-width": "1"
                    }, [
                      createVNode("path", {
                        "stroke-linecap": "round",
                        "stroke-linejoin": "round",
                        d: "M12 7.5h1.5m-1.5 3h1.5m-7.5 3h7.5m-7.5 3h7.5m3-9h3.375c.621 0 1.125.504 1.125 1.125V18a2.25 2.25 0 01-2.25 2.25M16.5 7.5V18a2.25 2.25 0 002.25 2.25M16.5 7.5V4.875c0-.621-.504-1.125-1.125-1.125H4.125C3.504 3.75 3 4.254 3 4.875V18a2.25 2.25 0 002.25 2.25h13.5M6 7.5h3v3H6v-3z"
                      })
                    ]))
                  ])),
                  createVNode("div", { class: "blog-post-card__overlay absolute inset-0 bg-gradient-to-r from-transparent to-stage-950/30 lg:bg-none" })
                ]),
                createVNode("div", { class: "blog-post-card__content p-6 lg:p-8 flex flex-col justify-center" }, [
                  createVNode("div", { class: "blog-post-card__meta flex items-center gap-3 mb-3" }, [
                    createVNode("span", {
                      class: ["blog-post-card__badge px-2.5 py-1 rounded-full text-xs font-bold", __props.view_type === "light" ? "bg-brand-600 text-white" : "bg-brand-500/20 text-brand-300"]
                    }, " Featured ", 2),
                    createVNode("span", {
                      class: ["blog-post-card__date text-xs", __props.view_type === "light" ? "text-stage-600" : "text-stage-500"]
                    }, toDisplayString(unref(formattedDate)), 3)
                  ]),
                  createVNode("h2", {
                    class: ["blog-post-card__title text-2xl lg:text-3xl font-serif font-bold group-hover:text-brand-400 transition-colors leading-tight", __props.view_type === "light" ? "text-stage-950" : "text-stage-50"]
                  }, toDisplayString(__props.post.title), 3),
                  __props.post.excerpt ? (openBlock(), createBlock("p", {
                    key: 0,
                    class: ["blog-post-card__excerpt mt-3 leading-relaxed line-clamp-3", __props.view_type === "light" ? "text-stage-700" : "text-stage-400"]
                  }, toDisplayString(__props.post.excerpt), 3)) : createCommentVNode("", true),
                  createVNode("div", {
                    class: ["blog-post-card__footer mt-4 flex items-center justify-between", __props.view_type === "light" ? "text-stage-700" : "text-stage-500"]
                  }, [
                    createVNode("span", { class: "blog-post-card__author text-xs" }, [
                      createTextVNode(" By "),
                      __props.post.author && typeof __props.post.author !== "string" ? (openBlock(), createBlock(_component_NuxtLink, {
                        key: 0,
                        to: `/people/${__props.post.author.slug}`,
                        class: "hover:text-brand-400 transition-colors"
                      }, {
                        default: withCtx(() => [
                          createTextVNode(toDisplayString(unref(authorName)), 1)
                        ]),
                        _: 1
                      }, 8, ["to"])) : (openBlock(), createBlock("span", { key: 1 }, toDisplayString(unref(authorName)), 1))
                    ]),
                    createVNode("span", { class: "blog-post-card__more text-sm text-brand-400 font-medium group-hover:translate-x-1 transition-transform" }, " Read more → ")
                  ], 2),
                  __props.post.tags && __props.post.tags.length ? (openBlock(), createBlock("div", {
                    key: 1,
                    class: "blog-post-card__tags mt-4 flex flex-wrap gap-2"
                  }, [
                    (openBlock(true), createBlock(Fragment, null, renderList(__props.post.tags.slice(0, 3), (tag) => {
                      return openBlock(), createBlock("span", {
                        key: tag.id,
                        class: ["blog-post-card__tag text-xs px-2 py-0.5 rounded-full", __props.view_type === "light" ? "bg-stage-50 text-stage-700 border border-stage-200" : "bg-stage-800/80 text-stage-400 border border-stage-700/40"]
                      }, toDisplayString(tag.tags_id?.name), 3);
                    }), 128))
                  ])) : createCommentVNode("", true)
                ])
              ];
            }
          }),
          _: 1
        }, _parent));
      } else {
        _push(ssrRenderComponent(_component_NuxtLink, mergeProps({
          to: `/news/${__props.post.slug}`,
          class: "blog-post-card card-glass group block",
          id: `blog-card-${__props.post.slug}`
        }, _attrs), {
          default: withCtx((_, _push2, _parent2, _scopeId) => {
            if (_push2) {
              _push2(`<div class="blog-post-card__image-container relative aspect-video bg-stage-800 overflow-hidden"${_scopeId}>`);
              if (__props.post.cover_image_override || __props.post.cover_image) {
                _push2(`<img${ssrRenderAttrs(mergeProps(unref(getImageProps)(__props.post.cover_image_override || __props.post.cover_image, { sm: 600, md: 800 }), {
                  alt: __props.post.title,
                  class: "blog-post-card__image w-full h-full object-cover transition-transform duration-500 group-hover:scale-105",
                  loading: "lazy"
                }))}${_scopeId}>`);
              } else {
                _push2(`<div class="blog-post-card__placeholder w-full h-full flex items-center justify-center bg-gradient-to-br from-stage-800 to-stage-900"${_scopeId}><svg class="blog-post-card__placeholder-icon w-12 h-12 text-stage-700" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="1"${_scopeId}><path stroke-linecap="round" stroke-linejoin="round" d="M12 7.5h1.5m-1.5 3h1.5m-7.5 3h7.5m-7.5 3h7.5m3-9h3.375c.621 0 1.125.504 1.125 1.125V18a2.25 2.25 0 01-2.25 2.25M16.5 7.5V18a2.25 2.25 0 002.25 2.25M16.5 7.5V4.875c0-.621-.504-1.125-1.125-1.125H4.125C3.504 3.75 3 4.254 3 4.875V18a2.25 2.25 0 002.25 2.25h13.5M6 7.5h3v3H6v-3z"${_scopeId}></path></svg></div>`);
              }
              _push2(`<div class="blog-post-card__badge-container absolute top-3 left-3"${_scopeId}><span class="${ssrRenderClass([__props.view_type === "light" ? "bg-stage-100/90 text-stage-800" : "bg-stage-950/80 text-stage-200", "blog-post-card__badge px-2.5 py-1 rounded-full text-xs font-semibold backdrop-blur-sm"])}"${_scopeId}>${ssrInterpolate(unref(formattedDate))}</span></div></div><div class="blog-post-card__content p-5"${_scopeId}><h3 class="${ssrRenderClass([__props.view_type === "light" ? "text-stage-950" : "text-stage-50", "blog-post-card__title text-lg font-serif font-bold group-hover:text-brand-400 transition-colors line-clamp-2"])}"${_scopeId}>${ssrInterpolate(__props.post.title)}</h3>`);
              if (__props.post.excerpt) {
                _push2(`<p class="${ssrRenderClass([__props.view_type === "light" ? "text-stage-700" : "text-stage-400", "blog-post-card__excerpt text-sm mt-2 leading-relaxed line-clamp-3"])}"${_scopeId}>${ssrInterpolate(__props.post.excerpt)}</p>`);
              } else {
                _push2(`<!---->`);
              }
              _push2(`<div class="${ssrRenderClass([__props.view_type === "light" ? "text-stage-700" : "text-stage-500", "blog-post-card__footer mt-4 flex items-center justify-between"])}"${_scopeId}><span class="blog-post-card__author text-xs"${_scopeId}> By `);
              if (__props.post.author && typeof __props.post.author !== "string") {
                _push2(ssrRenderComponent(_component_NuxtLink, {
                  to: `/people/${__props.post.author.slug}`,
                  class: "hover:text-brand-400 transition-colors"
                }, {
                  default: withCtx((_2, _push3, _parent3, _scopeId2) => {
                    if (_push3) {
                      _push3(`${ssrInterpolate(unref(authorName))}`);
                    } else {
                      return [
                        createTextVNode(toDisplayString(unref(authorName)), 1)
                      ];
                    }
                  }),
                  _: 1
                }, _parent2, _scopeId));
              } else {
                _push2(`<span${_scopeId}>${ssrInterpolate(unref(authorName))}</span>`);
              }
              _push2(`</span><span class="blog-post-card__more text-sm text-brand-400 font-medium group-hover:translate-x-1 transition-transform"${_scopeId}> Read → </span></div>`);
              if (__props.post.tags && __props.post.tags.length) {
                _push2(`<div class="blog-post-card__tags mt-3 flex flex-wrap gap-1.5"${_scopeId}><!--[-->`);
                ssrRenderList(__props.post.tags.slice(0, 3), (tag) => {
                  _push2(`<span class="${ssrRenderClass([__props.view_type === "light" ? "bg-stage-50 text-stage-700 border border-stage-200" : "bg-stage-800/80 text-stage-400 border border-stage-700/40", "blog-post-card__tag text-xs px-2 py-0.5 rounded-full"])}"${_scopeId}>${ssrInterpolate(tag.tags_id?.name)}</span>`);
                });
                _push2(`<!--]--></div>`);
              } else {
                _push2(`<!---->`);
              }
              _push2(`</div>`);
            } else {
              return [
                createVNode("div", { class: "blog-post-card__image-container relative aspect-video bg-stage-800 overflow-hidden" }, [
                  __props.post.cover_image_override || __props.post.cover_image ? (openBlock(), createBlock("img", mergeProps({ key: 0 }, unref(getImageProps)(__props.post.cover_image_override || __props.post.cover_image, { sm: 600, md: 800 }), {
                    alt: __props.post.title,
                    class: "blog-post-card__image w-full h-full object-cover transition-transform duration-500 group-hover:scale-105",
                    loading: "lazy"
                  }), null, 16, ["alt"])) : (openBlock(), createBlock("div", {
                    key: 1,
                    class: "blog-post-card__placeholder w-full h-full flex items-center justify-center bg-gradient-to-br from-stage-800 to-stage-900"
                  }, [
                    (openBlock(), createBlock("svg", {
                      class: "blog-post-card__placeholder-icon w-12 h-12 text-stage-700",
                      fill: "none",
                      viewBox: "0 0 24 24",
                      stroke: "currentColor",
                      "stroke-width": "1"
                    }, [
                      createVNode("path", {
                        "stroke-linecap": "round",
                        "stroke-linejoin": "round",
                        d: "M12 7.5h1.5m-1.5 3h1.5m-7.5 3h7.5m-7.5 3h7.5m3-9h3.375c.621 0 1.125.504 1.125 1.125V18a2.25 2.25 0 01-2.25 2.25M16.5 7.5V18a2.25 2.25 0 002.25 2.25M16.5 7.5V4.875c0-.621-.504-1.125-1.125-1.125H4.125C3.504 3.75 3 4.254 3 4.875V18a2.25 2.25 0 002.25 2.25h13.5M6 7.5h3v3H6v-3z"
                      })
                    ]))
                  ])),
                  createVNode("div", { class: "blog-post-card__badge-container absolute top-3 left-3" }, [
                    createVNode("span", {
                      class: ["blog-post-card__badge px-2.5 py-1 rounded-full text-xs font-semibold backdrop-blur-sm", __props.view_type === "light" ? "bg-stage-100/90 text-stage-800" : "bg-stage-950/80 text-stage-200"]
                    }, toDisplayString(unref(formattedDate)), 3)
                  ])
                ]),
                createVNode("div", { class: "blog-post-card__content p-5" }, [
                  createVNode("h3", {
                    class: ["blog-post-card__title text-lg font-serif font-bold group-hover:text-brand-400 transition-colors line-clamp-2", __props.view_type === "light" ? "text-stage-950" : "text-stage-50"]
                  }, toDisplayString(__props.post.title), 3),
                  __props.post.excerpt ? (openBlock(), createBlock("p", {
                    key: 0,
                    class: ["blog-post-card__excerpt text-sm mt-2 leading-relaxed line-clamp-3", __props.view_type === "light" ? "text-stage-700" : "text-stage-400"]
                  }, toDisplayString(__props.post.excerpt), 3)) : createCommentVNode("", true),
                  createVNode("div", {
                    class: ["blog-post-card__footer mt-4 flex items-center justify-between", __props.view_type === "light" ? "text-stage-700" : "text-stage-500"]
                  }, [
                    createVNode("span", { class: "blog-post-card__author text-xs" }, [
                      createTextVNode(" By "),
                      __props.post.author && typeof __props.post.author !== "string" ? (openBlock(), createBlock(_component_NuxtLink, {
                        key: 0,
                        to: `/people/${__props.post.author.slug}`,
                        class: "hover:text-brand-400 transition-colors"
                      }, {
                        default: withCtx(() => [
                          createTextVNode(toDisplayString(unref(authorName)), 1)
                        ]),
                        _: 1
                      }, 8, ["to"])) : (openBlock(), createBlock("span", { key: 1 }, toDisplayString(unref(authorName)), 1))
                    ]),
                    createVNode("span", { class: "blog-post-card__more text-sm text-brand-400 font-medium group-hover:translate-x-1 transition-transform" }, " Read → ")
                  ], 2),
                  __props.post.tags && __props.post.tags.length ? (openBlock(), createBlock("div", {
                    key: 1,
                    class: "blog-post-card__tags mt-3 flex flex-wrap gap-1.5"
                  }, [
                    (openBlock(true), createBlock(Fragment, null, renderList(__props.post.tags.slice(0, 3), (tag) => {
                      return openBlock(), createBlock("span", {
                        key: tag.id,
                        class: ["blog-post-card__tag text-xs px-2 py-0.5 rounded-full", __props.view_type === "light" ? "bg-stage-50 text-stage-700 border border-stage-200" : "bg-stage-800/80 text-stage-400 border border-stage-700/40"]
                      }, toDisplayString(tag.tags_id?.name), 3);
                    }), 128))
                  ])) : createCommentVNode("", true)
                ])
              ];
            }
          }),
          _: 1
        }, _parent));
      }
    };
  }
});
const _sfc_setup = _sfc_main.setup;
_sfc_main.setup = (props, ctx) => {
  const ssrContext = useSSRContext();
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("components/BlogPostCard.vue");
  return _sfc_setup ? _sfc_setup(props, ctx) : void 0;
};
const __nuxt_component_3 = Object.assign(_sfc_main, { __name: "BlogPostCard" });

export { __nuxt_component_3 as _ };
//# sourceMappingURL=BlogPostCard-DhE25oN6.mjs.map
