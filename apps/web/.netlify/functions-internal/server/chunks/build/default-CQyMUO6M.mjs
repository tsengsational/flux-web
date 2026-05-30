import { _ as __nuxt_component_0$1 } from './nuxt-link-cZpXnfBZ.mjs';
import { mergeProps, defineComponent, ref, withAsyncContext, computed, withCtx, createVNode, unref, createTextVNode, toDisplayString, useSSRContext } from 'vue';
import { ssrRenderAttrs, ssrRenderComponent, ssrRenderSlot, ssrRenderAttr, ssrRenderList, ssrInterpolate, ssrRenderClass } from 'vue/server-renderer';
import { p as publicAssetsURL } from '../routes/renderer.mjs';
import { u as useDirectus, a as useAsyncData } from './asyncData-DO9zjVnq.mjs';
import { _ as _export_sfc } from './server.mjs';
import '../_/nitro.mjs';
import 'node:http';
import 'node:https';
import 'node:events';
import 'node:buffer';
import 'node:fs';
import 'node:path';
import 'node:crypto';
import 'vue-bundle-renderer/runtime';
import 'unhead/server';
import 'devalue';
import 'unhead/plugins';
import 'unhead/utils';
import '@directus/sdk';
import 'vue-router';

const _imports_0 = publicAssetsURL("/logo.svg");
const _sfc_main$2 = /* @__PURE__ */ defineComponent({
  __name: "SiteHeader",
  __ssrInlineRender: true,
  async setup(__props) {
    let __temp, __restore;
    const { client, readItems, readSingleton } = useDirectus();
    const isMenuOpen = ref(false);
    const activeDropdown = ref(null);
    const activeAccordion = ref(null);
    const { data: siteSettings, error: siteSettingsError } = ([__temp, __restore] = withAsyncContext(() => useAsyncData(
      "siteSettings-header",
      () => client.request(readSingleton("site_settings", {
        fields: ["header_cta", "header_cta_url"]
      }))
    )), __temp = await __temp, __restore(), __temp);
    const { data: allNavItems } = ([__temp, __restore] = withAsyncContext(() => useAsyncData(
      "navigation",
      () => client.request(readItems("navigation", {
        sort: ["sort"],
        fields: [
          "id",
          "label",
          "url",
          "sort",
          "is_external",
          { parent: ["id"] },
          { page: ["slug"] }
        ]
      }))
    )), __temp = await __temp, __restore(), __temp);
    const navTree = computed(() => {
      const rawData = allNavItems.value;
      if (!rawData) return [];
      const rawItems = Array.isArray(rawData) ? rawData : rawData.data;
      if (!Array.isArray(rawItems)) return [];
      const items = rawItems.map((item) => {
        let resolvedUrl = item.url;
        if (item.page?.slug) {
          resolvedUrl = `/${item.page.slug}`;
        }
        return {
          ...item,
          url: resolvedUrl,
          children: []
        };
      });
      const rootItems = [];
      const itemMap = /* @__PURE__ */ new Map();
      items.forEach((item) => {
        if (item.id) {
          itemMap.set(item.id.toString(), item);
        }
      });
      items.forEach((item) => {
        const parentField = item.parent;
        if (parentField) {
          const parentId = (typeof parentField === "string" ? parentField : parentField.id)?.toString();
          const parentItem = parentId ? itemMap.get(parentId) : null;
          if (parentItem) {
            parentItem.children.push(item);
          } else {
            rootItems.push(item);
          }
        } else {
          rootItems.push(item);
        }
      });
      return rootItems;
    });
    const staticNav = [
      { id: "static-home", label: "Home", url: "/", sort: 0, parent: null, children: [], is_external: false, page: null },
      { id: "static-productions", label: "Productions", url: "/productions", sort: 1, parent: null, children: [], is_external: false, page: null },
      { id: "static-events", label: "Events", url: "/events", sort: 2, parent: null, children: [], is_external: false, page: null },
      { id: "static-news", label: "News", url: "/news", sort: 5, parent: null, children: [], is_external: false, page: null },
      { id: "static-creative-partners", label: "Creative Partners", url: "/groups/creative-partners", sort: 3, parent: null, children: [], is_external: false, page: null }
    ];
    const combinedNav = computed(() => {
      return [...staticNav, ...navTree.value];
    });
    return (_ctx, _push, _parent, _attrs) => {
      const _component_NuxtLink = __nuxt_component_0$1;
      _push(`<!--[--><header class="site-header fixed top-0 inset-x-0 z-50 border-b border-stage-800/60 bg-stage-950/80 backdrop-blur-xl"><div class="site-header__container max-w-7xl mx-auto px-4 sm:px-6 lg:px-8"><div class="site-header__wrapper flex items-center justify-between h-16 lg:h-20">`);
      _push(ssrRenderComponent(_component_NuxtLink, {
        to: "/",
        class: "site-header__logo flex items-center gap-3 group",
        id: "site-logo"
      }, {
        default: withCtx((_, _push2, _parent2, _scopeId) => {
          if (_push2) {
            _push2(`<img${ssrRenderAttr("src", _imports_0)} alt="Flux Theatre Ensemble" class="h-10 w-auto group-hover:opacity-90 transition-opacity"${_scopeId}>`);
          } else {
            return [
              createVNode("img", {
                src: _imports_0,
                alt: "Flux Theatre Ensemble",
                class: "h-10 w-auto group-hover:opacity-90 transition-opacity"
              })
            ];
          }
        }),
        _: 1
      }, _parent));
      _push(`<nav class="site-header__nav site-header__nav--desktop hidden lg:flex items-center gap-1" id="desktop-nav"><!--[-->`);
      ssrRenderList(unref(combinedNav), (item) => {
        _push(`<div class="site-header__nav-item relative">`);
        if (!item.children.length) {
          _push(ssrRenderComponent(_component_NuxtLink, {
            to: item.url || "#",
            target: item.is_external ? "_blank" : void 0,
            class: "site-header__nav-link px-4 py-2 rounded-lg text-sm font-medium text-stage-300 hover:text-brand-400 hover:bg-stage-800/50 transition-all duration-200",
            "active-class": "site-header__nav-link--active !text-brand-400 bg-stage-800/50"
          }, {
            default: withCtx((_, _push2, _parent2, _scopeId) => {
              if (_push2) {
                _push2(`${ssrInterpolate(item.label)}`);
              } else {
                return [
                  createTextVNode(toDisplayString(item.label), 1)
                ];
              }
            }),
            _: 2
          }, _parent));
        } else {
          _push(`<!--[--><button class="${ssrRenderClass([{ "site-header__dropdown-trigger--active text-brand-400 bg-stage-800/50": unref(activeDropdown) === item.id }, "site-header__dropdown-trigger nav-dropdown-trigger px-4 py-2 rounded-lg text-sm font-medium text-stage-300 hover:text-brand-400 hover:bg-stage-800/50 transition-all duration-200 flex items-center gap-1"])}">${ssrInterpolate(item.label)} <svg class="${ssrRenderClass([{ "rotate-180": unref(activeDropdown) === item.id }, "site-header__dropdown-icon w-4 h-4 transition-transform duration-200"])}" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 9l-7 7-7-7"></path></svg></button>`);
          if (unref(activeDropdown) === item.id) {
            _push(`<div class="site-header__dropdown-menu absolute left-0 mt-1 w-48 rounded-xl bg-stage-900 border border-stage-800/60 shadow-2xl p-1.5 z-50 backdrop-blur-xl"><!--[-->`);
            ssrRenderList(item.children, (child) => {
              _push(ssrRenderComponent(_component_NuxtLink, {
                key: child.id,
                to: child.url || "#",
                target: child.is_external ? "_blank" : void 0,
                class: "site-header__dropdown-link block px-3 py-2 rounded-lg text-sm font-medium text-stage-400 hover:text-brand-400 hover:bg-stage-800/50 transition-all",
                "active-class": "site-header__dropdown-link--active !text-brand-400",
                onClick: ($event) => activeDropdown.value = null
              }, {
                default: withCtx((_, _push2, _parent2, _scopeId) => {
                  if (_push2) {
                    _push2(`${ssrInterpolate(child.label)}`);
                  } else {
                    return [
                      createTextVNode(toDisplayString(child.label), 1)
                    ];
                  }
                }),
                _: 2
              }, _parent));
            });
            _push(`<!--]--></div>`);
          } else {
            _push(`<!---->`);
          }
          _push(`<!--]-->`);
        }
        _push(`</div>`);
      });
      _push(`<!--]--></nav><div class="site-header__actions flex items-center gap-3">`);
      if (unref(siteSettings)?.header_cta) {
        _push(ssrRenderComponent(_component_NuxtLink, {
          to: unref(siteSettings).header_cta_url || "/",
          target: unref(siteSettings).header_cta_url?.startsWith("http") ? "_blank" : void 0,
          class: "site-header__cta btn-primary text-brand-400 hover:text-brand-200 transition-colors hidden sm:inline-flex",
          id: "header-cta"
        }, {
          default: withCtx((_, _push2, _parent2, _scopeId) => {
            if (_push2) {
              _push2(`${ssrInterpolate(unref(siteSettings).header_cta)}`);
            } else {
              return [
                createTextVNode(toDisplayString(unref(siteSettings).header_cta), 1)
              ];
            }
          }),
          _: 1
        }, _parent));
      } else {
        _push(`<!---->`);
      }
      _push(`<button class="site-header__mobile-toggle lg:hidden p-2 rounded-lg text-stage-300 hover:text-stage-100 hover:bg-stage-800/50 transition-colors" id="mobile-menu-toggle"${ssrRenderAttr("aria-expanded", unref(isMenuOpen))} aria-label="Toggle menu"><svg class="site-header__mobile-icon w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="1.5">`);
      if (!unref(isMenuOpen)) {
        _push(`<path stroke-linecap="round" stroke-linejoin="round" d="M3.75 9h16.5m-16.5 6.75h16.5"></path>`);
      } else {
        _push(`<path stroke-linecap="round" stroke-linejoin="round" d="M6 18L18 6M6 6l12 12"></path>`);
      }
      _push(`</svg></button></div></div>`);
      if (unref(isMenuOpen)) {
        _push(`<div class="site-header__mobile-nav lg:hidden pb-4 border-t border-stage-800/60 mt-2 pt-4 px-1" id="mobile-nav"><!--[-->`);
        ssrRenderList(unref(combinedNav), (item) => {
          _push(`<div class="site-header__mobile-nav-item mb-1">`);
          if (!item.children.length) {
            _push(ssrRenderComponent(_component_NuxtLink, {
              to: item.url || "#",
              class: "site-header__mobile-nav-link block px-4 py-3 rounded-lg text-base font-medium text-stage-300 hover:text-brand-400 hover:bg-stage-800/50 transition-all",
              "active-class": "site-header__mobile-nav-link--active !text-brand-400 bg-stage-800/50",
              onClick: ($event) => isMenuOpen.value = false
            }, {
              default: withCtx((_, _push2, _parent2, _scopeId) => {
                if (_push2) {
                  _push2(`${ssrInterpolate(item.label)}`);
                } else {
                  return [
                    createTextVNode(toDisplayString(item.label), 1)
                  ];
                }
              }),
              _: 2
            }, _parent));
          } else {
            _push(`<!--[--><button class="${ssrRenderClass([{ "site-header__mobile-accordion-trigger--active text-brand-400 bg-stage-800/50": unref(activeAccordion) === item.id }, "site-header__mobile-accordion-trigger w-full flex items-center justify-between px-4 py-3 rounded-lg text-base font-medium text-stage-300 hover:text-brand-400 hover:bg-stage-800/50 transition-all"])}">${ssrInterpolate(item.label)} <svg class="${ssrRenderClass([{ "rotate-180": unref(activeAccordion) === item.id }, "site-header__mobile-accordion-icon w-5 h-5 transition-transform duration-200"])}" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M19 9l-7 7-7-7"></path></svg></button>`);
            if (unref(activeAccordion) === item.id) {
              _push(`<div class="site-header__mobile-accordion-content pl-4 mt-1 space-y-1"><!--[-->`);
              ssrRenderList(item.children, (child) => {
                _push(ssrRenderComponent(_component_NuxtLink, {
                  key: child.id,
                  to: child.url || "#",
                  class: "site-header__mobile-accordion-link block px-4 py-2.5 rounded-lg text-sm font-medium text-stage-400 hover:text-brand-400 hover:bg-stage-800/30 transition-all",
                  "active-class": "site-header__mobile-accordion-link--active !text-brand-400",
                  onClick: ($event) => isMenuOpen.value = false
                }, {
                  default: withCtx((_, _push2, _parent2, _scopeId) => {
                    if (_push2) {
                      _push2(`${ssrInterpolate(child.label)}`);
                    } else {
                      return [
                        createTextVNode(toDisplayString(child.label), 1)
                      ];
                    }
                  }),
                  _: 2
                }, _parent));
              });
              _push(`<!--]--></div>`);
            } else {
              _push(`<!---->`);
            }
            _push(`<!--]-->`);
          }
          _push(`</div>`);
        });
        _push(`<!--]-->`);
        if (unref(siteSettings)?.header_cta) {
          _push(ssrRenderComponent(_component_NuxtLink, {
            to: unref(siteSettings).header_cta_url || "/",
            target: unref(siteSettings).header_cta_url?.startsWith("http") ? "_blank" : void 0,
            class: "site-header__mobile-cta btn-primary w-full mt-4",
            onClick: ($event) => isMenuOpen.value = false
          }, {
            default: withCtx((_, _push2, _parent2, _scopeId) => {
              if (_push2) {
                _push2(`${ssrInterpolate(unref(siteSettings).header_cta)}`);
              } else {
                return [
                  createTextVNode(toDisplayString(unref(siteSettings).header_cta), 1)
                ];
              }
            }),
            _: 1
          }, _parent));
        } else {
          _push(`<!---->`);
        }
        _push(`</div>`);
      } else {
        _push(`<!---->`);
      }
      _push(`</div></header><div class="site-header__spacer h-16 lg:h-20"></div><!--]-->`);
    };
  }
});
const _sfc_setup$2 = _sfc_main$2.setup;
_sfc_main$2.setup = (props, ctx) => {
  const ssrContext = useSSRContext();
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("components/SiteHeader.vue");
  return _sfc_setup$2 ? _sfc_setup$2(props, ctx) : void 0;
};
const __nuxt_component_0 = Object.assign(_sfc_main$2, { __name: "SiteHeader" });
const _sfc_main$1 = /* @__PURE__ */ defineComponent({
  __name: "SiteFooter",
  __ssrInlineRender: true,
  setup(__props) {
    const currentYear = (/* @__PURE__ */ new Date()).getFullYear();
    return (_ctx, _push, _parent, _attrs) => {
      const _component_NuxtLink = __nuxt_component_0$1;
      _push(`<footer${ssrRenderAttrs(mergeProps({
        class: "site-footer border-t border-stage-800/60 bg-stage-950",
        id: "site-footer"
      }, _attrs))}><div class="site-footer__container max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16"><div class="site-footer__grid grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 gap-10"><div class="site-footer__brand lg:col-span-1">`);
      _push(ssrRenderComponent(_component_NuxtLink, {
        to: "/",
        class: "site-footer__logo flex items-center gap-3 group mb-4"
      }, {
        default: withCtx((_, _push2, _parent2, _scopeId) => {
          if (_push2) {
            _push2(`<img${ssrRenderAttr("src", _imports_0)} alt="Flux Theatre Ensemble" class="h-10 w-auto group-hover:opacity-90 transition-opacity"${_scopeId}>`);
          } else {
            return [
              createVNode("img", {
                src: _imports_0,
                alt: "Flux Theatre Ensemble",
                class: "h-10 w-auto group-hover:opacity-90 transition-opacity"
              })
            ];
          }
        }),
        _: 1
      }, _parent));
      _push(`<p class="site-footer__tagline text-stage-400 text-sm leading-relaxed"> Consenus-driven, artist-led, and community-focused theatre in New York City and beyond. </p></div><div class="site-footer__links"><h4 class="site-footer__title text-stage-200 font-sans font-semibold text-sm uppercase tracking-wider mb-4">Explore</h4><ul class="site-footer__list space-y-2"><!--[-->`);
      ssrRenderList([
        { label: "Current Season", to: "/productions" },
        { label: "Past Productions", to: "/productions?filter=past" },
        { label: "News & Blog", to: "/news" }
      ], (link) => {
        _push(`<li class="site-footer__item">`);
        _push(ssrRenderComponent(_component_NuxtLink, {
          to: link.to,
          class: "site-footer__link text-stage-400 text-sm hover:text-brand-400 transition-colors"
        }, {
          default: withCtx((_, _push2, _parent2, _scopeId) => {
            if (_push2) {
              _push2(`${ssrInterpolate(link.label)}`);
            } else {
              return [
                createTextVNode(toDisplayString(link.label), 1)
              ];
            }
          }),
          _: 2
        }, _parent));
        _push(`</li>`);
      });
      _push(`<!--]--></ul></div><div class="site-footer__links"><h4 class="site-footer__title text-stage-200 font-sans font-semibold text-sm uppercase tracking-wider mb-4">Support</h4><ul class="site-footer__list space-y-2"><!--[-->`);
      ssrRenderList([
        { label: "Donate", to: "/donate" },
        { label: "Contact", to: "/contact" }
      ], (link) => {
        _push(`<li class="site-footer__item">`);
        _push(ssrRenderComponent(_component_NuxtLink, {
          to: link.to,
          class: "site-footer__link text-stage-400 text-sm hover:text-brand-400 transition-colors"
        }, {
          default: withCtx((_, _push2, _parent2, _scopeId) => {
            if (_push2) {
              _push2(`${ssrInterpolate(link.label)}`);
            } else {
              return [
                createTextVNode(toDisplayString(link.label), 1)
              ];
            }
          }),
          _: 2
        }, _parent));
        _push(`</li>`);
      });
      _push(`<!--]--></ul></div><div class="site-footer__connect"><h4 class="site-footer__title text-stage-200 font-sans font-semibold text-sm uppercase tracking-wider mb-4">Connect</h4><div class="site-footer__social-links flex gap-3"><!--[-->`);
      ssrRenderList([
        { label: "Instagram", icon: "M7.5 2h9A5.5 5.5 0 0122 7.5v9a5.5 5.5 0 01-5.5 5.5h-9A5.5 5.5 0 012 16.5v-9A5.5 5.5 0 017.5 2zm4.5 5a5 5 0 100 10 5 5 0 000-10zm0 2a3 3 0 110 6 3 3 0 010-6zm5.25-2.5a1.25 1.25 0 110 2.5 1.25 1.25 0 010-2.5z", href: "https://instagram.com/flux.theatre" },
        { label: "Facebook", icon: "M18 2h-3a5 5 0 00-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 011-1h3z", href: "https://facebook.com/fluxtheatre" },
        { label: "BlueSky", viewBox: "0 0 600 530", icon: "m135.72 44.03c164.28 116.1 164.28 205.15 164.28 205.15s0-89.05 164.28-205.15c66.52-46.7 138.85-23.75 135.29 81.33-4.32 138.65-81.82 170.82-132.89 181.76-118.8 25.43-166.68 152.05-166.68 152.05s-47.88-126.62-166.68-152.05c-51.07-10.94-128.57-43.11-132.89-181.76-3.56-105.08 68.77-128.03 135.29-81.33z", href: "https://bsky.app/profile/fluxtheatre.bsky.social" }
      ], (social) => {
        _push(`<a${ssrRenderAttr("href", social.href)}${ssrRenderAttr("aria-label", social.label)} class="site-footer__social-link w-10 h-10 rounded-lg bg-stage-800/60 flex items-center justify-center text-stage-400 hover:text-brand-400 hover:bg-stage-800 transition-all"><svg class="site-footer__social-icon w-5 h-5" fill="currentColor"${ssrRenderAttr("viewBox", social.viewBox || "0 0 24 24")}><path${ssrRenderAttr("d", social.icon)}></path></svg></a>`);
      });
      _push(`<!--]--></div><p class="site-footer__subscribe text-stage-500 text-xs mt-6"> Mailing list, auditions, and more — <a href="#" class="site-footer__link--inline underline hover:text-brand-400 transition-colors">subscribe here</a>. </p></div></div><div class="site-footer__bottom mt-12 pt-8 border-t border-stage-800/60 flex flex-col sm:flex-row items-center justify-between gap-4"><p class="site-footer__copyright text-stage-500 text-xs"> © ${ssrInterpolate(unref(currentYear))} Flux Theatre Ensemble. All rights reserved. </p><div class="site-footer__legal flex gap-4 text-xs text-stage-500">`);
      _push(ssrRenderComponent(_component_NuxtLink, {
        to: "/privacy",
        class: "site-footer__legal-link hover:text-stage-300 transition-colors"
      }, {
        default: withCtx((_, _push2, _parent2, _scopeId) => {
          if (_push2) {
            _push2(`Privacy Policy`);
          } else {
            return [
              createTextVNode("Privacy Policy")
            ];
          }
        }),
        _: 1
      }, _parent));
      _push(ssrRenderComponent(_component_NuxtLink, {
        to: "/accessibility",
        class: "site-footer__legal-link hover:text-stage-300 transition-colors"
      }, {
        default: withCtx((_, _push2, _parent2, _scopeId) => {
          if (_push2) {
            _push2(`Accessibility`);
          } else {
            return [
              createTextVNode("Accessibility")
            ];
          }
        }),
        _: 1
      }, _parent));
      _push(`</div></div></div></footer>`);
    };
  }
});
const _sfc_setup$1 = _sfc_main$1.setup;
_sfc_main$1.setup = (props, ctx) => {
  const ssrContext = useSSRContext();
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("components/SiteFooter.vue");
  return _sfc_setup$1 ? _sfc_setup$1(props, ctx) : void 0;
};
const __nuxt_component_1 = Object.assign(_sfc_main$1, { __name: "SiteFooter" });
const _sfc_main = {};
function _sfc_ssrRender(_ctx, _push, _parent, _attrs) {
  const _component_SiteHeader = __nuxt_component_0;
  const _component_SiteFooter = __nuxt_component_1;
  _push(`<div${ssrRenderAttrs(mergeProps({ class: "default-layout min-h-screen flex flex-col" }, _attrs))}>`);
  _push(ssrRenderComponent(_component_SiteHeader, null, null, _parent));
  _push(`<main class="default-layout__main flex-1">`);
  ssrRenderSlot(_ctx.$slots, "default", {}, null, _push, _parent);
  _push(`</main>`);
  _push(ssrRenderComponent(_component_SiteFooter, null, null, _parent));
  _push(`</div>`);
}
const _sfc_setup = _sfc_main.setup;
_sfc_main.setup = (props, ctx) => {
  const ssrContext = useSSRContext();
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("layouts/default.vue");
  return _sfc_setup ? _sfc_setup(props, ctx) : void 0;
};
const _default = /* @__PURE__ */ _export_sfc(_sfc_main, [["ssrRender", _sfc_ssrRender]]);

export { _default as default };
//# sourceMappingURL=default-CQyMUO6M.mjs.map
