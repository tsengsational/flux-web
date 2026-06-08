import { _ as __nuxt_component_0 } from './nuxt-link-cZpXnfBZ.mjs';
import { defineComponent, computed, mergeProps, withCtx, unref, createVNode, openBlock, createBlock, toDisplayString, createTextVNode, createCommentVNode, Fragment, renderList, useSSRContext } from 'vue';
import { ssrRenderComponent, ssrRenderAttrs, ssrInterpolate, ssrRenderClass, ssrRenderList } from 'vue/server-renderer';
import { formatInTimeZone } from 'date-fns-tz';
import { u as useDirectus } from './asyncData-BxKqmOFY.mjs';

const _sfc_main = /* @__PURE__ */ defineComponent({
  __name: "EventCard",
  __ssrInlineRender: true,
  props: {
    event: {}
  },
  setup(__props) {
    const props = __props;
    const { getImageProps } = useDirectus();
    const nyDate = computed(() => {
      return formatInTimeZone(new Date(props.event.start_datetime), "America/New_York", "EEE, MMM d");
    });
    const nyTime = computed(() => {
      return formatInTimeZone(new Date(props.event.start_datetime), "America/New_York", "h:mm a");
    });
    const localTime = computed(() => {
      return null;
    });
    const showLocalTime = computed(() => {
      if (!localTime.value) return false;
      const nyTimeOnly = nyTime.value.toLowerCase().replace(/\s/g, "");
      const localTimeOnly = localTime.value.toLowerCase().split(" ").slice(0, 2).join("").replace(/\s/g, "");
      return nyTimeOnly !== localTimeOnly;
    });
    const formatLabel = computed(() => {
      const labels = {
        in_person: "In Person",
        digital: "Digital",
        hybrid: "Hybrid"
      };
      return labels[props.event.format];
    });
    const formatIcon = computed(() => {
      if (props.event.format === "digital") return "digital";
      if (props.event.format === "hybrid") return "hybrid";
      return "in_person";
    });
    const categoryLabel = computed(() => {
      const labels = {
        workshop: "Workshop",
        reading: "Reading",
        talkback: "Talkback",
        fundraiser: "Fundraiser",
        social: "Social",
        audition: "Audition",
        masterclass: "Masterclass",
        community: "Community",
        other: "Event",
        performance: "Performance"
      };
      return labels[props.event.category];
    });
    const eventTags = computed(() => {
      if (!props.event.tags) return [];
      return props.event.tags.map((t) => typeof t.tags_id === "object" ? t.tags_id.name : null).filter(Boolean);
    });
    return (_ctx, _push, _parent, _attrs) => {
      const _component_NuxtLink = __nuxt_component_0;
      _push(ssrRenderComponent(_component_NuxtLink, mergeProps({
        to: `/events/${__props.event.slug}`,
        class: "event-card card-glass group block",
        id: `event-card-${__props.event.slug}`
      }, _attrs), {
        default: withCtx((_, _push2, _parent2, _scopeId) => {
          if (_push2) {
            _push2(`<div class="event-card__image-container relative aspect-video bg-stage-800 overflow-hidden"${_scopeId}>`);
            if (__props.event.cover_image) {
              _push2(`<img${ssrRenderAttrs(mergeProps(unref(getImageProps)(__props.event.cover_image, { sm: 400, md: 600 }), {
                alt: __props.event.title,
                class: "event-card__image w-full h-full object-cover transition-transform duration-500 group-hover:scale-105",
                loading: "lazy"
              }))}${_scopeId}>`);
            } else {
              _push2(`<div class="event-card__placeholder w-full h-full flex items-center justify-center bg-gradient-to-br from-curtain-700/20 to-stage-900"${_scopeId}><svg class="event-card__placeholder-icon w-12 h-12 text-stage-600" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="1"${_scopeId}><path stroke-linecap="round" stroke-linejoin="round" d="M6.75 3v2.25M17.25 3v2.25M3 18.75V7.5a2.25 2.25 0 012.25-2.25h13.5A2.25 2.25 0 0121 7.5v11.25m-18 0A2.25 2.25 0 005.25 21h13.5A2.25 2.25 0 0021 18.75m-18 0v-7.5A2.25 2.25 0 015.25 9h13.5A2.25 2.25 0 0121 11.25v7.5"${_scopeId}></path></svg></div>`);
            }
            _push2(`<div class="event-card__badges absolute top-3 left-3 flex gap-2"${_scopeId}><span class="event-card__category px-2.5 py-1 rounded-full text-xs font-bold bg-brand-600 text-white shadow-sm"${_scopeId}>${ssrInterpolate(unref(categoryLabel))}</span><span class="${ssrRenderClass([{
              "event-card__format--digital bg-blue-600 text-white": __props.event.format === "digital",
              "event-card__format--hybrid bg-purple-600 text-white": __props.event.format === "hybrid",
              "event-card__format--in-person bg-stage-900 text-stage-100": __props.event.format === "in_person"
            }, "event-card__format px-2.5 py-1 rounded-full text-xs font-bold shadow-sm"])}"${_scopeId}><span class="event-card__format-label inline-flex items-center gap-1"${_scopeId}>`);
            if (unref(formatIcon) === "digital") {
              _push2(`<svg class="event-card__format-icon w-3 h-3" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2"${_scopeId}><path stroke-linecap="round" stroke-linejoin="round" d="M9 17.25v1.007a3 3 0 01-.879 2.122L7.5 21h9l-.621-.621A3 3 0 0115 18.257V17.25m6-12V15a2.25 2.25 0 01-2.25 2.25H5.25A2.25 2.25 0 013 15V5.25A2.25 2.25 0 015.25 3h13.5A2.25 2.25 0 0121 5.25z"${_scopeId}></path></svg>`);
            } else {
              _push2(`<svg class="event-card__format-icon w-3 h-3" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2"${_scopeId}><path stroke-linecap="round" stroke-linejoin="round" d="M15 10.5a3 3 0 11-6 0 3 3 0 016 0z"${_scopeId}></path><path stroke-linecap="round" stroke-linejoin="round" d="M19.5 10.5c0 7.142-7.5 11.25-7.5 11.25S4.5 17.642 4.5 10.5a7.5 7.5 0 1115 0z"${_scopeId}></path></svg>`);
            }
            _push2(` ${ssrInterpolate(unref(formatLabel))}</span></span></div></div><div class="event-card__info p-5"${_scopeId}><div class="event-card__date-time flex items-start gap-2 text-xs text-brand-700 font-bold mb-2"${_scopeId}><svg class="event-card__time-icon w-3.5 h-3.5 mt-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2.5"${_scopeId}><path stroke-linecap="round" stroke-linejoin="round" d="M12 6v6h4.5m4.5 0a9 9 0 11-18 0 9 9 0 0118 0z"${_scopeId}></path></svg><div class="flex flex-col"${_scopeId}><span${_scopeId}>${ssrInterpolate(unref(nyDate))} · ${ssrInterpolate(unref(nyTime))} ET</span>`);
            if (unref(showLocalTime)) {
              _push2(`<span class="opacity-60 font-medium text-[10px] mt-0.5"${_scopeId}>${ssrInterpolate(unref(localTime))}</span>`);
            } else {
              _push2(`<!---->`);
            }
            _push2(`</div></div><h3 class="event-card__title text-lg font-serif font-bold text-stage-950 group-hover:text-brand-400 transition-colors line-clamp-2"${_scopeId}>${ssrInterpolate(__props.event.title)}</h3>`);
            if (__props.event.excerpt) {
              _push2(`<p class="event-card__excerpt text-sm text-stage-700 mt-2 leading-relaxed line-clamp-2"${_scopeId}>${ssrInterpolate(__props.event.excerpt)}</p>`);
            } else {
              _push2(`<!---->`);
            }
            if (unref(eventTags).length) {
              _push2(`<div class="event-card__tags mt-3 flex flex-wrap gap-1.5"${_scopeId}><!--[-->`);
              ssrRenderList(unref(eventTags), (tag) => {
                _push2(`<span class="event-card__tag text-[10px] px-2 py-0.5 rounded-full bg-stage-50 text-stage-700 border border-stage-200 font-bold"${_scopeId}>${ssrInterpolate(tag)}</span>`);
              });
              _push2(`<!--]--></div>`);
            } else {
              _push2(`<!---->`);
            }
            _push2(`<div class="event-card__footer mt-3 flex items-center justify-between text-xs text-stage-700 font-medium"${_scopeId}>`);
            if (__props.event.venue) {
              _push2(`<span class="event-card__location flex items-center gap-1"${_scopeId}><svg class="event-card__location-icon w-3 h-3" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2"${_scopeId}><path stroke-linecap="round" stroke-linejoin="round" d="M15 10.5a3 3 0 11-6 0 3 3 0 016 0z"${_scopeId}></path><path stroke-linecap="round" stroke-linejoin="round" d="M19.5 10.5c0 7.142-7.5 11.25-7.5 11.25S4.5 17.642 4.5 10.5a7.5 7.5 0 1115 0z"${_scopeId}></path></svg> ${ssrInterpolate(typeof __props.event.venue === "string" ? __props.event.venue : __props.event.venue.name)}</span>`);
            } else if (__props.event.format === "digital") {
              _push2(`<span class="event-card__online flex items-center gap-1 text-blue-400"${_scopeId}><svg class="event-card__online-icon w-3 h-3" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2"${_scopeId}><path stroke-linecap="round" stroke-linejoin="round" d="M13.19 8.688a4.5 4.5 0 011.242 7.244l-4.5 4.5a4.5 4.5 0 01-6.364-6.364l1.757-1.757m9.86-2.63a4.5 4.5 0 00-6.364-6.364L4.5 8.257"${_scopeId}></path></svg> Online </span>`);
            } else {
              _push2(`<!---->`);
            }
            _push2(`<span class="event-card__price"${_scopeId}>${ssrInterpolate(__props.event.is_free ? "Free" : __props.event.price || "See Details")}</span></div></div>`);
          } else {
            return [
              createVNode("div", { class: "event-card__image-container relative aspect-video bg-stage-800 overflow-hidden" }, [
                __props.event.cover_image ? (openBlock(), createBlock("img", mergeProps({ key: 0 }, unref(getImageProps)(__props.event.cover_image, { sm: 400, md: 600 }), {
                  alt: __props.event.title,
                  class: "event-card__image w-full h-full object-cover transition-transform duration-500 group-hover:scale-105",
                  loading: "lazy"
                }), null, 16, ["alt"])) : (openBlock(), createBlock("div", {
                  key: 1,
                  class: "event-card__placeholder w-full h-full flex items-center justify-center bg-gradient-to-br from-curtain-700/20 to-stage-900"
                }, [
                  (openBlock(), createBlock("svg", {
                    class: "event-card__placeholder-icon w-12 h-12 text-stage-600",
                    fill: "none",
                    viewBox: "0 0 24 24",
                    stroke: "currentColor",
                    "stroke-width": "1"
                  }, [
                    createVNode("path", {
                      "stroke-linecap": "round",
                      "stroke-linejoin": "round",
                      d: "M6.75 3v2.25M17.25 3v2.25M3 18.75V7.5a2.25 2.25 0 012.25-2.25h13.5A2.25 2.25 0 0121 7.5v11.25m-18 0A2.25 2.25 0 005.25 21h13.5A2.25 2.25 0 0021 18.75m-18 0v-7.5A2.25 2.25 0 015.25 9h13.5A2.25 2.25 0 0121 11.25v7.5"
                    })
                  ]))
                ])),
                createVNode("div", { class: "event-card__badges absolute top-3 left-3 flex gap-2" }, [
                  createVNode("span", { class: "event-card__category px-2.5 py-1 rounded-full text-xs font-bold bg-brand-600 text-white shadow-sm" }, toDisplayString(unref(categoryLabel)), 1),
                  createVNode("span", {
                    class: ["event-card__format px-2.5 py-1 rounded-full text-xs font-bold shadow-sm", {
                      "event-card__format--digital bg-blue-600 text-white": __props.event.format === "digital",
                      "event-card__format--hybrid bg-purple-600 text-white": __props.event.format === "hybrid",
                      "event-card__format--in-person bg-stage-900 text-stage-100": __props.event.format === "in_person"
                    }]
                  }, [
                    createVNode("span", { class: "event-card__format-label inline-flex items-center gap-1" }, [
                      unref(formatIcon) === "digital" ? (openBlock(), createBlock("svg", {
                        key: 0,
                        class: "event-card__format-icon w-3 h-3",
                        fill: "none",
                        viewBox: "0 0 24 24",
                        stroke: "currentColor",
                        "stroke-width": "2"
                      }, [
                        createVNode("path", {
                          "stroke-linecap": "round",
                          "stroke-linejoin": "round",
                          d: "M9 17.25v1.007a3 3 0 01-.879 2.122L7.5 21h9l-.621-.621A3 3 0 0115 18.257V17.25m6-12V15a2.25 2.25 0 01-2.25 2.25H5.25A2.25 2.25 0 013 15V5.25A2.25 2.25 0 015.25 3h13.5A2.25 2.25 0 0121 5.25z"
                        })
                      ])) : (openBlock(), createBlock("svg", {
                        key: 1,
                        class: "event-card__format-icon w-3 h-3",
                        fill: "none",
                        viewBox: "0 0 24 24",
                        stroke: "currentColor",
                        "stroke-width": "2"
                      }, [
                        createVNode("path", {
                          "stroke-linecap": "round",
                          "stroke-linejoin": "round",
                          d: "M15 10.5a3 3 0 11-6 0 3 3 0 016 0z"
                        }),
                        createVNode("path", {
                          "stroke-linecap": "round",
                          "stroke-linejoin": "round",
                          d: "M19.5 10.5c0 7.142-7.5 11.25-7.5 11.25S4.5 17.642 4.5 10.5a7.5 7.5 0 1115 0z"
                        })
                      ])),
                      createTextVNode(" " + toDisplayString(unref(formatLabel)), 1)
                    ])
                  ], 2)
                ])
              ]),
              createVNode("div", { class: "event-card__info p-5" }, [
                createVNode("div", { class: "event-card__date-time flex items-start gap-2 text-xs text-brand-700 font-bold mb-2" }, [
                  (openBlock(), createBlock("svg", {
                    class: "event-card__time-icon w-3.5 h-3.5 mt-0.5",
                    fill: "none",
                    viewBox: "0 0 24 24",
                    stroke: "currentColor",
                    "stroke-width": "2.5"
                  }, [
                    createVNode("path", {
                      "stroke-linecap": "round",
                      "stroke-linejoin": "round",
                      d: "M12 6v6h4.5m4.5 0a9 9 0 11-18 0 9 9 0 0118 0z"
                    })
                  ])),
                  createVNode("div", { class: "flex flex-col" }, [
                    createVNode("span", null, toDisplayString(unref(nyDate)) + " · " + toDisplayString(unref(nyTime)) + " ET", 1),
                    unref(showLocalTime) ? (openBlock(), createBlock("span", {
                      key: 0,
                      class: "opacity-60 font-medium text-[10px] mt-0.5"
                    }, toDisplayString(unref(localTime)), 1)) : createCommentVNode("", true)
                  ])
                ]),
                createVNode("h3", { class: "event-card__title text-lg font-serif font-bold text-stage-950 group-hover:text-brand-400 transition-colors line-clamp-2" }, toDisplayString(__props.event.title), 1),
                __props.event.excerpt ? (openBlock(), createBlock("p", {
                  key: 0,
                  class: "event-card__excerpt text-sm text-stage-700 mt-2 leading-relaxed line-clamp-2"
                }, toDisplayString(__props.event.excerpt), 1)) : createCommentVNode("", true),
                unref(eventTags).length ? (openBlock(), createBlock("div", {
                  key: 1,
                  class: "event-card__tags mt-3 flex flex-wrap gap-1.5"
                }, [
                  (openBlock(true), createBlock(Fragment, null, renderList(unref(eventTags), (tag) => {
                    return openBlock(), createBlock("span", {
                      key: tag,
                      class: "event-card__tag text-[10px] px-2 py-0.5 rounded-full bg-stage-50 text-stage-700 border border-stage-200 font-bold"
                    }, toDisplayString(tag), 1);
                  }), 128))
                ])) : createCommentVNode("", true),
                createVNode("div", { class: "event-card__footer mt-3 flex items-center justify-between text-xs text-stage-700 font-medium" }, [
                  __props.event.venue ? (openBlock(), createBlock("span", {
                    key: 0,
                    class: "event-card__location flex items-center gap-1"
                  }, [
                    (openBlock(), createBlock("svg", {
                      class: "event-card__location-icon w-3 h-3",
                      fill: "none",
                      viewBox: "0 0 24 24",
                      stroke: "currentColor",
                      "stroke-width": "2"
                    }, [
                      createVNode("path", {
                        "stroke-linecap": "round",
                        "stroke-linejoin": "round",
                        d: "M15 10.5a3 3 0 11-6 0 3 3 0 016 0z"
                      }),
                      createVNode("path", {
                        "stroke-linecap": "round",
                        "stroke-linejoin": "round",
                        d: "M19.5 10.5c0 7.142-7.5 11.25-7.5 11.25S4.5 17.642 4.5 10.5a7.5 7.5 0 1115 0z"
                      })
                    ])),
                    createTextVNode(" " + toDisplayString(typeof __props.event.venue === "string" ? __props.event.venue : __props.event.venue.name), 1)
                  ])) : __props.event.format === "digital" ? (openBlock(), createBlock("span", {
                    key: 1,
                    class: "event-card__online flex items-center gap-1 text-blue-400"
                  }, [
                    (openBlock(), createBlock("svg", {
                      class: "event-card__online-icon w-3 h-3",
                      fill: "none",
                      viewBox: "0 0 24 24",
                      stroke: "currentColor",
                      "stroke-width": "2"
                    }, [
                      createVNode("path", {
                        "stroke-linecap": "round",
                        "stroke-linejoin": "round",
                        d: "M13.19 8.688a4.5 4.5 0 011.242 7.244l-4.5 4.5a4.5 4.5 0 01-6.364-6.364l1.757-1.757m9.86-2.63a4.5 4.5 0 00-6.364-6.364L4.5 8.257"
                      })
                    ])),
                    createTextVNode(" Online ")
                  ])) : createCommentVNode("", true),
                  createVNode("span", { class: "event-card__price" }, toDisplayString(__props.event.is_free ? "Free" : __props.event.price || "See Details"), 1)
                ])
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
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("components/EventCard.vue");
  return _sfc_setup ? _sfc_setup(props, ctx) : void 0;
};
const __nuxt_component_2 = Object.assign(_sfc_main, { __name: "EventCard" });

export { __nuxt_component_2 as _ };
//# sourceMappingURL=EventCard-XmG8E8E7.mjs.map
