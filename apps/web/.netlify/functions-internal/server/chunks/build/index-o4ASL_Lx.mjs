import { _ as __nuxt_component_2 } from './EventCard-XmG8E8E7.mjs';
import { _ as __nuxt_component_0 } from './nuxt-link-cZpXnfBZ.mjs';
import { defineComponent, withAsyncContext, computed, ref, mergeProps, unref, withCtx, createTextVNode, createVNode, openBlock, createBlock, createCommentVNode, toDisplayString, useSSRContext } from 'vue';
import { ssrRenderAttrs, ssrRenderClass, ssrRenderList, ssrInterpolate, ssrRenderComponent } from 'vue/server-renderer';
import { startOfMonth, endOfMonth, startOfWeek, endOfWeek, eachDayOfInterval, format, isSameMonth, isSameDay, isToday } from 'date-fns';
import { toZonedTime, fromZonedTime, formatInTimeZone } from 'date-fns-tz';
import { u as useDirectus, a as useAsyncData } from './asyncData-BxKqmOFY.mjs';
import { _ as _export_sfc } from './server.mjs';
import { R as RRule } from './rruleset-C2NkTWEe.mjs';
import { u as useSeoMeta } from './composables-DOi4jpYZ.mjs';
import '../_/nitro.mjs';
import 'node:http';
import 'node:https';
import 'node:events';
import 'node:buffer';
import 'node:fs';
import 'node:path';
import 'node:crypto';
import '@directus/sdk';
import '../routes/renderer.mjs';
import 'vue-bundle-renderer/runtime';
import 'unhead/server';
import 'devalue';
import 'unhead/plugins';
import 'unhead/utils';
import 'vue-router';

