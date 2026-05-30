import { defineComponent, watch, useSSRContext } from 'vue';
import { ssrRenderTeleport, ssrRenderClass, ssrRenderSlot } from 'vue/server-renderer';
import { _ as _export_sfc } from './server.mjs';

const _sfc_main = /* @__PURE__ */ defineComponent({
  __name: "BaseModal",
  __ssrInlineRender: true,
  props: {
    isOpen: { type: Boolean },
    maxWidth: { default: "max-w-lg" }
  },
  emits: ["close"],
  setup(__props, { emit: __emit }) {
    const props = __props;
    watch(() => props.isOpen, (newVal) => {
    }, { immediate: true });
    return (_ctx, _push, _parent, _attrs) => {
      ssrRenderTeleport(_push, (_push2) => {
        if (__props.isOpen) {
          _push2(`<div class="fixed inset-0 z-[100] flex items-center justify-center p-4" role="dialog" aria-modal="true" data-v-ca407ced><div class="absolute inset-0 bg-stage-950/80 backdrop-blur-sm transition-opacity" data-v-ca407ced></div><div class="${ssrRenderClass([__props.maxWidth, "relative w-full max-h-[90vh] bg-stage-900 border border-stage-700/40 rounded-2xl shadow-2xl flex flex-col overflow-hidden animate-scale-in transition-all z-10"])}" data-v-ca407ced><button class="absolute top-4 right-4 z-[120] w-8 h-8 rounded-full bg-stage-800/80 flex items-center justify-center text-stage-400 hover:text-stage-100 transition-colors focus:outline-none focus:ring-2 focus:ring-brand-500" aria-label="Close Modal" data-v-ca407ced><svg class="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2" data-v-ca407ced><path stroke-linecap="round" stroke-linejoin="round" d="M6 18L18 6M6 6l12 12" data-v-ca407ced></path></svg></button><div class="flex-1 overflow-y-auto" data-v-ca407ced>`);
          ssrRenderSlot(_ctx.$slots, "default", {}, null, _push2, _parent);
          _push2(`</div></div></div>`);
        } else {
          _push2(`<!---->`);
        }
      }, "body", false, _parent);
    };
  }
});
const _sfc_setup = _sfc_main.setup;
_sfc_main.setup = (props, ctx) => {
  const ssrContext = useSSRContext();
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("components/BaseModal.vue");
  return _sfc_setup ? _sfc_setup(props, ctx) : void 0;
};
const __nuxt_component_0 = /* @__PURE__ */ Object.assign(_export_sfc(_sfc_main, [["__scopeId", "data-v-ca407ced"]]), { __name: "BaseModal" });

export { __nuxt_component_0 as _ };
//# sourceMappingURL=BaseModal-Bc4BSEMB.mjs.map
