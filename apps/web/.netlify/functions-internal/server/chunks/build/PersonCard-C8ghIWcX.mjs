import { _ as __nuxt_component_0 } from './BaseModal-Bc4BSEMB.mjs';
import { _ as __nuxt_component_1 } from './BlockRenderer-DbBZxoc-.mjs';
import { _ as __nuxt_component_0$1 } from './nuxt-link-cZpXnfBZ.mjs';
import { defineComponent, computed, ref, mergeProps, unref, withCtx, createTextVNode, openBlock, createBlock, createVNode, toDisplayString, createCommentVNode, useSSRContext } from 'vue';
import { ssrRenderAttrs, ssrRenderAttr, ssrRenderClass, ssrInterpolate, ssrRenderComponent } from 'vue/server-renderer';
import { u as useDirectus } from './asyncData-DO9zjVnq.mjs';

const _sfc_main = /* @__PURE__ */ defineComponent({
  __name: "PersonCard",
  __ssrInlineRender: true,
  props: {
    person: {},
    role: {},
    compact: { type: Boolean, default: false }
  },
  setup(__props) {
    const props = __props;
    const { getImageProps } = useDirectus();
    const fullName = computed(() => `${props.person.first_name} ${props.person.last_name}`);
    const isModalOpen = ref(false);
    return (_ctx, _push, _parent, _attrs) => {
      const _component_BaseModal = __nuxt_component_0;
      const _component_BlockRenderer = __nuxt_component_1;
      const _component_NuxtLink = __nuxt_component_0$1;
      _push(`<div${ssrRenderAttrs(mergeProps({ class: "person-card" }, _attrs))}><button class="person-card__link card-glass group text-left w-full"${ssrRenderAttr("id", `person-card-${__props.person.slug}`)}><div class="${ssrRenderClass([{ "person-card__image-container--compact aspect-square": __props.compact }, "person-card__image-container relative aspect-[3/4] overflow-hidden bg-stage-800"])}">`);
      if (__props.person.headshot) {
        _push(`<img${ssrRenderAttrs(mergeProps(unref(getImageProps)(__props.person.headshot, { sm: 200, md: 400 }), {
          alt: `${unref(fullName)} headshot`,
          class: "person-card__image w-full h-full object-cover transition-transform duration-500 group-hover:scale-105",
          loading: "lazy"
        }))}>`);
      } else {
        _push(`<div class="person-card__placeholder w-full h-full flex items-center justify-center bg-gradient-to-br from-stage-800 to-stage-900"><span class="person-card__initials text-stage-500 font-serif text-4xl">${ssrInterpolate(__props.person.first_name[0])}${ssrInterpolate(__props.person.last_name[0])}</span></div>`);
      }
      _push(`</div><div class="person-card__info p-4"><h3 class="person-card__name text-sm font-semibold text-stage-500 group-hover:text-brand-400 transition-colors">${ssrInterpolate(unref(fullName))}</h3>`);
      if (__props.person.pronouns) {
        _push(`<p class="person-card__pronouns text-xs text-stage-500 mt-0.5">(${ssrInterpolate(__props.person.pronouns)})</p>`);
      } else {
        _push(`<!---->`);
      }
      if (__props.role) {
        _push(`<p class="person-card__role text-xs text-brand-400/80 mt-1 font-medium">${ssrInterpolate(__props.role)}</p>`);
      } else {
        _push(`<!---->`);
      }
      _push(`</div></button>`);
      _push(ssrRenderComponent(_component_BaseModal, {
        "is-open": unref(isModalOpen),
        "max-width": "max-w-lg md:max-w-3xl",
        onClose: ($event) => isModalOpen.value = false
      }, {
        default: withCtx((_, _push2, _parent2, _scopeId) => {
          if (_push2) {
            _push2(`<div class="person-modal__layout flex flex-col md:flex-row h-full"${_scopeId}><div class="person-modal__image-wrapper w-full md:w-2/5 aspect-[3/4] md:aspect-auto md:h-full bg-stage-800 flex-shrink-0"${_scopeId}>`);
            if (__props.person.headshot) {
              _push2(`<img${ssrRenderAttrs(mergeProps(unref(getImageProps)(__props.person.headshot, { sm: 400, md: 800 }, { quality: 90 }), {
                alt: unref(fullName),
                class: "person-modal__image w-full h-full object-cover"
              }))}${_scopeId}>`);
            } else {
              _push2(`<div class="person-modal__placeholder w-full h-full flex items-center justify-center min-h-[200px]"${_scopeId}><span class="person-modal__initials text-stage-500 font-serif text-5xl"${_scopeId}>${ssrInterpolate(__props.person.first_name[0])}${ssrInterpolate(__props.person.last_name[0])}</span></div>`);
            }
            _push2(`</div><div class="person-modal__info p-6 md:p-8 flex-1 md:overflow-y-auto"${_scopeId}><h2 class="person-modal__name text-xl md:text-2xl font-serif font-bold text-stage-50"${_scopeId}>${ssrInterpolate(unref(fullName))}</h2>`);
            if (__props.person.pronouns) {
              _push2(`<p class="person-modal__pronouns text-sm text-stage-400 mt-1"${_scopeId}>(${ssrInterpolate(__props.person.pronouns)})</p>`);
            } else {
              _push2(`<!---->`);
            }
            if (__props.role) {
              _push2(`<p class="person-modal__role text-sm md:text-base text-brand-400 font-medium mt-2"${_scopeId}>${ssrInterpolate(__props.role)}</p>`);
            } else {
              _push2(`<!---->`);
            }
            if (__props.person.bio) {
              _push2(`<div class="person-modal__bio mt-4 text-sm md:text-base text-stage-300 leading-relaxed prose prose-invert prose-sm md:prose-base"${_scopeId}>`);
              _push2(ssrRenderComponent(_component_BlockRenderer, {
                content: __props.person.bio
              }, null, _parent2, _scopeId));
              _push2(`</div>`);
            } else {
              _push2(`<p class="person-modal__no-bio mt-4 text-sm text-stage-500 italic"${_scopeId}>Bio coming soon.</p>`);
            }
            _push2(`<div class="person-modal__footer mt-6 pt-6 border-t border-stage-800"${_scopeId}>`);
            _push2(ssrRenderComponent(_component_NuxtLink, {
              to: `/people/${__props.person.slug}`,
              class: "text-xs font-bold text-brand-400 hover:text-brand-300 transition-colors uppercase tracking-widest flex items-center gap-2",
              onClick: ($event) => isModalOpen.value = false
            }, {
              default: withCtx((_2, _push3, _parent3, _scopeId2) => {
                if (_push3) {
                  _push3(` View Full Profile <svg class="w-3 h-3" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2.5"${_scopeId2}><path stroke-linecap="round" stroke-linejoin="round" d="M13.5 4.5L21 12m0 0l-7.5 7.5M21 12H3"${_scopeId2}></path></svg>`);
                } else {
                  return [
                    createTextVNode(" View Full Profile "),
                    (openBlock(), createBlock("svg", {
                      class: "w-3 h-3",
                      fill: "none",
                      viewBox: "0 0 24 24",
                      stroke: "currentColor",
                      "stroke-width": "2.5"
                    }, [
                      createVNode("path", {
                        "stroke-linecap": "round",
                        "stroke-linejoin": "round",
                        d: "M13.5 4.5L21 12m0 0l-7.5 7.5M21 12H3"
                      })
                    ]))
                  ];
                }
              }),
              _: 1
            }, _parent2, _scopeId));
            _push2(`</div></div></div>`);
          } else {
            return [
              createVNode("div", { class: "person-modal__layout flex flex-col md:flex-row h-full" }, [
                createVNode("div", { class: "person-modal__image-wrapper w-full md:w-2/5 aspect-[3/4] md:aspect-auto md:h-full bg-stage-800 flex-shrink-0" }, [
                  __props.person.headshot ? (openBlock(), createBlock("img", mergeProps({ key: 0 }, unref(getImageProps)(__props.person.headshot, { sm: 400, md: 800 }, { quality: 90 }), {
                    alt: unref(fullName),
                    class: "person-modal__image w-full h-full object-cover"
                  }), null, 16, ["alt"])) : (openBlock(), createBlock("div", {
                    key: 1,
                    class: "person-modal__placeholder w-full h-full flex items-center justify-center min-h-[200px]"
                  }, [
                    createVNode("span", { class: "person-modal__initials text-stage-500 font-serif text-5xl" }, toDisplayString(__props.person.first_name[0]) + toDisplayString(__props.person.last_name[0]), 1)
                  ]))
                ]),
                createVNode("div", { class: "person-modal__info p-6 md:p-8 flex-1 md:overflow-y-auto" }, [
                  createVNode("h2", { class: "person-modal__name text-xl md:text-2xl font-serif font-bold text-stage-50" }, toDisplayString(unref(fullName)), 1),
                  __props.person.pronouns ? (openBlock(), createBlock("p", {
                    key: 0,
                    class: "person-modal__pronouns text-sm text-stage-400 mt-1"
                  }, "(" + toDisplayString(__props.person.pronouns) + ")", 1)) : createCommentVNode("", true),
                  __props.role ? (openBlock(), createBlock("p", {
                    key: 1,
                    class: "person-modal__role text-sm md:text-base text-brand-400 font-medium mt-2"
                  }, toDisplayString(__props.role), 1)) : createCommentVNode("", true),
                  __props.person.bio ? (openBlock(), createBlock("div", {
                    key: 2,
                    class: "person-modal__bio mt-4 text-sm md:text-base text-stage-300 leading-relaxed prose prose-invert prose-sm md:prose-base"
                  }, [
                    createVNode(_component_BlockRenderer, {
                      content: __props.person.bio
                    }, null, 8, ["content"])
                  ])) : (openBlock(), createBlock("p", {
                    key: 3,
                    class: "person-modal__no-bio mt-4 text-sm text-stage-500 italic"
                  }, "Bio coming soon.")),
                  createVNode("div", { class: "person-modal__footer mt-6 pt-6 border-t border-stage-800" }, [
                    createVNode(_component_NuxtLink, {
                      to: `/people/${__props.person.slug}`,
                      class: "text-xs font-bold text-brand-400 hover:text-brand-300 transition-colors uppercase tracking-widest flex items-center gap-2",
                      onClick: ($event) => isModalOpen.value = false
                    }, {
                      default: withCtx(() => [
                        createTextVNode(" View Full Profile "),
                        (openBlock(), createBlock("svg", {
                          class: "w-3 h-3",
                          fill: "none",
                          viewBox: "0 0 24 24",
                          stroke: "currentColor",
                          "stroke-width": "2.5"
                        }, [
                          createVNode("path", {
                            "stroke-linecap": "round",
                            "stroke-linejoin": "round",
                            d: "M13.5 4.5L21 12m0 0l-7.5 7.5M21 12H3"
                          })
                        ]))
                      ]),
                      _: 1
                    }, 8, ["to", "onClick"])
                  ])
                ])
              ])
            ];
          }
        }),
        _: 1
      }, _parent));
      _push(`</div>`);
    };
  }
});
const _sfc_setup = _sfc_main.setup;
_sfc_main.setup = (props, ctx) => {
  const ssrContext = useSSRContext();
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("components/PersonCard.vue");
  return _sfc_setup ? _sfc_setup(props, ctx) : void 0;
};
const __nuxt_component_2 = Object.assign(_sfc_main, { __name: "PersonCard" });

export { __nuxt_component_2 as _ };
//# sourceMappingURL=PersonCard-C8ghIWcX.mjs.map