const _sfc_main$1 = /* @__PURE__ */ defineComponent({
  __name: "CalendarView",
  __ssrInlineRender: true,
  props: {
    events: { default: () => [] }
  },
  setup(__props) {
    const props = __props;
    const currentDate = ref(/* @__PURE__ */ new Date());
    const selectedDate = ref(/* @__PURE__ */ new Date());
    const monthStart = computed(() => startOfMonth(currentDate.value));
    const monthEnd = computed(() => endOfMonth(monthStart.value));
    const startDate = computed(() => startOfWeek(monthStart.value));
    const endDate = computed(() => endOfWeek(monthEnd.value));
    const calendarDays = computed(() => {
      return eachDayOfInterval({
        start: startDate.value,
        end: endDate.value
      });
    });
    const getEventsForDay = (day) => {
      return props.events.filter((event) => isSameDay(new Date(event.start_datetime), day));
    };
    const selectedDayEvents = computed(() => getEventsForDay(selectedDate.value));
    const monthYearLabel = computed(() => format(currentDate.value, "MMMM yyyy"));
    const daysOfWeek = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
    const { getImageProps } = useDirectus();
    const getEventTimes = (startDatetime) => {
      const date = new Date(startDatetime);
      const nyTime = formatInTimeZone(date, "America/New_York", "h:mm a");
      let localTime = null;
      let showLocal = false;
      return { nyTime: `${nyTime} ET`, localTime, showLocal };
    };
    return (_ctx, _push, _parent, _attrs) => {
      const _component_NuxtLink = __nuxt_component_0;
      _push(`<div${ssrRenderAttrs(mergeProps({ class: "calendar-view bg-stage-950 rounded-3xl border border-stage-800 overflow-hidden shadow-2xl" }, _attrs))} data-v-54de1e23><div class="calendar-view__container flex flex-col lg:flex-row h-full lg:min-h-[600px]" data-v-54de1e23><div class="calendar-view__grid-side flex-grow p-6 lg:p-8 border-b lg:border-b-0 lg:border-r border-stage-800/60 bg-stage-900/30" data-v-54de1e23><div class="calendar-view__header flex items-center justify-between mb-8" data-v-54de1e23><h2 class="calendar-view__month text-2xl font-serif font-bold text-white" data-v-54de1e23>${ssrInterpolate(unref(monthYearLabel))}</h2><div class="calendar-view__controls flex gap-2" data-v-54de1e23><button class="w-10 h-10 flex items-center justify-center rounded-full bg-stage-800 text-stage-200 hover:text-brand-400 hover:bg-stage-700 transition-all border border-stage-700/50" data-v-54de1e23><svg class="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" data-v-54de1e23><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 19l-7-7 7-7" data-v-54de1e23></path></svg></button><button class="w-10 h-10 flex items-center justify-center rounded-full bg-stage-800 text-stage-200 hover:text-brand-400 hover:bg-stage-700 transition-all border border-stage-700/50" data-v-54de1e23><svg class="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" data-v-54de1e23><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5l7 7-7 7" data-v-54de1e23></path></svg></button></div></div><div class="calendar-view__weekdays grid grid-cols-7 mb-4" data-v-54de1e23><!--[-->`);
      ssrRenderList(daysOfWeek, (day) => {
        _push(`<div class="text-center text-[10px] uppercase tracking-widest font-black text-stage-400 py-2" data-v-54de1e23>${ssrInterpolate(day)}</div>`);
      });
      _push(`<!--]--></div><div class="calendar-view__days grid grid-cols-7 gap-1 lg:gap-2" data-v-54de1e23><!--[-->`);
      ssrRenderList(unref(calendarDays), (day) => {
        _push(`<button class="${ssrRenderClass([[
          !unref(isSameMonth)(day, unref(monthStart)) ? "opacity-10 pointer-events-none" : "hover:bg-stage-800",
          unref(isSameDay)(day, unref(selectedDate)) ? "bg-brand-500/20 ring-2 ring-brand-500/80 text-white" : "text-stage-100",
          unref(isToday)(day) && !unref(isSameDay)(day, unref(selectedDate)) ? "text-brand-400 font-black ring-1 ring-brand-500/30" : ""
        ], "calendar-view__day min-h-[80px] lg:min-h-[110px] rounded-xl flex flex-col items-start p-2 relative transition-all duration-200 group"])}" data-v-54de1e23><span class="text-xs z-10 relative font-bold mb-1.5 opacity-60 group-hover:opacity-100" data-v-54de1e23>${ssrInterpolate(unref(format)(day, "d"))}</span>`);
        if (getEventsForDay(day).length > 0) {
          _push(`<div class="w-full flex flex-col gap-1 overflow-hidden pointer-events-none" data-v-54de1e23><!--[-->`);
          ssrRenderList(getEventsForDay(day).slice(0, 2), (ev) => {
            _push(`<div class="text-[9px] lg:text-[10px] leading-tight px-1 py-0.5 rounded bg-brand-500/10 text-brand-400 border-l-2 border-brand-500 truncate w-full text-left" data-v-54de1e23>${ssrInterpolate(ev.title)}</div>`);
          });
          _push(`<!--]-->`);
          if (getEventsForDay(day).length > 2) {
            _push(`<div class="text-[8px] lg:text-[9px] text-stage-500 font-bold px-1 mt-0.5" data-v-54de1e23> +${ssrInterpolate(getEventsForDay(day).length - 2)} more </div>`);
          } else {
            _push(`<!---->`);
          }
          _push(`</div>`);
        } else {
          _push(`<!---->`);
        }
        _push(`</button>`);
      });
      _push(`<!--]--></div></div><div class="calendar-view__detail-side lg:w-96 bg-stage-950 p-6 lg:p-8 flex flex-col" data-v-54de1e23><div class="calendar-view__detail-header mb-6" data-v-54de1e23><p class="text-brand-400 font-black text-xs uppercase tracking-widest mb-1" data-v-54de1e23>${ssrInterpolate(unref(format)(unref(selectedDate), "EEEE"))}</p><h3 class="text-xl font-serif font-bold text-white" data-v-54de1e23>${ssrInterpolate(unref(format)(unref(selectedDate), "MMMM do"))}</h3></div><div class="calendar-view__events-list flex-grow space-y-4 overflow-y-auto pr-2 custom-scrollbar" data-v-54de1e23>`);
      if (unref(selectedDayEvents).length === 0) {
        _push(`<div class="flex flex-col items-center justify-center h-40 text-stage-600 text-center opacity-60" data-v-54de1e23><svg class="w-12 h-12 mb-4 opacity-20" fill="none" viewBox="0 0 24 24" stroke="currentColor" data-v-54de1e23><path stroke-linecap="round" stroke-linejoin="round" stroke-width="1" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" data-v-54de1e23></path></svg><p class="text-sm italic" data-v-54de1e23>No events scheduled for this day.</p></div>`);
      } else {
        _push(`<!---->`);
      }
      _push(`<!--[-->`);
      ssrRenderList(unref(selectedDayEvents), (event) => {
        _push(ssrRenderComponent(_component_NuxtLink, {
          key: event.id,
          to: `/events/${event.slug}`,
          class: "calendar-view__event-card block p-4 rounded-2xl bg-stage-800/40 border border-stage-700/30 hover:border-brand-500/50 hover:bg-stage-800/60 transition-all group"
        }, {
          default: withCtx((_, _push2, _parent2, _scopeId) => {
            if (_push2) {
              _push2(`<div class="flex items-start gap-4" data-v-54de1e23${_scopeId}>`);
              if (event.cover_image) {
                _push2(`<div class="w-16 h-16 rounded-xl overflow-hidden flex-shrink-0 bg-stage-800 border border-stage-700/50 shadow-lg" data-v-54de1e23${_scopeId}><img${ssrRenderAttrs(mergeProps({ ref_for: true }, unref(getImageProps)(event.cover_image, { sm: 100 }, { height: 100, fit: "cover" }), {
                  alt: event.title,
                  class: "w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                }))} data-v-54de1e23${_scopeId}></div>`);
              } else {
                _push2(`<!---->`);
              }
              _push2(`<div class="flex-1 min-w-0" data-v-54de1e23${_scopeId}><div class="flex items-start justify-between gap-3" data-v-54de1e23${_scopeId}><div data-v-54de1e23${_scopeId}><span class="inline-block px-2 py-0.5 rounded text-[10px] font-bold uppercase tracking-wider bg-brand-500/10 text-brand-400 mb-2" data-v-54de1e23${_scopeId}>${ssrInterpolate(event.category)}</span><h4 class="text-sm font-bold text-stage-100 group-hover:text-brand-400 transition-colors leading-snug" data-v-54de1e23${_scopeId}>${ssrInterpolate(event.title)}</h4><div class="flex items-start gap-2 mt-2 text-[10px] text-stage-500" data-v-54de1e23${_scopeId}><svg class="w-3 h-3 mt-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" data-v-54de1e23${_scopeId}><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" data-v-54de1e23${_scopeId}></path></svg><div class="flex flex-col" data-v-54de1e23${_scopeId}><span class="font-bold" data-v-54de1e23${_scopeId}>${ssrInterpolate(getEventTimes(event.start_datetime).nyTime)}</span>`);
              if (getEventTimes(event.start_datetime).showLocal) ;
              else {
                _push2(`<!---->`);
              }
              _push2(`</div></div></div><div class="flex-shrink-0 w-8 h-8 rounded-full bg-stage-700/30 flex items-center justify-center text-stage-500 group-hover:text-brand-400 transition-colors" data-v-54de1e23${_scopeId}><svg class="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" data-v-54de1e23${_scopeId}><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5l7 7-7 7" data-v-54de1e23${_scopeId}></path></svg></div></div></div></div>`);
            } else {
              return [
                createVNode("div", { class: "flex items-start gap-4" }, [
                  event.cover_image ? (openBlock(), createBlock("div", {
                    key: 0,
                    class: "w-16 h-16 rounded-xl overflow-hidden flex-shrink-0 bg-stage-800 border border-stage-700/50 shadow-lg"
                  }, [
                    createVNode("img", mergeProps({ ref_for: true }, unref(getImageProps)(event.cover_image, { sm: 100 }, { height: 100, fit: "cover" }), {
                      alt: event.title,
                      class: "w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                    }), null, 16, ["alt"])
                  ])) : createCommentVNode("", true),
                  createVNode("div", { class: "flex-1 min-w-0" }, [
                    createVNode("div", { class: "flex items-start justify-between gap-3" }, [
                      createVNode("div", null, [
                        createVNode("span", { class: "inline-block px-2 py-0.5 rounded text-[10px] font-bold uppercase tracking-wider bg-brand-500/10 text-brand-400 mb-2" }, toDisplayString(event.category), 1),
                        createVNode("h4", { class: "text-sm font-bold text-stage-100 group-hover:text-brand-400 transition-colors leading-snug" }, toDisplayString(event.title), 1),
                        createVNode("div", { class: "flex items-start gap-2 mt-2 text-[10px] text-stage-500" }, [
                          (openBlock(), createBlock("svg", {
                            class: "w-3 h-3 mt-0.5",
                            fill: "none",
                            viewBox: "0 0 24 24",
                            stroke: "currentColor"
                          }, [
                            createVNode("path", {
                              "stroke-linecap": "round",
                              "stroke-linejoin": "round",
                              "stroke-width": "2",
                              d: "M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"
                            })
                          ])),
                          createVNode("div", { class: "flex flex-col" }, [
                            createVNode("span", { class: "font-bold" }, toDisplayString(getEventTimes(event.start_datetime).nyTime), 1),
                            getEventTimes(event.start_datetime).showLocal ? (openBlock(), createBlock("span", {
                              key: 0,
                              class: "opacity-60 italic text-[9px] mt-0.5"
                            }, toDisplayString(getEventTimes(event.start_datetime).localTime), 1)) : createCommentVNode("", true)
                          ])
                        ])
                      ]),
                      createVNode("div", { class: "flex-shrink-0 w-8 h-8 rounded-full bg-stage-700/30 flex items-center justify-center text-stage-500 group-hover:text-brand-400 transition-colors" }, [
                        (openBlock(), createBlock("svg", {
                          class: "w-4 h-4",
                          fill: "none",
                          viewBox: "0 0 24 24",
                          stroke: "currentColor"
                        }, [
                          createVNode("path", {
                            "stroke-linecap": "round",
                            "stroke-linejoin": "round",
                            "stroke-width": "2",
                            d: "M9 5l7 7-7 7"
                          })
                        ]))
                      ])
                    ])
                  ])
                ])
              ];
            }
          }),
          _: 2
        }, _parent));
      });
      _push(`<!--]--></div></div></div></div>`);
    };
  }
});
const _sfc_setup$1 = _sfc_main$1.setup;
_sfc_main$1.setup = (props, ctx) => {
  const ssrContext = useSSRContext();
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("components/CalendarView.vue");
  return _sfc_setup$1 ? _sfc_setup$1(props, ctx) : void 0;
};
const __nuxt_component_1 = /* @__PURE__ */ Object.assign(_export_sfc(_sfc_main$1, [["__scopeId", "data-v-54de1e23"]]), { __name: "CalendarView" });
const timeZone = "America/New_York";
const _sfc_main = /* @__PURE__ */ defineComponent({
  __name: "index",
  __ssrInlineRender: true,
  async setup(__props) {
    let __temp, __restore;
    useSeoMeta({
      title: "Events — Flux Theatre Ensemble",
      description: "Workshops, readings, talkbacks, fundraisers, and community events from Flux Theatre Ensemble — in person and online."
    });
    const { client, readItems } = useDirectus();
    const { data: cmsEvents, error } = ([__temp, __restore] = withAsyncContext(() => useAsyncData(
      "events-list-v1",
      () => client.request(readItems("events", {
        filter: {
          status: { _eq: "published" }
        },
        fields: [
          "*",
          "is_recurring",
          "recurrence_rule",
          { venue: ["name"] },
          { tags: ["*", { tags_id: ["*"] }] }
        ],
        sort: ["start_datetime"]
      }))
    )), __temp = await __temp, __restore(), __temp);
    const events = computed(() => {
      if (!cmsEvents.value) return [];
      const expanded = [];
      const now = /* @__PURE__ */ new Date();
      const threeMonthsLater = new Date(now.getTime() + 90 * 24 * 60 * 60 * 1e3);
      cmsEvents.value.forEach((ev) => {
        if (ev.is_recurring && ev.recurrence_rule) {
          try {
            const dtstart = toZonedTime(new Date(ev.start_datetime), timeZone);
            const year = dtstart.getFullYear();
            const month = dtstart.getMonth() + 1;
            const day = dtstart.getDate();
            const hour = dtstart.getHours();
            const min = dtstart.getMinutes();
            const sec = dtstart.getSeconds();
            const pad = (n) => n.toString().padStart(2, "0");
            const dtstartStr = `${year}${pad(month)}${pad(day)}T${pad(hour)}${pad(min)}${pad(sec)}`;
            const rule = RRule.fromString(`DTSTART:${dtstartStr}
RRULE:${ev.recurrence_rule}`);
            const occurrences = rule.between(dtstart > now ? dtstart : now, threeMonthsLater, true);
            occurrences.forEach((date) => {
              const utcDate = fromZonedTime(date, timeZone);
              expanded.push({
                ...ev,
                id: `${ev.id}-${utcDate.getTime()}`,
                start_datetime: utcDate.toISOString(),
                // Calculate end date based on original duration
                end_datetime: ev.end_datetime ? new Date(utcDate.getTime() + (new Date(ev.end_datetime).getTime() - new Date(ev.start_datetime).getTime())).toISOString() : null
              });
            });
          } catch (e) {
            console.error("RRule Error:", e);
            expanded.push(ev);
          }
        } else {
          if (new Date(ev.start_datetime) >= now) {
            expanded.push(ev);
          }
        }
      });
      return expanded.sort((a, b) => new Date(a.start_datetime).getTime() - new Date(b.start_datetime).getTime());
    });
    const activeFormat = ref("all");
    const activeCategory = ref("all");
    const filteredEvents = computed(() => {
      return events.value.filter((e) => {
        const matchesFormat = activeFormat.value === "all" || e.format === activeFormat.value;
        const matchesCategory = activeCategory.value === "all" || e.category === activeCategory.value;
        return matchesFormat && matchesCategory;
      });
    });
    const formatFilters = [
      { label: "All Formats", value: "all" },
      { label: "In Person", value: "in_person" },
      { label: "Digital", value: "digital" },
      { label: "Hybrid", value: "hybrid" }
    ];
    const categoryFilters = [
      { label: "All Types", value: "all" },
      { label: "Workshops", value: "workshop" },
      { label: "Readings", value: "reading" },
      { label: "Talkbacks", value: "talkback" },
      { label: "Fundraisers", value: "fundraiser" },
      { label: "Auditions", value: "audition" },
      { label: "Masterclasses", value: "masterclass" },
      { label: "Community", value: "community" }
    ];
    const viewMode = ref("calendar");
    return (_ctx, _push, _parent, _attrs) => {
      const _component_EventCard = __nuxt_component_2;
      const _component_CalendarView = __nuxt_component_1;
      const _component_NuxtLink = __nuxt_component_0;
      _push(`<div${ssrRenderAttrs(mergeProps({ class: "events-page" }, _attrs))}><section class="events-page__header pt-12 pb-6" id="events-header"><div class="events-page__header-container max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col md:flex-row md:items-end justify-between gap-6"><div><p class="events-page__subtitle text-brand-400 font-medium text-sm uppercase tracking-[0.15em] mb-2">Get Involved</p><h1 class="events-page__title section-heading">Events</h1><p class="events-page__description mt-4 text-stage-400 text-lg max-w-2xl"> Workshops, readings, talkbacks, fundraisers, and more — in person and online. </p></div><div class="events-page__view-toggle flex bg-stage-800/40 p-1 rounded-xl border border-stage-800/60 w-fit self-start"><button class="${ssrRenderClass([unref(viewMode) === "grid" ? "bg-brand-500 text-stage-950 shadow-lg" : "text-stage-400 hover:text-stage-200", "px-4 py-2 rounded-lg text-xs font-bold transition-all flex items-center gap-2"])}"><svg class="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2V6zM14 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2V6zM4 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2v-2zM14 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2v-2z"></path></svg> Grid </button><button class="${ssrRenderClass([unref(viewMode) === "calendar" ? "bg-brand-500 text-stage-950 shadow-lg" : "text-stage-400 hover:text-stage-200", "px-4 py-2 rounded-lg text-xs font-bold transition-all flex items-center gap-2"])}"><svg class="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"></path></svg> Calendar </button></div></div></section>`);
      if (unref(viewMode) === "grid") {
        _push(`<section class="events-page__filters-section pb-8" id="event-filters"><div class="events-page__filters-container max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-4"><div class="events-page__filter-group events-page__filter-group--format flex flex-wrap gap-2"><!--[-->`);
        ssrRenderList(formatFilters, (f) => {
          _push(`<button class="${ssrRenderClass([unref(activeFormat) === f.value ? "bg-brand-500 text-stage-950" : "bg-stage-600/60 text-stage-300 hover:text-stage-200 border border-stage-700/40", "events-page__filter-btn px-3 py-1.5 rounded-full text-xs font-medium transition-all duration-200 text-stage-50"])}">${ssrInterpolate(f.label)}</button>`);
        });
        _push(`<!--]--></div><div class="events-page__filter-group events-page__filter-group--category flex flex-wrap gap-2"><!--[-->`);
        ssrRenderList(categoryFilters, (c) => {
          _push(`<button class="${ssrRenderClass([unref(activeCategory) === c.value ? "bg-brand-500 text-stage-950" : "bg-stage-600/60 text-stage-300 hover:text-stage-200 border border-stage-700/40", "events-page__filter-btn px-3 py-1.5 rounded-full text-xs font-medium transition-all duration-200 text-stage-50"])}">${ssrInterpolate(c.label)}</button>`);
        });
        _push(`<!--]--></div></div></section>`);
      } else {
        _push(`<!---->`);
      }
      _push(`<section class="events-page__main-section pb-24" id="events-content"><div class="events-page__main-container max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">`);
      if (unref(viewMode) === "grid") {
        _push(`<div><div${ssrRenderAttrs({
          class: "events-page__grid grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6",
          "enter-active-class": "transition-all duration-300 ease-out",
          "enter-from-class": "opacity-0 scale-95",
          "enter-to-class": "opacity-100 scale-100",
          "leave-active-class": "transition-all duration-200 ease-in",
          "leave-from-class": "opacity-100 scale-100",
          "leave-to-class": "opacity-0 scale-95"
        })}>`);
        ssrRenderList(unref(filteredEvents), (ev) => {
          _push(ssrRenderComponent(_component_EventCard, {
            key: ev.id,
            event: { ...ev, view_type: "light" },
            class: "events-page__card"
          }, null, _parent));
        });
        _push(`</div>`);
        if (unref(filteredEvents).length === 0) {
          _push(`<p class="events-page__empty-text text-center text-stage-500 py-16 text-lg"> No events match the current filters. </p>`);
        } else {
          _push(`<!---->`);
        }
        _push(`</div>`);
      } else {
        _push(`<div class="events-page__calendar-wrapper">`);
        _push(ssrRenderComponent(_component_CalendarView, { events: unref(events) }, null, _parent));
        _push(`</div>`);
      }
      _push(`<div class="events-page__footer mt-12 flex flex-col sm:flex-row items-center justify-center gap-4">`);
      _push(ssrRenderComponent(_component_NuxtLink, {
        to: "/events/past",
        class: "events-page__past-btn text-sm text-stage-500 hover:text-brand-400 transition-colors",
        id: "view-past-events"
      }, {
        default: withCtx((_, _push2, _parent2, _scopeId) => {
          if (_push2) {
            _push2(` Looking for something else? View Past Events `);
          } else {
            return [
              createTextVNode(" Looking for something else? View Past Events ")
            ];
          }
        }),
        _: 1
      }, _parent));
      _push(`</div></div></section></div>`);
    };
  }
});
const _sfc_setup = _sfc_main.setup;
_sfc_main.setup = (props, ctx) => {
  const ssrContext = useSSRContext();
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("pages/events/index.vue");
  return _sfc_setup ? _sfc_setup(props, ctx) : void 0;
};

export { _sfc_main as default };
//# sourceMappingURL=index-o4ASL_Lx.mjs.map
