import { defineComponent, computed, mergeProps, unref, createVNode, resolveDynamicComponent, withCtx, openBlock, createBlock, Fragment, renderList, createCommentVNode, useSSRContext } from 'vue';
import { ssrRenderAttrs, ssrRenderList, ssrRenderVNode, ssrRenderComponent, ssrInterpolate, ssrGetDirectiveProps, ssrRenderAttr } from 'vue/server-renderer';
import { _ as _export_sfc } from './server.mjs';
import { u as useDirectus } from './asyncData-DO9zjVnq.mjs';
import { a as useHead } from './composables-DOi4jpYZ.mjs';

const _sfc_main$1 = /* @__PURE__ */ defineComponent({
  __name: "NestedList",
  __ssrInlineRender: true,
  props: {
    items: {},
    listStyle: {}
  },
  setup(__props) {
    return (_ctx, _push, _parent, _attrs) => {
      const _component_NestedList = __nuxt_component_0;
      ssrRenderVNode(_push, createVNode(resolveDynamicComponent(__props.listStyle === "ordered" ? "ol" : "ul"), mergeProps({
        class: [
          __props.listStyle === "ordered" ? "list-decimal" : "list-disc",
          "space-y-2 ml-4 mb-4 text-lg leading-relaxed"
        ]
      }, _attrs), {
        default: withCtx((_, _push2, _parent2, _scopeId) => {
          if (_push2) {
            _push2(`<!--[-->`);
            ssrRenderList(__props.items, (item, index) => {
              _push2(`<li class="marker:text-brand-500" data-v-d5985fb7${_scopeId}><span data-v-d5985fb7${_scopeId}>${item.content ?? ""}</span>`);
              if (item.items && item.items.length > 0) {
                _push2(ssrRenderComponent(_component_NestedList, {
                  items: item.items,
                  "list-style": __props.listStyle,
                  class: "mt-2"
                }, null, _parent2, _scopeId));
              } else {
                _push2(`<!---->`);
              }
              _push2(`</li>`);
            });
            _push2(`<!--]-->`);
          } else {
            return [
              (openBlock(true), createBlock(Fragment, null, renderList(__props.items, (item, index) => {
                return openBlock(), createBlock("li", {
                  key: index,
                  class: "marker:text-brand-500"
                }, [
                  createVNode("span", {
                    innerHTML: item.content
                  }, null, 8, ["innerHTML"]),
                  item.items && item.items.length > 0 ? (openBlock(), createBlock(_component_NestedList, {
                    key: 0,
                    items: item.items,
                    "list-style": __props.listStyle,
                    class: "mt-2"
                  }, null, 8, ["items", "list-style"])) : createCommentVNode("", true)
                ]);
              }), 128))
            ];
          }
        }),
        _: 1
      }), _parent);
    };
  }
});
const _sfc_setup$1 = _sfc_main$1.setup;
_sfc_main$1.setup = (props, ctx) => {
  const ssrContext = useSSRContext();
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("components/NestedList.vue");
  return _sfc_setup$1 ? _sfc_setup$1(props, ctx) : void 0;
};
const __nuxt_component_0 = /* @__PURE__ */ Object.assign(_export_sfc(_sfc_main$1, [["__scopeId", "data-v-d5985fb7"]]), { __name: "NestedList" });
const _sfc_main = /* @__PURE__ */ defineComponent({
  __name: "BlockRenderer",
  __ssrInlineRender: true,
  props: {
    content: {}
  },
  setup(__props) {
    const props = __props;
    const vReveal = {
      mounted(el) {
        el.classList.add("reveal-init");
        const observer = new IntersectionObserver((entries) => {
          entries.forEach((entry) => {
            if (entry.isIntersecting) {
              el.classList.add("reveal-active");
              observer.unobserve(el);
            }
          });
        }, {
          threshold: 0.15,
          rootMargin: "0px 0px -50px 0px"
          // Trigger slightly before it hits the viewport
        });
        observer.observe(el);
      }
    };
    const isEditorJS = computed(() => {
      if (!props.content) return false;
      if (typeof props.content === "object" && props.content.blocks) return true;
      if (typeof props.content === "string") {
        const trimmed = props.content.trim();
        if (trimmed.startsWith("{") && trimmed.endsWith("}")) {
          try {
            const parsed = JSON.parse(props.content);
            return parsed && Array.isArray(parsed.blocks);
          } catch (e) {
            return false;
          }
        }
      }
      return false;
    });
    const parsedData = computed(() => {
      if (!props.content) return null;
      if (typeof props.content === "object" && props.content.blocks) return props.content;
      if (typeof props.content === "string") {
        try {
          return JSON.parse(props.content);
        } catch (e) {
          return null;
        }
      }
      return null;
    });
    const { getAssetUrl, getImageProps } = useDirectus();
    useHead({
      script: [
        { src: "https://www.instagram.com/embed.js", async: true, defer: true }
      ]
    });
    return (_ctx, _push, _parent, _attrs) => {
      const _component_NestedList = __nuxt_component_0;
      _push(`<div${ssrRenderAttrs(mergeProps({ class: "block-renderer flow-root" }, _attrs))} data-v-e7edf41d>`);
      if (!unref(isEditorJS)) {
        _push(`<div class="block-renderer__html prose prose-invert prose-lg max-w-none" data-v-e7edf41d>${__props.content ?? ""}</div>`);
      } else if (unref(parsedData)) {
        _push(`<div class="block-renderer__blocks space-y-6" data-v-e7edf41d><!--[-->`);
        ssrRenderList(unref(parsedData).blocks, (block, index) => {
          _push(`<!--[-->`);
          if (block.type === "header") {
            ssrRenderVNode(_push, createVNode(resolveDynamicComponent(`h${block.data.level || 2}`), {
              class: ["font-serif font-bold mt-12 mb-6", {
                "text-4xl lg:text-5xl": block.data.level === 1,
                "text-3xl lg:text-4xl": block.data.level === 2,
                "text-2xl lg:text-3xl": block.data.level === 3,
                "text-xl lg:text-2xl": block.data.level >= 4
              }]
            }, {
              default: withCtx((_, _push2, _parent2, _scopeId) => {
                if (_push2) {
                  _push2(`<span data-v-e7edf41d${_scopeId}>${(block.data.text || block.data.content) ?? ""}</span>`);
                } else {
                  return [
                    createVNode("span", {
                      innerHTML: block.data.text || block.data.content
                    }, null, 8, ["innerHTML"])
                  ];
                }
              }),
              _: 2
            }), _parent);
          } else if (block.type === "paragraph") {
            _push(`<p class="leading-relaxed text-lg" data-v-e7edf41d>${(block.data.text || block.data.content) ?? ""}</p>`);
          } else if (block.type === "list" && block.data.style === "unordered") {
            _push(`<ul class="list-disc list-inside space-y-2 ml-4" data-v-e7edf41d><!--[-->`);
            ssrRenderList(block.data.items, (item, i) => {
              _push(`<li data-v-e7edf41d>${item ?? ""}</li>`);
            });
            _push(`<!--]--></ul>`);
          } else if (block.type === "list" && block.data.style === "ordered") {
            _push(`<ol class="list-decimal list-inside space-y-2 ml-4" data-v-e7edf41d><!--[-->`);
            ssrRenderList(block.data.items, (item, i) => {
              _push(`<li data-v-e7edf41d>${item ?? ""}</li>`);
            });
            _push(`<!--]--></ol>`);
          } else if (block.type === "nestedlist") {
            _push(ssrRenderComponent(_component_NestedList, {
              items: block.data.items,
              "list-style": block.data.style
            }, null, _parent));
          } else if (block.type === "quote") {
            _push(`<blockquote class="border-l-4 border-brand-500 pl-6 py-2 my-8 italic bg-stage-900/40 rounded-r-lg" data-v-e7edf41d><p class="text-xl font-serif mb-2" data-v-e7edf41d>${block.data.text ?? ""}</p>`);
            if (block.data.caption) {
              _push(`<cite class="text-sm not-italic opacity-60" data-v-e7edf41d>— ${ssrInterpolate(block.data.caption)}</cite>`);
            } else {
              _push(`<!---->`);
            }
            _push(`</blockquote>`);
          } else if (block.type === "video" || block.type === "embed") {
            _push(`<figure${ssrRenderAttrs(mergeProps({
              class: ["my-10 overflow-visible reveal-init", {
                "md:float-left md:mr-10 md:mb-6 w-full md:max-w-[55%] lg:max-w-[70%] lg:-ml-24 xl:-ml-32": block.data.alignment === "left" || block.data.caption && block.data.caption.startsWith("[left]"),
                "md:float-right md:ml-10 md:mb-6 w-full md:max-w-[55%] lg:max-w-[70%] lg:-mr-24 xl:-mr-32": block.data.alignment === "right" || block.data.caption && block.data.caption.startsWith("[right]"),
                "w-full": !block.data.alignment && !(block.data.caption && (block.data.caption.startsWith("[left]") || block.data.caption.startsWith("[right]")))
              }]
            }, ssrGetDirectiveProps(_ctx, vReveal)))} data-v-e7edf41d><div class="rounded-2xl overflow-hidden border border-stage-800/50 bg-black aspect-video flex items-center justify-center" data-v-e7edf41d>`);
            if (block.type === "video") {
              _push(`<video controls class="w-full h-full object-cover"${ssrRenderAttr("src", unref(getAssetUrl)(block.data.file?.id || block.data.file))} data-v-e7edf41d></video>`);
            } else {
              _push(`<iframe${ssrRenderAttr("src", block.data.embed)} class="w-full h-full" frameborder="0" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" allowfullscreen data-v-e7edf41d></iframe>`);
            }
            _push(`</div>`);
            if (block.data.caption) {
              _push(`<figcaption class="p-4 text-center text-sm opacity-60" data-v-e7edf41d>${ssrInterpolate(block.data.caption.replace("[left]", "").replace("[right]", "").trim())}</figcaption>`);
            } else {
              _push(`<!---->`);
            }
            _push(`</figure>`);
          } else if (block.type === "image") {
            _push(`<figure${ssrRenderAttrs(mergeProps({
              class: ["my-10 overflow-visible reveal-init", {
                "md:float-left md:mr-10 md:mb-6 w-full md:max-w-[55%] lg:max-w-[70%] lg:-ml-24 xl:-ml-32": block.data.alignment === "left" || block.data.caption && block.data.caption.startsWith("[left]"),
                "md:float-right md:ml-10 md:mb-6 w-full md:max-w-[55%] lg:max-w-[70%] lg:-mr-24 xl:-mr-32": block.data.alignment === "right" || block.data.caption && block.data.caption.startsWith("[right]"),
                "w-full": !block.data.alignment && !(block.data.caption && (block.data.caption.startsWith("[left]") || block.data.caption.startsWith("[right]")))
              }]
            }, ssrGetDirectiveProps(_ctx, vReveal)))} data-v-e7edf41d><div class="rounded-2xl overflow-hidden border border-stage-800/50" data-v-e7edf41d><img${ssrRenderAttrs(mergeProps({ ref_for: true }, unref(getImageProps)(block.data.file?.id || (typeof block.data.file === "string" ? block.data.file : null) || block.data.file?.url?.split("/assets/")?.[1], { sm: 800, lg: 1200 }), {
              alt: block.data.caption || "",
              class: "w-full h-auto object-cover"
            }))} data-v-e7edf41d></div>`);
            if (block.data.caption && !block.data.caption.startsWith("[left]") && !block.data.caption.startsWith("[right]")) {
              _push(`<figcaption class="p-4 text-center text-sm opacity-60" data-v-e7edf41d>${ssrInterpolate(block.data.caption)}</figcaption>`);
            } else if (block.data.caption) {
              _push(`<figcaption class="p-4 text-center text-sm opacity-60" data-v-e7edf41d>${ssrInterpolate(block.data.caption.replace("[left]", "").replace("[right]", "").trim())}</figcaption>`);
            } else {
              _push(`<!---->`);
            }
            _push(`</figure>`);
          } else if (block.type === "delimiter") {
            _push(`<hr class="my-12 border-stage-800 border-dashed" data-v-e7edf41d>`);
          } else if (block.type === "columns") {
            _push(`<div class="grid grid-cols-1 md:grid-cols-2 gap-8 my-10" data-v-e7edf41d><!--[-->`);
            ssrRenderList(block.data.cols, (col, i) => {
              _push(`<div class="space-y-4" data-v-e7edf41d><!--[-->`);
              ssrRenderList(col.blocks, (colBlock, j) => {
                _push(`<!--[-->`);
                if (colBlock.type === "paragraph") {
                  _push(`<p class="leading-relaxed" data-v-e7edf41d>${colBlock.data.text ?? ""}</p>`);
                } else if (colBlock.type === "header") {
                  ssrRenderVNode(_push, createVNode(resolveDynamicComponent(`h${colBlock.data.level || 3}`), { class: "font-serif font-bold" }, null), _parent);
                } else {
                  _push(`<!---->`);
                }
                _push(`<!--]-->`);
              });
              _push(`<!--]--></div>`);
            });
            _push(`<!--]--></div>`);
          } else if (block.type === "raw") {
            _push(`<div data-v-e7edf41d>${block.data.html ?? ""}</div>`);
          } else {
            _push(`<div class="text-xs text-stage-600 border border-dashed border-stage-800 p-4 rounded my-4" data-v-e7edf41d> Unsupported block type: ${ssrInterpolate(block.type)}</div>`);
          }
          _push(`<!--]-->`);
        });
        _push(`<!--]--></div>`);
      } else {
        _push(`<!---->`);
      }
      _push(`</div>`);
    };
  }
});
const _sfc_setup = _sfc_main.setup;
_sfc_main.setup = (props, ctx) => {
  const ssrContext = useSSRContext();
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("components/BlockRenderer.vue");
  return _sfc_setup ? _sfc_setup(props, ctx) : void 0;
};
const __nuxt_component_1 = /* @__PURE__ */ Object.assign(_export_sfc(_sfc_main, [["__scopeId", "data-v-e7edf41d"]]), { __name: "BlockRenderer" });

export { __nuxt_component_1 as _ };
//# sourceMappingURL=BlockRenderer-DbBZxoc-.mjs.map
