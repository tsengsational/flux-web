import { defineComponent, mergeProps, useSSRContext } from 'vue';
import { ssrRenderAttrs } from 'vue/server-renderer';
import { u as useSeoMeta } from './composables-DOi4jpYZ.mjs';
import './server.mjs';
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

const _sfc_main = /* @__PURE__ */ defineComponent({
  __name: "accessibility",
  __ssrInlineRender: true,
  setup(__props) {
    useSeoMeta({
      title: "Accessibility — Flux Theatre Ensemble"
    });
    return (_ctx, _push, _parent, _attrs) => {
      _push(`<div${ssrRenderAttrs(mergeProps({ class: "accessibility-page py-24 max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 prose prose-invert" }, _attrs))}><h1 class="accessibility-page__title section-heading mb-8">Accessibility</h1><div class="accessibility-page__content"><p>We are dedicated to providing an inclusive theatre experience for all through physical and digital access.</p></div></div>`);
    };
  }
});
const _sfc_setup = _sfc_main.setup;
_sfc_main.setup = (props, ctx) => {
  const ssrContext = useSSRContext();
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("pages/accessibility.vue");
  return _sfc_setup ? _sfc_setup(props, ctx) : void 0;
};

export { _sfc_main as default };
//# sourceMappingURL=accessibility-BpLGqSeH.mjs.map
