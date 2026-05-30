import { defineComponent, ref, mergeProps, unref, useSSRContext } from 'vue';
import { ssrRenderAttrs, ssrRenderClass, ssrInterpolate, ssrRenderList, ssrRenderTeleport } from 'vue/server-renderer';
import { u as useDirectus } from './asyncData-DO9zjVnq.mjs';
import { _ as _export_sfc } from './server.mjs';

const _sfc_main = /* @__PURE__ */ defineComponent({
  __name: "MediaGallery",
  __ssrInlineRender: true,
  props: {
    images: {},
    title: {},
    viewtype: { default: "light" }
  },
  setup(__props) {
    const { getImageProps } = useDirectus();
    const isLightboxOpen = ref(false);
    const currentIndex = ref(0);
    return (_ctx, _push, _parent, _attrs) => {
      _push(`<section${ssrRenderAttrs(mergeProps({ class: "media-gallery" }, _attrs))} data-v-28c2e8b9>`);
      if (__props.title) {
        _push(`<h2 class="${ssrRenderClass([__props.viewtype === "dark" ? "text-stage-50" : "text-stage-900", "text-2xl font-serif font-bold mb-8"])}" data-v-28c2e8b9>${ssrInterpolate(__props.title)}</h2>`);
      } else {
        _push(`<!---->`);
      }
      _push(`<div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6" data-v-28c2e8b9><!--[-->`);
      ssrRenderList(__props.images, (fileId, index) => {
        _push(`<div class="relative aspect-square cursor-pointer group overflow-hidden rounded-2xl border border-stage-800/40 bg-stage-900" data-v-28c2e8b9><img${ssrRenderAttrs(mergeProps({ ref_for: true }, unref(getImageProps)(fileId, { sm: 400, md: 600, lg: 800 }), {
          class: "w-full h-full object-cover transition-transform duration-700 group-hover:scale-110",
          alt: "Gallery image",
          loading: "lazy"
        }))} data-v-28c2e8b9><div class="absolute inset-0 bg-brand-500/10 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center" data-v-28c2e8b9><div class="w-12 h-12 rounded-full bg-stage-950/80 backdrop-blur-md flex items-center justify-center text-brand-400 scale-75 group-hover:scale-100 transition-transform" data-v-28c2e8b9><svg class="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" data-v-28c2e8b9><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0zM10 7v3m0 0v3m0-3h3m-3 0H7" data-v-28c2e8b9></path></svg></div></div></div>`);
      });
      _push(`<!--]--></div>`);
      ssrRenderTeleport(_push, (_push2) => {
        if (unref(isLightboxOpen)) {
          _push2(`<div class="fixed inset-0 z-[100] flex items-center justify-center bg-stage-950/95 backdrop-blur-xl" data-v-28c2e8b9><button class="absolute top-6 right-6 z-[110] p-3 text-stage-400 hover:text-stage-50 transition-colors" data-v-28c2e8b9><svg class="w-8 h-8" fill="none" viewBox="0 0 24 24" stroke="currentColor" data-v-28c2e8b9><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" data-v-28c2e8b9></path></svg></button>`);
          if (__props.images.length > 1) {
            _push2(`<button class="absolute left-6 top-1/2 -translate-y-1/2 z-[110] p-4 text-stage-400 hover:text-brand-400 transition-colors bg-stage-900/50 rounded-full backdrop-blur-md hover:bg-stage-800" data-v-28c2e8b9><svg class="w-8 h-8" fill="none" viewBox="0 0 24 24" stroke="currentColor" data-v-28c2e8b9><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 19l-7-7 7-7" data-v-28c2e8b9></path></svg></button>`);
          } else {
            _push2(`<!---->`);
          }
          if (__props.images.length > 1) {
            _push2(`<button class="absolute right-6 top-1/2 -translate-y-1/2 z-[110] p-4 text-stage-400 hover:text-brand-400 transition-colors bg-stage-900/50 rounded-full backdrop-blur-md hover:bg-stage-800" data-v-28c2e8b9><svg class="w-8 h-8" fill="none" viewBox="0 0 24 24" stroke="currentColor" data-v-28c2e8b9><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5l7 7-7 7" data-v-28c2e8b9></path></svg></button>`);
          } else {
            _push2(`<!---->`);
          }
          _push2(`<div class="relative flex flex-col items-center justify-center p-4" data-v-28c2e8b9><img${ssrRenderAttrs(mergeProps({ key: unref(currentIndex) }, unref(getImageProps)(__props.images[unref(currentIndex)], { sm: 800, md: 1200, lg: 1920 }, { quality: 90 }), {
            class: "max-w-[90vw] max-h-[80vh] object-contain shadow-2xl rounded-sm animate-in zoom-in-95 duration-300",
            alt: "Full size image"
          }))} data-v-28c2e8b9><div class="mt-8 text-stage-400 font-mono text-xs tracking-[0.3em] uppercase bg-stage-900/40 px-4 py-2 rounded-full backdrop-blur-sm" data-v-28c2e8b9>${ssrInterpolate(unref(currentIndex) + 1)} <span class="mx-2 text-stage-600" data-v-28c2e8b9>/</span> ${ssrInterpolate(__props.images.length)}</div></div></div>`);
        } else {
          _push2(`<!---->`);
        }
      }, "body", false, _parent);
      _push(`</section>`);
    };
  }
});
const _sfc_setup = _sfc_main.setup;
_sfc_main.setup = (props, ctx) => {
  const ssrContext = useSSRContext();
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("components/MediaGallery.vue");
  return _sfc_setup ? _sfc_setup(props, ctx) : void 0;
};
const __nuxt_component_3 = /* @__PURE__ */ Object.assign(_export_sfc(_sfc_main, [["__scopeId", "data-v-28c2e8b9"]]), { __name: "MediaGallery" });

export { __nuxt_component_3 as _ };
//# sourceMappingURL=MediaGallery-C10VoGcE.mjs.map
