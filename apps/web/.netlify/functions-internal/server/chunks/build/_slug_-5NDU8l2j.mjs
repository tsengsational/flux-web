import { _ as __nuxt_component_0 } from './nuxt-link-cZpXnfBZ.mjs';
import { defineComponent, withAsyncContext, computed, unref, mergeProps, withCtx, createVNode, toDisplayString, createTextVNode, openBlock, createBlock, createCommentVNode, useSSRContext } from 'vue';
import { ssrRenderAttrs, ssrInterpolate, ssrRenderAttr, ssrRenderList, ssrRenderComponent } from 'vue/server-renderer';
import { _ as _export_sfc, u as useRoute, c as createError } from './server.mjs';
import { u as useDirectus, a as useAsyncData } from './asyncData-DO9zjVnq.mjs';
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
    const { data: personRecord, error } = ([__temp, __restore] = withAsyncContext(async () => useAsyncData(`person-full-${slug}`, async () => {
      const people = await client.request(readItems("people", {
        filter: { slug: { _eq: slug } },
        limit: 1
      }));
      if (!people.length) return null;
      const person = people[0];
      const [cast, crew] = await Promise.all([
        client.request(readItems("cast_credits", {
          filter: { person: { _eq: person.id } },
          fields: ["role_name", { production: ["title", "slug", "season", "poster_image"] }]
        })),
        client.request(readItems("crew_credits", {
          filter: { person: { _eq: person.id } },
          fields: ["title", "department", { production: ["title", "slug", "season", "poster_image"] }]
        }))
      ]);
      return {
        ...person,
        cast: cast || [],
        crew: crew || [],
        posts: []
        // Temporarily empty until we confirm the field name in the posts collection
      };
    })), __temp = await __temp, __restore(), __temp);
    if (error.value) {
      console.error("Error fetching person data:", error.value);
      throw createError({
        statusCode: 500,
        statusMessage: `Failed to fetch person data: ${error.value.message || "Unknown error"}`
      });
    }
    if (!personRecord.value) {
      throw createError({ statusCode: 404, statusMessage: "Person not found" });
    }
    useSeoMeta({
      title: () => `${personRecord.value?.first_name} ${personRecord.value?.last_name} — Flux Theatre Ensemble`,
      description: () => personRecord.value?.bio?.substring(0, 160) || ""
    });
    const fullName = computed(() => {
      if (!personRecord.value) return "";
      return `${personRecord.value.first_name} ${personRecord.value.last_name}`;
    });
    const hasAnyCredits = computed(() => {
      return (personRecord.value?.cast?.length || 0) > 0 || (personRecord.value?.crew?.length || 0) > 0;
    });
    return (_ctx, _push, _parent, _attrs) => {
      const _component_NuxtLink = __nuxt_component_0;
      if (unref(personRecord)) {
        _push(`<div${ssrRenderAttrs(mergeProps({ class: "person-page pb-24" }, _attrs))} data-v-df23104d><section class="person-page__hero pt-16 pb-12 bg-stage-900" id="person-hero" data-v-df23104d><div class="person-page__hero-container max-w-5xl mx-auto px-4 sm:px-6 lg:px-8" data-v-df23104d><div class="person-page__layout flex flex-col md:flex-row gap-8 lg:gap-12" data-v-df23104d><div class="person-page__image-col w-full md:w-1/3 lg:w-1/4" data-v-df23104d><div class="person-page__image-wrapper aspect-[3/4] rounded-2xl overflow-hidden border border-stage-700/50 shadow-2xl bg-stage-800" data-v-df23104d>`);
        if (unref(personRecord).headshot) {
          _push(`<img${ssrRenderAttrs(mergeProps(unref(getImageProps)(unref(personRecord).headshot, { sm: 400, md: 800 }, { quality: 85 }), {
            alt: unref(fullName),
            class: "person-page__image w-full h-full object-cover"
          }))} data-v-df23104d>`);
        } else {
          _push(`<div class="person-page__image-placeholder w-full h-full flex items-center justify-center text-stage-600" data-v-df23104d><svg class="w-16 h-16" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="1" data-v-df23104d><path stroke-linecap="round" stroke-linejoin="round" d="M15.75 6a3.75 3.75 0 11-7.5 0 3.75 3.75 0 017.5 0zM4.501 20.118a7.5 7.5 0 0114.998 0A17.933 17.933 0 0112 21.75c-2.676 0-5.216-.584-7.499-1.632z" data-v-df23104d></path></svg></div>`);
        }
        _push(`</div></div><div class="person-page__info-col flex-1" data-v-df23104d><div class="person-page__meta flex items-center gap-3 mb-4" data-v-df23104d>`);
        if (unref(personRecord).pronouns) {
          _push(`<span class="person-page__pronouns text-xs font-bold uppercase tracking-wider text-brand-400/80" data-v-df23104d>${ssrInterpolate(unref(personRecord).pronouns)}</span>`);
        } else {
          _push(`<!---->`);
        }
        if (unref(personRecord).pronouns && unref(personRecord).website) {
          _push(`<span class="text-stage-700" data-v-df23104d>•</span>`);
        } else {
          _push(`<!---->`);
        }
        if (unref(personRecord).website) {
          _push(`<a${ssrRenderAttr("href", unref(personRecord).website)} target="_blank" class="person-page__website text-xs text-stage-400 hover:text-brand-400 transition-colors flex items-center gap-1" data-v-df23104d> Website <svg class="w-3 h-3" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2" data-v-df23104d><path stroke-linecap="round" stroke-linejoin="round" d="M13.5 6H5.25A2.25 2.25 0 003 8.25v10.5A2.25 2.25 0 005.25 21h10.5A2.25 2.25 0 0018 18.75V10.5M13.5 6L21 3m0 0h-5.25M21 3v5.25" data-v-df23104d></path></svg></a>`);
        } else {
          _push(`<!---->`);
        }
        _push(`</div><h1 class="person-page__name text-4xl sm:text-5xl font-serif font-bold text-stage-50 mb-6" data-v-df23104d>${ssrInterpolate(unref(fullName))}</h1>`);
        if (unref(personRecord).bio) {
          _push(`<div class="person-page__bio prose prose-invert prose-lg max-w-none text-stage-300" data-v-df23104d><div data-v-df23104d>${unref(personRecord).bio ?? ""}</div></div>`);
        } else {
          _push(`<!---->`);
        }
        _push(`</div></div></div></section>`);
        if (unref(hasAnyCredits)) {
          _push(`<section class="person-page__credits py-20" id="person-credits" data-v-df23104d><div class="person-page__credits-container max-w-5xl mx-auto px-4 sm:px-6 lg:px-8" data-v-df23104d><h2 class="person-page__section-title text-2xl font-serif font-bold text-stage-900 mb-10 pb-4 border-b border-stage-800" data-v-df23104d> Production Credits </h2><div class="person-page__credits-grid grid grid-cols-1 md:grid-cols-2 gap-12" data-v-df23104d>`);
          if (unref(personRecord).cast.length) {
            _push(`<div class="person-page__cast" data-v-df23104d><h3 class="person-page__credit-group-title text-xs font-bold uppercase tracking-[0.2em] text-stage-500 mb-6 font-sans" data-v-df23104d> Acting </h3><ul class="person-page__credit-list space-y-6" data-v-df23104d><!--[-->`);
            ssrRenderList(unref(personRecord).cast, (credit) => {
              _push(`<li class="person-page__credit-item group" data-v-df23104d>`);
              if (credit.production) {
                _push(ssrRenderComponent(_component_NuxtLink, {
                  to: `/productions/${credit.production.slug}`,
                  class: "person-page__credit-link block"
                }, {
                  default: withCtx((_, _push2, _parent2, _scopeId) => {
                    if (_push2) {
                      _push2(`<div class="flex items-center gap-4" data-v-df23104d${_scopeId}><div class="person-page__credit-info flex-1" data-v-df23104d${_scopeId}><p class="person-page__credit-role text-lg font-bold text-stage-900 group-hover:text-brand-400 transition-colors" data-v-df23104d${_scopeId}>${ssrInterpolate(credit.role_name)}</p><p class="person-page__credit-prod text-sm text-stage-600" data-v-df23104d${_scopeId}>${ssrInterpolate(credit.production.title)}</p></div><div class="person-page__credit-meta text-right" data-v-df23104d${_scopeId}><span class="person-page__credit-season text-xs font-medium text-stage-600" data-v-df23104d${_scopeId}>${ssrInterpolate(credit.production.season)}</span></div></div>`);
                    } else {
                      return [
                        createVNode("div", { class: "flex items-center gap-4" }, [
                          createVNode("div", { class: "person-page__credit-info flex-1" }, [
                            createVNode("p", { class: "person-page__credit-role text-lg font-bold text-stage-900 group-hover:text-brand-400 transition-colors" }, toDisplayString(credit.role_name), 1),
                            createVNode("p", { class: "person-page__credit-prod text-sm text-stage-600" }, toDisplayString(credit.production.title), 1)
                          ]),
                          createVNode("div", { class: "person-page__credit-meta text-right" }, [
                            createVNode("span", { class: "person-page__credit-season text-xs font-medium text-stage-600" }, toDisplayString(credit.production.season), 1)
                          ])
                        ])
                      ];
                    }
                  }),
                  _: 2
                }, _parent));
              } else {
                _push(`<!---->`);
              }
              _push(`</li>`);
            });
            _push(`<!--]--></ul></div>`);
          } else {
            _push(`<!---->`);
          }
          if (unref(personRecord).crew.length) {
            _push(`<div class="person-page__crew" data-v-df23104d><h3 class="person-page__credit-group-title text-xs font-bold uppercase tracking-[0.2em] text-stage-500 mb-6 font-sans" data-v-df23104d> Production &amp; Design </h3><ul class="person-page__credit-list space-y-6" data-v-df23104d><!--[-->`);
            ssrRenderList(unref(personRecord).crew, (credit) => {
              _push(`<li class="person-page__credit-item group" data-v-df23104d>`);
              if (credit.production) {
                _push(ssrRenderComponent(_component_NuxtLink, {
                  to: `/productions/${credit.production.slug}`,
                  class: "person-page__credit-link block"
                }, {
                  default: withCtx((_, _push2, _parent2, _scopeId) => {
                    if (_push2) {
                      _push2(`<div class="flex items-center gap-4" data-v-df23104d${_scopeId}><div class="person-page__credit-info flex-1" data-v-df23104d${_scopeId}><p class="person-page__credit-role text-lg font-bold text-stage-900 group-hover:text-brand-400 transition-colors" data-v-df23104d${_scopeId}>${ssrInterpolate(credit.title)}</p><p class="person-page__credit-prod text-sm text-stage-600" data-v-df23104d${_scopeId}>${ssrInterpolate(credit.production.title)}</p></div><div class="person-page__credit-meta text-right" data-v-df23104d${_scopeId}><span class="person-page__credit-season text-xs font-medium text-stage-600" data-v-df23104d${_scopeId}>${ssrInterpolate(credit.production.season)}</span></div></div>`);
                    } else {
                      return [
                        createVNode("div", { class: "flex items-center gap-4" }, [
                          createVNode("div", { class: "person-page__credit-info flex-1" }, [
                            createVNode("p", { class: "person-page__credit-role text-lg font-bold text-stage-900 group-hover:text-brand-400 transition-colors" }, toDisplayString(credit.title), 1),
                            createVNode("p", { class: "person-page__credit-prod text-sm text-stage-600" }, toDisplayString(credit.production.title), 1)
                          ]),
                          createVNode("div", { class: "person-page__credit-meta text-right" }, [
                            createVNode("span", { class: "person-page__credit-season text-xs font-medium text-stage-600" }, toDisplayString(credit.production.season), 1)
                          ])
                        ])
                      ];
                    }
                  }),
                  _: 2
                }, _parent));
              } else {
                _push(`<!---->`);
              }
              _push(`</li>`);
            });
            _push(`<!--]--></ul></div>`);
          } else {
            _push(`<!---->`);
          }
          _push(`</div></div></section>`);
        } else {
          _push(`<!---->`);
        }
        if (unref(personRecord).posts && unref(personRecord).posts.length) {
          _push(`<section class="person-page__posts py-20 bg-stage-900/20" id="person-posts" data-v-df23104d><div class="person-page__posts-container max-w-5xl mx-auto px-4 sm:px-6 lg:px-8" data-v-df23104d><div class="flex items-center justify-between mb-10" data-v-df23104d><h2 class="person-page__section-title text-2xl font-serif font-bold text-stage-100" data-v-df23104d> Recent Writing </h2>`);
          _push(ssrRenderComponent(_component_NuxtLink, {
            to: "/news",
            class: "text-sm text-brand-400 hover:underline"
          }, {
            default: withCtx((_, _push2, _parent2, _scopeId) => {
              if (_push2) {
                _push2(`View All News →`);
              } else {
                return [
                  createTextVNode("View All News →")
                ];
              }
            }),
            _: 1
          }, _parent));
          _push(`</div><div class="person-page__posts-grid grid grid-cols-1 md:grid-cols-3 gap-6" data-v-df23104d><!--[-->`);
          ssrRenderList(unref(personRecord).posts, (post) => {
            _push(ssrRenderComponent(_component_NuxtLink, {
              key: post.slug,
              to: `/news/${post.slug}`,
              class: "person-page__post-card group card-glass p-0 overflow-hidden flex flex-col h-full"
            }, {
              default: withCtx((_, _push2, _parent2, _scopeId) => {
                if (_push2) {
                  _push2(`<div class="aspect-video relative overflow-hidden bg-stage-800" data-v-df23104d${_scopeId}>`);
                  if (post.cover_image_override || post.cover_image) {
                    _push2(`<img${ssrRenderAttrs(mergeProps({ ref_for: true }, unref(getImageProps)(post.cover_image_override || post.cover_image, { sm: 400, md: 600 }, { quality: 80 }), { class: "absolute inset-0 w-full h-full object-cover transition-transform duration-500 group-hover:scale-110" }))} data-v-df23104d${_scopeId}>`);
                  } else {
                    _push2(`<!---->`);
                  }
                  _push2(`</div><div class="p-5 flex-1 flex flex-col" data-v-df23104d${_scopeId}><p class="text-[10px] font-bold uppercase tracking-widest text-stage-500 mb-2" data-v-df23104d${_scopeId}>${ssrInterpolate(new Date(post.publish_date).toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" }))}</p><h3 class="text-lg font-serif font-bold text-stage-100 group-hover:text-brand-400 transition-colors line-clamp-2 mb-3" data-v-df23104d${_scopeId}>${ssrInterpolate(post.title)}</h3><p class="text-sm text-stage-400 line-clamp-2 mb-4 flex-1" data-v-df23104d${_scopeId}>${ssrInterpolate(post.excerpt)}</p><span class="text-xs font-bold text-stage-300 group-hover:text-brand-400 transition-colors" data-v-df23104d${_scopeId}>Read More →</span></div>`);
                } else {
                  return [
                    createVNode("div", { class: "aspect-video relative overflow-hidden bg-stage-800" }, [
                      post.cover_image_override || post.cover_image ? (openBlock(), createBlock("img", mergeProps({
                        key: 0,
                        ref_for: true
                      }, unref(getImageProps)(post.cover_image_override || post.cover_image, { sm: 400, md: 600 }, { quality: 80 }), { class: "absolute inset-0 w-full h-full object-cover transition-transform duration-500 group-hover:scale-110" }), null, 16)) : createCommentVNode("", true)
                    ]),
                    createVNode("div", { class: "p-5 flex-1 flex flex-col" }, [
                      createVNode("p", { class: "text-[10px] font-bold uppercase tracking-widest text-stage-500 mb-2" }, toDisplayString(new Date(post.publish_date).toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" })), 1),
                      createVNode("h3", { class: "text-lg font-serif font-bold text-stage-100 group-hover:text-brand-400 transition-colors line-clamp-2 mb-3" }, toDisplayString(post.title), 1),
                      createVNode("p", { class: "text-sm text-stage-400 line-clamp-2 mb-4 flex-1" }, toDisplayString(post.excerpt), 1),
                      createVNode("span", { class: "text-xs font-bold text-stage-300 group-hover:text-brand-400 transition-colors" }, "Read More →")
                    ])
                  ];
                }
              }),
              _: 2
            }, _parent));
          });
          _push(`<!--]--></div></div></section>`);
        } else {
          _push(`<!---->`);
        }
        _push(`<section class="person-page__cta py-20 border-t border-stage-800/40" data-v-df23104d><div class="max-w-3xl mx-auto px-4 text-center" data-v-df23104d><h2 class="text-2xl font-serif font-bold text-stage-900 mb-4" data-v-df23104d>Support Our Artists</h2><p class="text-stage-400 mb-8 leading-relaxed" data-v-df23104d> Flux Theatre Ensemble is a values-driven creative home for artists like ${ssrInterpolate(unref(personRecord).first_name)}. Your support ensures we can continue to produce transformative, artist-centered work. </p>`);
        _push(ssrRenderComponent(_component_NuxtLink, {
          to: "/donate",
          class: "btn-primary text-brand-400"
        }, {
          default: withCtx((_, _push2, _parent2, _scopeId) => {
            if (_push2) {
              _push2(`Support Flux`);
            } else {
              return [
                createTextVNode("Support Flux")
              ];
            }
          }),
          _: 1
        }, _parent));
        _push(`</div></section></div>`);
      } else {
        _push(`<!---->`);
      }
    };
  }
});
const _sfc_setup = _sfc_main.setup;
_sfc_main.setup = (props, ctx) => {
  const ssrContext = useSSRContext();
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("pages/people/[slug].vue");
  return _sfc_setup ? _sfc_setup(props, ctx) : void 0;
};
const _slug_ = /* @__PURE__ */ _export_sfc(_sfc_main, [["__scopeId", "data-v-df23104d"]]);

export { _slug_ as default };
//# sourceMappingURL=_slug_-5NDU8l2j.mjs.map
