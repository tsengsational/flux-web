import { _ as __nuxt_component_0$1 } from './nuxt-link-cZpXnfBZ.mjs';
import { defineComponent, computed, mergeProps, withCtx, unref, createVNode, openBlock, createBlock, toDisplayString, createCommentVNode, useSSRContext } from 'vue';
import { ssrRenderComponent, ssrRenderAttrs, ssrInterpolate, ssrRenderClass } from 'vue/server-renderer';
import { u as useDirectus } from './asyncData-DO9zjVnq.mjs';

const _sfc_main = /* @__PURE__ */ defineComponent({
  __name: "ProductionCard",
  __ssrInlineRender: true,
  props: {
    production: {},
    view_type: { default: "light" }
  },
  setup(__props) {
    const props = __props;
    const { getImageProps } = useDirectus();
    const dateRange = computed(() => {
      if (!props.production.opening_date) return null;
      const fmt = (d) => new Date(d).toLocaleDateString("en-US", { month: "short", day: "numeric" });
      const open = fmt(props.production.opening_date);
      const close = props.production.closing_date ? fmt(props.production.closing_date) : "TBD";
      return `${open} – ${close}`;
    });
    return (_ctx, _push, _parent, _attrs) => {
      const _component_NuxtLink = __nuxt_component_0$1;
      _push(ssrRenderComponent(_component_NuxtLink, mergeProps({
        to: `/productions/${__props.production.slug}`,
        class: "production-card card-glass group block",
        id: `production-card-${__props.production.slug}`
      }, _attrs), {
        default: withCtx((_, _push2, _parent2, _scopeId) => {
          if (_push2) {
            _push2(`<div class="production-card__image-container relative aspect-[3/4] overflow-hidden bg-stage-800"${_scopeId}>`);
            if (__props.production.poster_image) {
              _push2(`<img${ssrRenderAttrs(mergeProps(unref(getImageProps)(__props.production.poster_image, { sm: 400, md: 600 }), {
                alt: `${__props.production.title} poster`,
                class: "production-card__poster w-full h-full object-cover transition-transform duration-500 group-hover:scale-105",
                loading: "lazy"
              }))}${_scopeId}>`);
            } else {
              _push2(`<div class="production-card__placeholder w-full h-full flex items-center justify-center"${_scopeId}><span class="production-card__placeholder-text text-stage-600 font-serif text-6xl"${_scopeId}>F</span></div>`);
            }
            _push2(`<div class="production-card__overlay absolute inset-0 bg-gradient-to-t from-stage-950/90 via-stage-950/20 to-transparent"${_scopeId}></div><div class="production-card__badge absolute top-3 right-3"${_scopeId}><span class="production-card__badge-text px-2.5 py-1 rounded-full text-xs font-bold bg-brand-600 text-white shadow-sm"${_scopeId}>${ssrInterpolate(__props.production.season)}</span></div></div><div class="production-card__info p-5"${_scopeId}><h3 class="${ssrRenderClass([__props.view_type === "light" ? "text-stage-950" : "text-stage-50", "production-card__title text-lg font-serif font-bold group-hover:text-brand-400 transition-colors line-clamp-2"])}"${_scopeId}>${ssrInterpolate(__props.production.title)}</h3><p class="${ssrRenderClass([__props.view_type === "light" ? "text-stage-700" : "text-stage-200", "production-card__playwright text-sm mt-1 font-medium"])}"${_scopeId}> by ${ssrInterpolate(__props.production.playwright)}</p>`);
            if (__props.production.tagline) {
              _push2(`<p class="${ssrRenderClass([__props.view_type === "light" ? "text-stage-600" : "text-stage-300", "production-card__tagline text-sm mt-2 line-clamp-2 leading-relaxed"])}"${_scopeId}>${ssrInterpolate(__props.production.tagline)}</p>`);
            } else {
              _push2(`<!---->`);
            }
            if (unref(dateRange)) {
              _push2(`<p class="${ssrRenderClass([__props.view_type === "light" ? "text-brand-700" : "text-brand-300", "production-card__date-range text-xs mt-3 font-bold"])}"${_scopeId}>${ssrInterpolate(unref(dateRange))}</p>`);
            } else {
              _push2(`<!---->`);
            }
            _push2(`</div>`);
          } else {
            return [
              createVNode("div", { class: "production-card__image-container relative aspect-[3/4] overflow-hidden bg-stage-800" }, [
                __props.production.poster_image ? (openBlock(), createBlock("img", mergeProps({ key: 0 }, unref(getImageProps)(__props.production.poster_image, { sm: 400, md: 600 }), {
                  alt: `${__props.production.title} poster`,
                  class: "production-card__poster w-full h-full object-cover transition-transform duration-500 group-hover:scale-105",
                  loading: "lazy"
                }), null, 16, ["alt"])) : (openBlock(), createBlock("div", {
                  key: 1,
                  class: "production-card__placeholder w-full h-full flex items-center justify-center"
                }, [
                  createVNode("span", { class: "production-card__placeholder-text text-stage-600 font-serif text-6xl" }, "F")
                ])),
                createVNode("div", { class: "production-card__overlay absolute inset-0 bg-gradient-to-t from-stage-950/90 via-stage-950/20 to-transparent" }),
                createVNode("div", { class: "production-card__badge absolute top-3 right-3" }, [
                  createVNode("span", { class: "production-card__badge-text px-2.5 py-1 rounded-full text-xs font-bold bg-brand-600 text-white shadow-sm" }, toDisplayString(__props.production.season), 1)
                ])
              ]),
              createVNode("div", { class: "production-card__info p-5" }, [
                createVNode("h3", {
                  class: ["production-card__title text-lg font-serif font-bold group-hover:text-brand-400 transition-colors line-clamp-2", __props.view_type === "light" ? "text-stage-950" : "text-stage-50"]
                }, toDisplayString(__props.production.title), 3),
                createVNode("p", {
                  class: ["production-card__playwright text-sm mt-1 font-medium", __props.view_type === "light" ? "text-stage-700" : "text-stage-200"]
                }, " by " + toDisplayString(__props.production.playwright), 3),
                __props.production.tagline ? (openBlock(), createBlock("p", {
                  key: 0,
                  class: ["production-card__tagline text-sm mt-2 line-clamp-2 leading-relaxed", __props.view_type === "light" ? "text-stage-600" : "text-stage-300"]
                }, toDisplayString(__props.production.tagline), 3)) : createCommentVNode("", true),
                unref(dateRange) ? (openBlock(), createBlock("p", {
                  key: 1,
                  class: ["production-card__date-range text-xs mt-3 font-bold", __props.view_type === "light" ? "text-brand-700" : "text-brand-300"]
                }, toDisplayString(unref(dateRange)), 3)) : createCommentVNode("", true)
              ])
            ];
          }
        }),
        _: 1
      }, _parent));
    };
  }
});
const _sfc_setup = _sfc_main.setup;
_sfc_main.setup = (props, ctx) => {
  const ssrContext = useSSRContext();
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("components/ProductionCard.vue");
  return _sfc_setup ? _sfc_setup(props, ctx) : void 0;
};
const __nuxt_component_0 = Object.assign(_sfc_main, { __name: "ProductionCard" });

export { __nuxt_component_0 as _ };
//# sourceMappingURL=ProductionCard-V7SgolUz.mjs.map
