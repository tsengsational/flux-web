import { _ as __nuxt_component_0 } from './nuxt-link-cZpXnfBZ.mjs';
import { defineComponent, withAsyncContext, computed, ref, mergeProps, unref, withCtx, createTextVNode, toDisplayString, createVNode, openBlock, createBlock, createCommentVNode, Fragment, renderList, useSSRContext } from 'vue';
import { ssrRenderAttrs, ssrRenderList, ssrRenderClass, ssrInterpolate, ssrRenderComponent } from 'vue/server-renderer';
import { R as RRule } from './rruleset-C2NkTWEe.mjs';
import { u as useSeoMeta } from './composables-DOi4jpYZ.mjs';
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
import '../routes/renderer.mjs';
import 'vue-bundle-renderer/runtime';
import 'unhead/server';
import 'devalue';
import 'unhead/plugins';
import 'unhead/utils';
import '@directus/sdk';
import 'vue-router';

const _sfc_main = /* @__PURE__ */ defineComponent({
  __name: "calendar",
  __ssrInlineRender: true,
  async setup(__props) {
    let __temp, __restore;
    useSeoMeta({
      title: "Calendar — Flux Theatre Ensemble",
      description: "See all upcoming performances, events, workshops, and readings from Flux Theatre Ensemble in one place."
    });
    const { client, readItems } = useDirectus();
    const { data: cmsData } = ([__temp, __restore] = withAsyncContext(async () => useAsyncData("calendar-data", async () => {
      const [events, productions] = await Promise.all([
        client.request(readItems("events", {
          filter: { status: { _eq: "published" } },
          fields: ["id", "title", "slug", "start_datetime", "end_datetime", "category", "format", "is_recurring", "recurrence_rule", { venue: ["name"] }, { tags: ["*", { tags_id: ["*"] }] }]
        })),
        client.request(readItems("productions", {
          filter: { status: { _eq: "published" } },
          fields: ["id", "title", "slug", { showtimes: ["*"], venue: ["name"] }]
        }))
      ]);
      return { events, productions };
    })), __temp = await __temp, __restore(), __temp);
    const calendarEntries = computed(() => {
      if (!cmsData.value || !cmsData.value.events || !cmsData.value.productions) return [];
      const entries = [];
      cmsData.value.events.forEach((ev) => {
        if (ev.is_recurring && ev.recurrence_rule) {
          try {
            const dtstart = new Date(ev.start_datetime);
            const rule = RRule.fromString(`DTSTART:${dtstart.toISOString().replace(/[-:]/g, "").split(".")[0]}Z
RRULE:${ev.recurrence_rule}`);
            const now = /* @__PURE__ */ new Date();
            const sixMonthsLater = new Date(now.getTime() + 180 * 24 * 60 * 60 * 1e3);
            const occurrences = rule.between(dtstart > now ? dtstart : now, sixMonthsLater, true);
            if (dtstart >= now && dtstart <= sixMonthsLater && !occurrences.find((d) => d.getTime() === dtstart.getTime())) {
              occurrences.unshift(dtstart);
            }
            occurrences.forEach((date) => {
              entries.push({
                id: `ev-${ev.id}-${date.getTime()}`,
                title: ev.title,
                datetime: date.toISOString(),
                end_datetime: ev.end_datetime ? new Date(date.getTime() + (new Date(ev.end_datetime).getTime() - dtstart.getTime())).toISOString() : null,
                type: "event",
                slug: ev.slug,
                category: ev.category,
                format: ev.format,
                venue_name: typeof ev.venue === "string" ? ev.venue : ev.venue?.name,
                tags: ev.tags?.map((t) => typeof t.tags_id === "object" ? t.tags_id.name : t.tags_id).filter(Boolean) || []
              });
            });
          } catch (e) {
            console.error("Error parsing RRULE for event:", ev.title, e);
            entries.push({
              id: `ev-${ev.id}`,
              title: ev.title,
              datetime: ev.start_datetime,
              end_datetime: ev.end_datetime,
              type: "event",
              slug: ev.slug,
              category: ev.category,
              format: ev.format,
              venue_name: typeof ev.venue === "string" ? ev.venue : ev.venue?.name,
              tags: ev.tags?.map((t) => typeof t.tags_id === "object" ? t.tags_id.name : t.tags_id).filter(Boolean) || []
            });
          }
        } else {
          entries.push({
            id: `ev-${ev.id}`,
            title: ev.title,
            datetime: ev.start_datetime,
            end_datetime: ev.end_datetime,
            type: "event",
            slug: ev.slug,
            category: ev.category,
            format: ev.format,
            venue_name: typeof ev.venue === "string" ? ev.venue : ev.venue?.name,
            tags: ev.tags?.map((t) => typeof t.tags_id === "object" ? t.tags_id.name : t.tags_id).filter(Boolean) || []
          });
        }
      });
      cmsData.value.productions.forEach((prod) => {
        if (!prod.showtimes) return;
        prod.showtimes.forEach((st) => {
          entries.push({
            id: `st-${st.id}`,
            title: prod.title,
            datetime: st.datetime,
            end_datetime: null,
            type: "showtime",
            slug: prod.slug,
            venue_name: typeof prod.venue === "string" ? prod.venue : prod.venue?.name,
            is_sold_out: st.is_sold_out,
            notes: st.notes
          });
        });
      });
      return entries.sort((a, b) => new Date(a.datetime).getTime() - new Date(b.datetime).getTime());
    });
    const activeType = ref("all");
    const today = /* @__PURE__ */ new Date();
    const currentMonth = ref(today.getMonth());
    const currentYear = ref(today.getFullYear());
    const monthLabel = computed(() => {
      return new Date(currentYear.value, currentMonth.value).toLocaleDateString("en-US", {
        month: "long",
        year: "numeric"
      });
    });
    const calendarDays = computed(() => {
      const firstDay = new Date(currentYear.value, currentMonth.value, 1);
      const startOffset = firstDay.getDay();
      const daysInMonth = new Date(currentYear.value, currentMonth.value + 1, 0).getDate();
      const daysInPrevMonth = new Date(currentYear.value, currentMonth.value, 0).getDate();
      const days = [];
      for (let i = startOffset - 1; i >= 0; i--) {
        const d = daysInPrevMonth - i;
        const m = currentMonth.value === 0 ? 11 : currentMonth.value - 1;
        const y = currentMonth.value === 0 ? currentYear.value - 1 : currentYear.value;
        days.push({
          date: d,
          month: "prev",
          fullDate: `${y}-${String(m + 1).padStart(2, "0")}-${String(d).padStart(2, "0")}`,
          isToday: false
        });
      }
      for (let d = 1; d <= daysInMonth; d++) {
        const fullDate = `${currentYear.value}-${String(currentMonth.value + 1).padStart(2, "0")}-${String(d).padStart(2, "0")}`;
        const isToday = d === today.getDate() && currentMonth.value === today.getMonth() && currentYear.value === today.getFullYear();
        days.push({ date: d, month: "current", fullDate, isToday });
      }
      const remaining = 42 - days.length;
      for (let d = 1; d <= remaining; d++) {
        const m = currentMonth.value === 11 ? 0 : currentMonth.value + 1;
        const y = currentMonth.value === 11 ? currentYear.value + 1 : currentYear.value;
        days.push({
          date: d,
          month: "next",
          fullDate: `${y}-${String(m + 1).padStart(2, "0")}-${String(d).padStart(2, "0")}`,
          isToday: false
        });
      }
      return days;
    });
    function getEntriesForDate(fullDate) {
      const allEntries = calendarEntries.value;
      if (!allEntries || !Array.isArray(allEntries)) return [];
      return allEntries.filter((e) => {
        if (activeType.value !== "all" && e.type !== activeType.value) return false;
        return e.datetime.startsWith(fullDate);
      }).sort((a, b) => new Date(a.datetime).getTime() - new Date(b.datetime).getTime());
    }
    const upcomingEntries = computed(() => {
      const now = /* @__PURE__ */ new Date();
      const thirtyDays = new Date(now.getTime() + 30 * 24 * 60 * 60 * 1e3);
      const allEntries = calendarEntries.value;
      if (!allEntries || !Array.isArray(allEntries)) return [];
      return allEntries.filter((e) => {
        const d = new Date(e.datetime);
        if (d < now || d > thirtyDays) return false;
        if (activeType.value !== "all" && e.type !== activeType.value) return false;
        return true;
      }).sort((a, b) => new Date(a.datetime).getTime() - new Date(b.datetime).getTime());
    });
    const viewMode = ref("calendar");
    function formatEntryTime(iso) {
      return new Date(iso).toLocaleTimeString("en-US", { hour: "numeric", minute: "2-digit" });
    }
    function entryLink(entry) {
      return entry.type === "showtime" ? `/productions/${entry.slug}` : `/events/${entry.slug}`;
    }
    const weekDays = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
    return (_ctx, _push, _parent, _attrs) => {
      const _component_NuxtLink = __nuxt_component_0;
      _push(`<div${ssrRenderAttrs(mergeProps({ class: "calendar-page" }, _attrs))} data-v-eb467ead><section class="calendar-page__header pt-12 pb-6" id="calendar-header" data-v-eb467ead><div class="calendar-page__header-container max-w-7xl mx-auto px-4 sm:px-6 lg:px-8" data-v-eb467ead><p class="calendar-page__subtitle text-brand-400 font-medium text-sm uppercase tracking-[0.15em] mb-2" data-v-eb467ead>What&#39;s On</p><h1 class="calendar-page__title section-heading" data-v-eb467ead>Calendar</h1><p class="calendar-page__description mt-4 text-stage-400 text-lg max-w-2xl" data-v-eb467ead> Performances, workshops, readings, and more — everything happening at Flux, all in one place. </p></div></section><section class="calendar-page__controls pb-6" id="calendar-controls" data-v-eb467ead><div class="calendar-page__controls-container max-w-7xl mx-auto px-4 sm:px-6 lg:px-8" data-v-eb467ead><div class="calendar-page__controls-layout flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4" data-v-eb467ead><div class="calendar-page__filters flex gap-2" data-v-eb467ead><!--[-->`);
      ssrRenderList([
        { label: "All", value: "all" },
        { label: "Performances", value: "showtime" },
        { label: "Events", value: "event" }
      ], (f) => {
        _push(`<button class="${ssrRenderClass([unref(activeType) === f.value ? "bg-brand-500 text-stage-950" : "bg-stage-800/60 text-stage-100 hover:text-stage-50 border border-stage-700/40", "calendar-page__filter-btn px-3 py-1.5 rounded-full text-xs font-medium transition-all duration-200"])}" data-v-eb467ead>${ssrInterpolate(f.label)}</button>`);
      });
      _push(`<!--]--></div><div class="calendar-page__view-toggle flex items-center gap-2" data-v-eb467ead><button class="${ssrRenderClass([unref(viewMode) === "calendar" ? "bg-stage-800 text-stage-100" : "text-stage-500 hover:text-stage-300", "calendar-page__toggle-btn calendar-page__toggle-btn--calendar px-3 py-1.5 rounded-lg text-xs font-medium transition-all"])}" id="view-calendar" data-v-eb467ead><svg class="calendar-page__toggle-icon w-4 h-4 inline-block mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="1.5" data-v-eb467ead><path stroke-linecap="round" stroke-linejoin="round" d="M6.75 3v2.25M17.25 3v2.25M3 18.75V7.5a2.25 2.25 0 012.25-2.25h13.5A2.25 2.25 0 0121 7.5v11.25m-18 0A2.25 2.25 0 005.25 21h13.5A2.25 2.25 0 0021 18.75m-18 0v-7.5A2.25 2.25 0 015.25 9h13.5A2.25 2.25 0 0121 11.25v7.5" data-v-eb467ead></path></svg> Calendar </button><button class="${ssrRenderClass([unref(viewMode) === "list" ? "bg-stage-800 text-stage-100" : "text-stage-500 hover:text-stage-300", "calendar-page__toggle-btn calendar-page__toggle-btn--list px-3 py-1.5 rounded-lg text-xs font-medium transition-all"])}" id="view-list" data-v-eb467ead><svg class="calendar-page__toggle-icon w-4 h-4 inline-block mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="1.5" data-v-eb467ead><path stroke-linecap="round" stroke-linejoin="round" d="M8.25 6.75h12M8.25 12h12m-12 5.25h12M3.75 6.75h.007v.008H3.75V6.75zm.375 0a.375.375 0 11-.75 0 .375.375 0 01.75 0zM3.75 12h.007v.008H3.75V12zm.375 0a.375.375 0 11-.75 0 .375.375 0 01.75 0zm-.375 5.25h.007v.008H3.75v-.008zm.375 0a.375.375 0 11-.75 0 .375.375 0 01.75 0z" data-v-eb467ead></path></svg> List </button></div></div></div></section>`);
      if (unref(viewMode) === "calendar") {
        _push(`<section class="calendar-page__calendar-view pb-24" id="calendar-grid" data-v-eb467ead><div class="calendar-page__calendar-container max-w-7xl mx-auto px-4 sm:px-6 lg:px-8" data-v-eb467ead><div class="calendar-page__nav flex items-center justify-between mb-6" data-v-eb467ead><button class="calendar-page__nav-btn calendar-page__nav-btn--prev p-2 rounded-lg text-stage-400 hover:text-stage-100 hover:bg-stage-800/50 transition-all" aria-label="Previous month" data-v-eb467ead><svg class="calendar-page__nav-icon w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2" data-v-eb467ead><path stroke-linecap="round" stroke-linejoin="round" d="M15.75 19.5L8.25 12l7.5-7.5" data-v-eb467ead></path></svg></button><div class="calendar-page__month-info text-center" data-v-eb467ead><h2 class="calendar-page__month-title text-2xl font-serif font-bold text-stage-9n 50" data-v-eb467ead>${ssrInterpolate(unref(monthLabel))}</h2><button class="calendar-page__today-btn text-xs text-brand-400 hover:text-brand-300 transition-colors mt-1" data-v-eb467ead> Today </button></div><button class="calendar-page__nav-btn calendar-page__nav-btn--next p-2 rounded-lg text-stage-400 hover:text-stage-100 hover:bg-stage-800/50 transition-all" aria-label="Next month" data-v-eb467ead><svg class="calendar-page__nav-icon w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2" data-v-eb467ead><path stroke-linecap="round" stroke-linejoin="round" d="M8.25 4.5l7.5 7.5-7.5 7.5" data-v-eb467ead></path></svg></button></div><div class="calendar-page__grid-wrapper card-glass overflow-hidden" data-v-eb467ead><div class="calendar-page__weekdays grid grid-cols-7 border-b border-stage-700/30" data-v-eb467ead><!--[-->`);
        ssrRenderList(weekDays, (day) => {
          _push(`<div class="calendar-page__weekday py-3 text-center text-xs font-semibold uppercase tracking-wider text-stage-400" data-v-eb467ead>${ssrInterpolate(day)}</div>`);
        });
        _push(`<!--]--></div><div class="calendar-page__days grid grid-cols-7" data-v-eb467ead><!--[-->`);
        ssrRenderList(unref(calendarDays), (day, idx) => {
          _push(`<div class="${ssrRenderClass([{
            "calendar-page__day--other-month": day.month !== "current",
            "calendar-page__day--today": day.isToday
          }, "calendar-page__day min-h-[100px] lg:min-h-[120px] p-1.5 border-b border-r border-stage-800/30 transition-colors"])}" data-v-eb467ead><div class="calendar-page__day-header flex items-center justify-between mb-1" data-v-eb467ead><span class="${ssrRenderClass([{
            "calendar-page__day-number--other-month": day.month !== "current",
            "calendar-page__day-number--current-month": day.month === "current" && !day.isToday,
            "calendar-page__day-number--today": day.isToday
          }, "calendar-page__day-number text-xs font-medium w-6 h-6 flex items-center justify-center rounded-full"])}" data-v-eb467ead>${ssrInterpolate(day.date)}</span></div><div class="calendar-page__entries space-y-0.5" data-v-eb467ead><!--[-->`);
          ssrRenderList(getEntriesForDate(day.fullDate).slice(0, 3), (entry) => {
            _push(ssrRenderComponent(_component_NuxtLink, {
              key: entry.id,
              to: entryLink(entry),
              class: ["calendar-page__entry block px-1.5 py-0.5 rounded text-[10px] lg:text-xs font-medium truncate transition-colors", entry.type === "showtime" ? "calendar-page__entry--showtime" : "calendar-page__entry--event"],
              title: `${entry.title} — ${formatEntryTime(entry.datetime)}`
            }, {
              default: withCtx((_, _push2, _parent2, _scopeId) => {
                if (_push2) {
                  _push2(`${ssrInterpolate(formatEntryTime(entry.datetime))} ${ssrInterpolate(entry.title)}`);
                } else {
                  return [
                    createTextVNode(toDisplayString(formatEntryTime(entry.datetime)) + " " + toDisplayString(entry.title), 1)
                  ];
                }
              }),
              _: 2
            }, _parent));
          });
          _push(`<!--]-->`);
          if (getEntriesForDate(day.fullDate).length > 3) {
            _push(`<span class="calendar-page__more-entries block px-1.5 text-[10px] text-stage-500" data-v-eb467ead> +${ssrInterpolate(getEntriesForDate(day.fullDate).length - 3)} more </span>`);
          } else {
            _push(`<!---->`);
          }
          _push(`</div></div>`);
        });
        _push(`<!--]--></div></div><div class="calendar-page__legend mt-4 flex items-center gap-6 text-xs text-stage-500" data-v-eb467ead><div class="calendar-page__legend-item flex items-center gap-2" data-v-eb467ead><span class="calendar-page__legend-color calendar-page__legend-color--showtime w-3 h-3 rounded bg-curtain-500/30 border-l-2 border-curtain-500" data-v-eb467ead></span> Performances </div><div class="calendar-page__legend-item flex items-center gap-2" data-v-eb467ead><span class="calendar-page__legend-color calendar-page__legend-color--event w-3 h-3 rounded bg-brand-500/20 border-l-2 border-brand-500" data-v-eb467ead></span> Events </div></div></div></section>`);
      } else {
        _push(`<section class="calendar-page__list-view pb-24" id="calendar-list" data-v-eb467ead><div class="calendar-page__list-container max-w-4xl mx-auto px-4 sm:px-6 lg:px-8" data-v-eb467ead><h2 class="calendar-page__list-title text-lg font-serif font-semibold text-stage-200 mb-6" data-v-eb467ead>Upcoming (Next 30 Days)</h2>`);
        if (unref(upcomingEntries).length) {
          _push(`<div class="calendar-page__list space-y-3" data-v-eb467ead><!--[-->`);
          ssrRenderList(unref(upcomingEntries), (entry) => {
            _push(ssrRenderComponent(_component_NuxtLink, {
              key: entry.id,
              to: entryLink(entry),
              class: "calendar-page__list-item card-glass p-4 flex items-center gap-4 group"
            }, {
              default: withCtx((_, _push2, _parent2, _scopeId) => {
                if (_push2) {
                  _push2(`<div class="${ssrRenderClass([entry.type === "showtime" ? "calendar-page__date-block--showtime" : "calendar-page__date-block--event", "calendar-page__date-block w-14 h-14 flex-shrink-0 rounded-lg flex flex-col items-center justify-center"])}" data-v-eb467ead${_scopeId}><span class="${ssrRenderClass([entry.type === "showtime" ? "text-curtain-500" : "text-brand-400", "calendar-page__date-month text-xs font-bold uppercase"])}" data-v-eb467ead${_scopeId}>${ssrInterpolate(new Date(entry.datetime).toLocaleDateString("en-US", { month: "short" }))}</span><span class="${ssrRenderClass([entry.type === "showtime" ? "text-curtain-500" : "text-brand-400", "calendar-page__date-day text-lg font-bold"])}" data-v-eb467ead${_scopeId}>${ssrInterpolate(new Date(entry.datetime).getDate())}</span></div><div class="calendar-page__details flex-1 min-w-0" data-v-eb467ead${_scopeId}><div class="calendar-page__details-meta flex items-center gap-2 mb-1" data-v-eb467ead${_scopeId}><span class="${ssrRenderClass([entry.type === "showtime" ? "calendar-page__tag--showtime" : "calendar-page__tag--event", "calendar-page__tag px-2 py-0.5 rounded-full text-[10px] font-semibold uppercase tracking-wider"])}" data-v-eb467ead${_scopeId}>${ssrInterpolate(entry.type === "showtime" ? "Performance" : entry.category || "Event")}</span>`);
                  if (entry.notes) {
                    _push2(`<span class="calendar-page__notes text-[10px] text-stage-500" data-v-eb467ead${_scopeId}>${ssrInterpolate(entry.notes)}</span>`);
                  } else {
                    _push2(`<!---->`);
                  }
                  if (entry.is_sold_out) {
                    _push2(`<span class="calendar-page__sold-out-tag text-[10px] text-red-400 font-semibold" data-v-eb467ead${_scopeId}>Sold Out</span>`);
                  } else {
                    _push2(`<!---->`);
                  }
                  _push2(`<!--[-->`);
                  ssrRenderList(entry.tags || [], (tag) => {
                    _push2(`<span class="calendar-page__custom-tag px-2 py-0.5 rounded-full text-[10px] font-medium bg-stage-800 text-stage-400 border border-stage-700/50" data-v-eb467ead${_scopeId}>${ssrInterpolate(tag)}</span>`);
                  });
                  _push2(`<!--]--></div><h3 class="calendar-page__item-title text-sm font-semibold text-stage-100 group-hover:text-brand-400 transition-colors truncate" data-v-eb467ead${_scopeId}>${ssrInterpolate(entry.title)}</h3><div class="calendar-page__item-footer flex items-center gap-3 text-xs text-stage-500 mt-1" data-v-eb467ead${_scopeId}><span class="calendar-page__time" data-v-eb467ead${_scopeId}>${ssrInterpolate(formatEntryTime(entry.datetime))}</span>`);
                  if (entry.venue_name) {
                    _push2(`<span class="calendar-page__venue-divider" data-v-eb467ead${_scopeId}>· ${ssrInterpolate(entry.venue_name)}</span>`);
                  } else {
                    _push2(`<!---->`);
                  }
                  if (entry.format === "digital") {
                    _push2(`<span class="calendar-page__digital-tag text-blue-400" data-v-eb467ead${_scopeId}>· Online</span>`);
                  } else {
                    _push2(`<!---->`);
                  }
                  _push2(`</div></div><svg class="calendar-page__item-arrow w-4 h-4 text-stage-600 group-hover:text-brand-400 group-hover:translate-x-1 transition-all flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2" data-v-eb467ead${_scopeId}><path stroke-linecap="round" stroke-linejoin="round" d="M8.25 4.5l7.5 7.5-7.5 7.5" data-v-eb467ead${_scopeId}></path></svg>`);
                } else {
                  return [
                    createVNode("div", {
                      class: ["calendar-page__date-block w-14 h-14 flex-shrink-0 rounded-lg flex flex-col items-center justify-center", entry.type === "showtime" ? "calendar-page__date-block--showtime" : "calendar-page__date-block--event"]
                    }, [
                      createVNode("span", {
                        class: ["calendar-page__date-month text-xs font-bold uppercase", entry.type === "showtime" ? "text-curtain-500" : "text-brand-400"]
                      }, toDisplayString(new Date(entry.datetime).toLocaleDateString("en-US", { month: "short" })), 3),
                      createVNode("span", {
                        class: ["calendar-page__date-day text-lg font-bold", entry.type === "showtime" ? "text-curtain-500" : "text-brand-400"]
                      }, toDisplayString(new Date(entry.datetime).getDate()), 3)
                    ], 2),
                    createVNode("div", { class: "calendar-page__details flex-1 min-w-0" }, [
                      createVNode("div", { class: "calendar-page__details-meta flex items-center gap-2 mb-1" }, [
                        createVNode("span", {
                          class: ["calendar-page__tag px-2 py-0.5 rounded-full text-[10px] font-semibold uppercase tracking-wider", entry.type === "showtime" ? "calendar-page__tag--showtime" : "calendar-page__tag--event"]
                        }, toDisplayString(entry.type === "showtime" ? "Performance" : entry.category || "Event"), 3),
                        entry.notes ? (openBlock(), createBlock("span", {
                          key: 0,
                          class: "calendar-page__notes text-[10px] text-stage-500"
                        }, toDisplayString(entry.notes), 1)) : createCommentVNode("", true),
                        entry.is_sold_out ? (openBlock(), createBlock("span", {
                          key: 1,
                          class: "calendar-page__sold-out-tag text-[10px] text-red-400 font-semibold"
                        }, "Sold Out")) : createCommentVNode("", true),
                        (openBlock(true), createBlock(Fragment, null, renderList(entry.tags || [], (tag) => {
                          return openBlock(), createBlock("span", {
                            key: tag,
                            class: "calendar-page__custom-tag px-2 py-0.5 rounded-full text-[10px] font-medium bg-stage-800 text-stage-400 border border-stage-700/50"
                          }, toDisplayString(tag), 1);
                        }), 128))
                      ]),
                      createVNode("h3", { class: "calendar-page__item-title text-sm font-semibold text-stage-100 group-hover:text-brand-400 transition-colors truncate" }, toDisplayString(entry.title), 1),
                      createVNode("div", { class: "calendar-page__item-footer flex items-center gap-3 text-xs text-stage-500 mt-1" }, [
                        createVNode("span", { class: "calendar-page__time" }, toDisplayString(formatEntryTime(entry.datetime)), 1),
                        entry.venue_name ? (openBlock(), createBlock("span", {
                          key: 0,
                          class: "calendar-page__venue-divider"
                        }, "· " + toDisplayString(entry.venue_name), 1)) : createCommentVNode("", true),
                        entry.format === "digital" ? (openBlock(), createBlock("span", {
                          key: 1,
                          class: "calendar-page__digital-tag text-blue-400"
                        }, "· Online")) : createCommentVNode("", true)
                      ])
                    ]),
                    (openBlock(), createBlock("svg", {
                      class: "calendar-page__item-arrow w-4 h-4 text-stage-600 group-hover:text-brand-400 group-hover:translate-x-1 transition-all flex-shrink-0",
                      fill: "none",
                      viewBox: "0 0 24 24",
                      stroke: "currentColor",
                      "stroke-width": "2"
                    }, [
                      createVNode("path", {
                        "stroke-linecap": "round",
                        "stroke-linejoin": "round",
                        d: "M8.25 4.5l7.5 7.5-7.5 7.5"
                      })
                    ]))
                  ];
                }
              }),
              _: 2
            }, _parent));
          });
          _push(`<!--]--></div>`);
        } else {
          _push(`<p class="calendar-page__empty-text text-center text-stage-500 py-16 text-lg" data-v-eb467ead> No upcoming entries in the next 30 days. </p>`);
        }
        _push(`</div></section>`);
      }
      _push(`</div>`);
    };
  }
});
const _sfc_setup = _sfc_main.setup;
_sfc_main.setup = (props, ctx) => {
  const ssrContext = useSSRContext();
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("pages/calendar.vue");
  return _sfc_setup ? _sfc_setup(props, ctx) : void 0;
};
const calendar = /* @__PURE__ */ _export_sfc(_sfc_main, [["__scopeId", "data-v-eb467ead"]]);

export { calendar as default };
//# sourceMappingURL=calendar-B-Zo2z3M.mjs.map
