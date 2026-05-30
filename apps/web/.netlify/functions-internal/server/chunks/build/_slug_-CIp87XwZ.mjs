import { _ as __nuxt_component_0 } from './nuxt-link-cZpXnfBZ.mjs';
import { u as useDirectus, a as useAsyncData, _ as __nuxt_component_1 } from './asyncData-DO9zjVnq.mjs';
import { _ as __nuxt_component_1$1 } from './BlockRenderer-DbBZxoc-.mjs';
import { defineComponent, withAsyncContext, computed, unref, mergeProps, withCtx, createTextVNode, createVNode, openBlock, createBlock, toDisplayString, useSSRContext } from 'vue';
import { ssrRenderAttrs, ssrRenderComponent, ssrInterpolate, ssrRenderAttr, ssrRenderList } from 'vue/server-renderer';
import { formatInTimeZone, toZonedTime, fromZonedTime } from 'date-fns-tz';
import { u as useRoute, c as createError } from './server.mjs';
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

const timeZone = "America/New_York";
const _sfc_main = /* @__PURE__ */ defineComponent({
  __name: "[slug]",
  __ssrInlineRender: true,
  async setup(__props) {
    let __temp, __restore;
    const route = useRoute();
    const slug = route.params.slug;
    const { client, readItems } = useDirectus();
    const { data: events, error } = ([__temp, __restore] = withAsyncContext(() => useAsyncData(
      `event-${slug}`,
      () => client.request(readItems("events", {
        filter: { slug: { _eq: slug }, status: { _eq: "published" } },
        fields: ["*", "is_recurring", "recurrence_rule", { venue: ["*"] }, { related_production: ["title", "slug", "poster_image"] }, { funders: ["*", { funder_id: ["name", "slug", "image", "url"] }] }],
        limit: 1
      }))
    )), __temp = await __temp, __restore(), __temp);
    const event = computed(() => events.value?.[0] || null);
    if (!event.value && !error.value) {
      throw createError({ statusCode: 404, statusMessage: "Event not found" });
    }
    useSeoMeta({
      title: () => `${event.value?.title || "Event"} — Flux Theatre Ensemble`,
      description: () => event.value?.excerpt || ""
    });
    const nyDateLabel = computed(() => {
      if (!event.value) return "";
      return formatInTimeZone(new Date(event.value.start_datetime), timeZone, "EEEE, MMMM d, yyyy");
    });
    const recurrenceText = computed(() => {
      if (!event.value?.is_recurring || !event.value?.recurrence_rule) return null;
      try {
        const rule = RRule.fromString(`RRULE:${event.value.recurrence_rule}`);
        return rule.toText().charAt(0).toUpperCase() + rule.toText().slice(1);
      } catch (e) {
        return "Recurring event";
      }
    });
    const upcomingDates = computed(() => {
      if (!event.value?.is_recurring || !event.value?.recurrence_rule) return [];
      try {
        const dtstart = toZonedTime(new Date(event.value.start_datetime), timeZone);
        const year = dtstart.getFullYear();
        const month = dtstart.getMonth() + 1;
        const day = dtstart.getDate();
        const hour = dtstart.getHours();
        const min = dtstart.getMinutes();
        const sec = dtstart.getSeconds();
        const pad = (n) => n.toString().padStart(2, "0");
        const dtstartStr = `${year}${pad(month)}${pad(day)}T${pad(hour)}${pad(min)}${pad(sec)}`;
        const rule = RRule.fromString(`DTSTART:${dtstartStr}
RRULE:${event.value.recurrence_rule}`);
        const occurrences = rule.after(/* @__PURE__ */ new Date(), true) ? rule.all((date, i) => i < 5) : [];
        return occurrences.map((d) => fromZonedTime(d, timeZone));
      } catch (e) {
        return [];
      }
    });
    const eventTimes = computed(() => {
      if (!event.value) return null;
      const start = new Date(event.value.start_datetime);
      const end = event.value.end_datetime ? new Date(event.value.end_datetime) : null;
      const nyStart = formatInTimeZone(start, timeZone, "h:mm a");
      const nyEnd = end ? formatInTimeZone(end, timeZone, "h:mm a") : null;
      let localStart = null;
      let localTz = "";
      const showLocal = localStart;
      const nyFull = nyEnd ? `${nyStart} – ${nyEnd} ET` : `${nyStart} ET`;
      const localFull = `${localStart} ${localTz}`;
      return { nyFull, localFull, showLocal };
    });
    const categoryLabel = computed(() => {
      if (!event.value) return "Event";
      const labels = {
        workshop: "Workshop",
        reading: "Reading",
        talkback: "Talkback",
        fundraiser: "Fundraiser",
        social: "Social",
        audition: "Audition",
        masterclass: "Masterclass",
        community: "Community",
        performance: "Performance",
        other: "Event"
      };
      return labels[event.value.category];
    });
    const { getImageProps } = useDirectus();
    const funders = computed(() => {
      return (event.value?.funders || []).map((f) => f.funder_id).filter(Boolean);
    });
    return (_ctx, _push, _parent, _attrs) => {
      const _component_NuxtLink = __nuxt_component_0;
      const _component_ClientOnly = __nuxt_component_1;
      const _component_BlockRenderer = __nuxt_component_1$1;
      if (unref(event)) {
        _push(`<article${ssrRenderAttrs(mergeProps({ class: "event-detail pb-24" }, _attrs))}><section class="event-detail__hero relative pt-8 pb-16 bg-stage-900 overflow-hidden" id="event-detail-hero">`);
        if (unref(event).cover_image) {
          _push(`<div class="absolute inset-0 opacity-20 blur-3xl pointer-events-none"><img${ssrRenderAttrs(mergeProps(unref(getImageProps)(unref(event).cover_image, { sm: 100 }, { quality: 10 }), {
            class: "w-full h-full object-cover scale-150",
            alt: ""
          }))}></div>`);
        } else {
          _push(`<!---->`);
        }
        _push(`<div class="event-detail__hero-container relative max-w-5xl mx-auto px-4 sm:px-6 lg:px-8"><div class="flex flex-col lg:flex-row gap-12 lg:items-center"><div class="flex-1"><div class="event-detail__meta flex flex-wrap items-center gap-3 mb-6">`);
        _push(ssrRenderComponent(_component_NuxtLink, {
          to: "/events",
          class: "event-detail__back-link text-xs text-stage-400 hover:text-brand-400 transition-colors"
        }, {
          default: withCtx((_, _push2, _parent2, _scopeId) => {
            if (_push2) {
              _push2(` ← All Events `);
            } else {
              return [
                createTextVNode(" ← All Events ")
              ];
            }
          }),
          _: 1
        }, _parent));
        _push(`<span class="event-detail__divider w-px h-3 bg-stage-700"></span><span class="event-detail__category px-2.5 py-0.5 rounded-full text-xs font-semibold bg-brand-500/90 text-stage-950">${ssrInterpolate(unref(categoryLabel))}</span></div><h1 class="event-detail__title text-3xl sm:text-5xl lg:text-6xl font-serif font-bold text-stage-50 tracking-tight leading-tight">${ssrInterpolate(unref(event).title)}</h1><div class="event-detail__info-bar mt-8 flex flex-col sm:flex-row sm:items-center gap-6 text-stage-300"><div class="event-detail__info-item flex items-center gap-3"><div class="event-detail__info-icon w-10 h-10 rounded-lg bg-stage-800 flex items-center justify-center text-brand-400"><svg class="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="1.5"><path stroke-linecap="round" stroke-linejoin="round" d="M6.75 3v2.25M17.25 3v2.25M3 18.75V7.5a2.25 2.25 0 012.25-2.25h13.5A2.25 2.25 0 0121 7.5v11.25m-18 0A2.25 2.25 0 005.25 21h13.5A2.25 2.25 0 0021 18.75m-18 0v-7.5A2.25 2.25 0 015.25 9h13.5A2.25 2.25 0 0121 11.25v7.5"></path></svg></div><div class="event-detail__info-text"><p class="event-detail__info-label text-xs text-stage-500 uppercase font-bold tracking-wider">Date &amp; Time</p>`);
        if (unref(event).is_recurring) {
          _push(`<p class="event-detail__info-value text-sm font-medium text-brand-400">${ssrInterpolate(unref(recurrenceText))}</p>`);
        } else {
          _push(`<p class="event-detail__info-value text-sm font-medium">${ssrInterpolate(unref(nyDateLabel))}</p>`);
        }
        _push(`<div class="event-detail__info-subtext text-xs text-stage-300 mt-0.5 flex flex-col"><span class="font-bold">${ssrInterpolate(unref(eventTimes)?.nyFull)}</span>`);
        _push(ssrRenderComponent(_component_ClientOnly, null, {}, _parent));
        _push(`</div></div></div><div class="event-detail__info-item flex items-center gap-3"><div class="event-detail__info-icon w-10 h-10 rounded-lg bg-stage-800 flex items-center justify-center text-brand-400">`);
        if (unref(event).format === "digital") {
          _push(`<svg class="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="1.5"><path stroke-linecap="round" stroke-linejoin="round" d="M9 17.25v1.007a3 3 0 01-.879 2.122L7.5 21h9l-.621-.621A3 3 0 0115 18.257V17.25m6-12V15a2.25 2.25 0 01-2.25 2.25H5.25A2.25 2.25 0 013 15V5.25A2.25 2.25 0 015.25 3h13.5A2.25 2.25 0 0121 5.25z"></path></svg>`);
        } else {
          _push(`<svg class="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="1.5"><path stroke-linecap="round" stroke-linejoin="round" d="M15 10.5a3 3 0 11-6 0 3 3 0 016 0z"></path><path stroke-linecap="round" stroke-linejoin="round" d="M19.5 10.5c0 7.142-7.5 11.25-7.5 11.25S4.5 17.642 4.5 10.5a7.5 7.5 0 1115 0z"></path></svg>`);
        }
        _push(`</div><div class="event-detail__info-text"><p class="event-detail__info-label text-xs text-stage-500 uppercase font-bold tracking-wider">Location</p><p class="event-detail__info-value text-sm font-medium">${ssrInterpolate(unref(event).venue && typeof unref(event).venue !== "string" ? unref(event).venue.name : unref(event).venue || "Online")}</p>`);
        if (unref(event).format === "hybrid") {
          _push(`<p class="event-detail__info-subtext text-xs text-stage-400">In person &amp; digital</p>`);
        } else {
          _push(`<!---->`);
        }
        _push(`</div></div><div class="event-detail__info-item flex items-center gap-3"><div class="event-detail__info-icon w-10 h-10 rounded-lg bg-stage-800 flex items-center justify-center text-brand-400"><svg class="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="1.5"><path stroke-linecap="round" stroke-linejoin="round" d="M16.5 6v.75m0 3v.75m0 3v.75m0 3V18m-9-5.25h5.25M7.5 15h3M3.375 5.25c-.621 0-1.125.504-1.125 1.125v3.026a2.999 2.999 0 010 5.198v3.026c0 .621.504 1.125 1.125 1.125h17.25c.621 0 1.125-.504 1.125-1.125v-3.026a2.999 2.999 0 010-5.198V6.375c0-.621-.504-1.125-1.125-1.125H3.375z"></path></svg></div><div class="event-detail__info-text"><p class="event-detail__info-label text-xs text-stage-500 uppercase font-bold tracking-wider">Admission</p><p class="event-detail__info-value text-sm font-medium">${ssrInterpolate(unref(event).is_free ? "Free" : unref(event).price || "Ticketed")}</p></div></div></div><div class="event-detail__actions mt-10 flex flex-wrap gap-4"><a${ssrRenderAttr("href", unref(event).rsvp_url || unref(event).ticket_url || "#")} target="_blank" class="event-detail__rsvp-btn btn-primary group flex items-center bg-brand-500 gap-3 px-8 py-4 text-base text-stage-100 shadow-2xl shadow-brand-500/40 hover:text-stage-50 hover:scale-[1.02] active:scale-[0.98] transition-all duration-300"><span class="font-bold tracking-widest">${ssrInterpolate(unref(event).ticket_url ? "GET TICKETS" : "RSVP NOW")}</span><svg class="w-5 h-5 transition-transform duration-300 group-hover:translate-x-1.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2.5"><path stroke-linecap="round" stroke-linejoin="round" d="M13.5 4.5L21 12m0 0l-7.5 7.5M21 12H3"></path></svg></a>`);
        if (unref(event).format === "digital" || unref(event).format === "hybrid") {
          _push(ssrRenderComponent(_component_NuxtLink, {
            to: "#",
            class: "event-detail__digital-btn btn-secondary flex items-center px-6 py-4"
          }, {
            default: withCtx((_, _push2, _parent2, _scopeId) => {
              if (_push2) {
                _push2(` Digital Access Info `);
              } else {
                return [
                  createTextVNode(" Digital Access Info ")
                ];
              }
            }),
            _: 1
          }, _parent));
        } else {
          _push(`<!---->`);
        }
        _push(`</div></div>`);
        if (unref(event).cover_image) {
          _push(`<div class="lg:w-[400px] flex-shrink-0"><div class="event-detail__hero-image-wrapper relative group aspect-video lg:aspect-[4/5] rounded-3xl overflow-hidden shadow-2xl border border-stage-800/60"><img${ssrRenderAttrs(mergeProps(unref(getImageProps)(unref(event).cover_image, { sm: 600, md: 800, lg: 1200 }, { quality: 90 }), {
            alt: unref(event).title,
            class: "w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
          }))}><div class="absolute inset-0 bg-gradient-to-t from-stage-950/60 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div></div></div>`);
        } else {
          _push(`<!---->`);
        }
        _push(`</div>`);
        if (unref(event).is_recurring && unref(upcomingDates).length > 0) {
          _push(`<div class="event-detail__recurring-dates mt-10 p-6 rounded-2xl bg-stage-800/40 border border-stage-700/30"><h3 class="text-xs font-bold text-stage-400 uppercase tracking-widest mb-4">Upcoming Occurrences</h3><div class="flex flex-wrap gap-3"><!--[-->`);
          ssrRenderList(unref(upcomingDates), (date) => {
            _push(`<div class="px-3 py-2 rounded-lg bg-stage-900 border border-stage-700/50 flex flex-col items-center min-w-[100px]"><span class="text-[10px] font-bold text-brand-400 uppercase">${ssrInterpolate(unref(formatInTimeZone)(date, timeZone, "MMM"))}</span><span class="text-lg font-serif font-bold text-stage-50">${ssrInterpolate(unref(formatInTimeZone)(date, timeZone, "d"))}</span><span class="text-[10px] text-stage-500 uppercase">${ssrInterpolate(unref(formatInTimeZone)(date, timeZone, "EEE"))}</span></div>`);
          });
          _push(`<!--]--></div></div>`);
        } else {
          _push(`<!---->`);
        }
        _push(`</div></section><section class="event-detail__main py-16 max-w-5xl mx-auto px-4 sm:px-6 lg:px-8"><div class="event-detail__layout flex flex-col lg:flex-row gap-12"><div class="event-detail__content flex-1">`);
        if (unref(event).content || unref(event).description) {
          _push(`<div class="event-detail__body max-w-none prose prose-invert prose-lg">`);
          _push(ssrRenderComponent(_component_BlockRenderer, {
            content: unref(event).content || unref(event).description
          }, null, _parent));
          _push(`</div>`);
        } else {
          _push(`<!---->`);
        }
        _push(`</div><aside class="event-detail__sidebar lg:w-80 space-y-6">`);
        if (unref(event).related_production) {
          _push(`<div class="event-detail__production-card card-glass p-4 border-l-4 border-brand-500"><h3 class="text-xs font-bold text-stage-500 uppercase tracking-widest mb-3">Part Of</h3>`);
          _push(ssrRenderComponent(_component_NuxtLink, {
            to: `/productions/${unref(event).related_production.slug}`,
            class: "group flex items-center gap-3"
          }, {
            default: withCtx((_, _push2, _parent2, _scopeId) => {
              if (_push2) {
                _push2(`<div class="w-12 h-16 bg-stage-800 rounded overflow-hidden flex-shrink-0 shadow-md flex items-center justify-center"${_scopeId}>`);
                if (unref(event).related_production.poster_image) {
                  _push2(`<img${ssrRenderAttrs(mergeProps(unref(getImageProps)(unref(event).related_production.poster_image, { sm: 100 }, { quality: 70 }), {
                    alt: unref(event).related_production.title,
                    class: "w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                  }))}${_scopeId}>`);
                } else {
                  _push2(`<div class="text-stage-600"${_scopeId}><svg class="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"${_scopeId}><path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 002-2H4a2 2 0 00-2 2v12a2 2 0 002 2z"${_scopeId}></path></svg></div>`);
                }
                _push2(`</div><div class="flex-1 min-w-0"${_scopeId}><h4 class="text-sm font-bold text-stage-100 group-hover:text-brand-400 transition-colors line-clamp-2 leading-snug"${_scopeId}>${ssrInterpolate(unref(event).related_production.title)}</h4><span class="text-[10px] text-brand-500 font-bold uppercase mt-1 inline-block"${_scopeId}>View Production →</span></div>`);
              } else {
                return [
                  createVNode("div", { class: "w-12 h-16 bg-stage-800 rounded overflow-hidden flex-shrink-0 shadow-md flex items-center justify-center" }, [
                    unref(event).related_production.poster_image ? (openBlock(), createBlock("img", mergeProps({ key: 0 }, unref(getImageProps)(unref(event).related_production.poster_image, { sm: 100 }, { quality: 70 }), {
                      alt: unref(event).related_production.title,
                      class: "w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                    }), null, 16, ["alt"])) : (openBlock(), createBlock("div", {
                      key: 1,
                      class: "text-stage-600"
                    }, [
                      (openBlock(), createBlock("svg", {
                        class: "w-6 h-6",
                        fill: "none",
                        viewBox: "0 0 24 24",
                        stroke: "currentColor"
                      }, [
                        createVNode("path", {
                          "stroke-linecap": "round",
                          "stroke-linejoin": "round",
                          "stroke-width": "1.5",
                          d: "M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 002-2H4a2 2 0 00-2 2v12a2 2 0 002 2z"
                        })
                      ]))
                    ]))
                  ]),
                  createVNode("div", { class: "flex-1 min-w-0" }, [
                    createVNode("h4", { class: "text-sm font-bold text-stage-100 group-hover:text-brand-400 transition-colors line-clamp-2 leading-snug" }, toDisplayString(unref(event).related_production.title), 1),
                    createVNode("span", { class: "text-[10px] text-brand-500 font-bold uppercase mt-1 inline-block" }, "View Production →")
                  ])
                ];
              }
            }),
            _: 1
          }, _parent));
          _push(`</div>`);
        } else {
          _push(`<!---->`);
        }
        _push(`<div class="event-detail__venue-card card-glass p-6 sticky top-24"><h3 class="event-detail__venue-title font-serif font-bold text-lg text-stage-100 mb-4">Venue Info</h3>`);
        if (unref(event).venue) {
          _push(`<div class="event-detail__venue-info space-y-4"><div class="event-detail__venue-address"><p class="text-sm font-bold text-stage-300">${ssrInterpolate(typeof unref(event).venue === "string" ? unref(event).venue : unref(event).venue.name)}</p>`);
          if (typeof unref(event).venue !== "string" && unref(event).venue.address) {
            _push(`<p class="text-sm text-stage-400">${ssrInterpolate(unref(event).venue.address)}<br> ${ssrInterpolate(unref(event).venue.city)}, ${ssrInterpolate(unref(event).venue.state)}</p>`);
          } else {
            _push(`<!---->`);
          }
          _push(`</div>`);
          if (typeof unref(event).venue !== "string" && unref(event).venue.maps_url) {
            _push(`<a${ssrRenderAttr("href", unref(event).venue.maps_url)} target="_blank" class="event-detail__map-link inline-block text-xs text-brand-400 hover:underline"> View on Google Maps → </a>`);
          } else {
            _push(`<!---->`);
          }
          _push(`</div>`);
        } else {
          _push(`<div class="event-detail__venue-text text-sm text-stage-400 italic"> This is a digital-only event. </div>`);
        }
        _push(`<div class="event-detail__support mt-8 pt-6 border-t border-stage-800/60"><h3 class="event-detail__support-title font-serif font-bold text-sm text-stage-100 mb-2">Need Help?</h3><p class="event-detail__support-text text-xs text-stage-500 leading-relaxed"> If you have questions about accessibility or ticketing for this event, please email us at <a href="mailto:info@fluxtheatre.org" class="event-detail__support-link text-brand-400">info@fluxtheatre.org</a>. </p></div></div></aside></div></section>`);
        if (unref(funders).length) {
          _push(`<section class="event-detail__funders py-16 border-t border-stage-800/40"><div class="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8"><h2 class="text-xl font-serif font-bold text-stage-100 mb-8 text-center">Supported By</h2><div class="flex flex-wrap items-center justify-center gap-10"><!--[-->`);
          ssrRenderList(unref(funders), (funder) => {
            _push(ssrRenderComponent(_component_NuxtLink, {
              key: funder.slug,
              to: `/funders/${funder.slug}`,
              class: "group flex flex-col items-center gap-3 transition-transform hover:scale-105"
            }, {
              default: withCtx((_, _push2, _parent2, _scopeId) => {
                if (_push2) {
                  _push2(`<div class="w-24 h-24 bg-white rounded-lg shadow-md p-4 flex items-center justify-center overflow-hidden border border-stage-800/10 group-hover:border-brand-500/30 transition-colors"${_scopeId}>`);
                  if (funder.image) {
                    _push2(`<img${ssrRenderAttrs(mergeProps({ ref_for: true }, unref(getImageProps)(funder.image, { sm: 240 }, { quality: 80 }), {
                      alt: funder.name,
                      class: "w-full h-full object-contain grayscale group-hover:grayscale-0 transition-all duration-500"
                    }))}${_scopeId}>`);
                  } else {
                    _push2(`<span class="text-stage-900 font-serif font-bold text-sm text-center"${_scopeId}>${ssrInterpolate(funder.name)}</span>`);
                  }
                  _push2(`</div>`);
                } else {
                  return [
                    createVNode("div", { class: "w-24 h-24 bg-white rounded-lg shadow-md p-4 flex items-center justify-center overflow-hidden border border-stage-800/10 group-hover:border-brand-500/30 transition-colors" }, [
                      funder.image ? (openBlock(), createBlock("img", mergeProps({
                        key: 0,
                        ref_for: true
                      }, unref(getImageProps)(funder.image, { sm: 240 }, { quality: 80 }), {
                        alt: funder.name,
                        class: "w-full h-full object-contain grayscale group-hover:grayscale-0 transition-all duration-500"
                      }), null, 16, ["alt"])) : (openBlock(), createBlock("span", {
                        key: 1,
                        class: "text-stage-900 font-serif font-bold text-sm text-center"
                      }, toDisplayString(funder.name), 1))
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
        _push(`</article>`);
      } else {
        _push(`<!---->`);
      }
    };
  }
});
const _sfc_setup = _sfc_main.setup;
_sfc_main.setup = (props, ctx) => {
  const ssrContext = useSSRContext();
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("pages/events/[slug].vue");
  return _sfc_setup ? _sfc_setup(props, ctx) : void 0;
};

export { _sfc_main as default };
//# sourceMappingURL=_slug_-CIp87XwZ.mjs.map
