<script setup lang="ts">
import { format, startOfMonth, endOfMonth, startOfWeek, endOfWeek, eachDayOfInterval, isSameMonth, isSameDay, addMonths, subMonths, isToday } from 'date-fns';
import { formatInTimeZone } from 'date-fns-tz';

const props = withDefaults(defineProps<{
  events: any[];
}>(), {
  events: () => []
});

const currentDate = ref(new Date());
const selectedDate = ref(new Date());

const monthStart = computed(() => startOfMonth(currentDate.value));
const monthEnd = computed(() => endOfMonth(monthStart.value));
const startDate = computed(() => startOfWeek(monthStart.value));
const endDate = computed(() => endOfWeek(monthEnd.value));

const calendarDays = computed(() => {
  return eachDayOfInterval({
    start: startDate.value,
    end: endDate.value,
  });
});

const nextMonth = () => {
  currentDate.value = addMonths(currentDate.value, 1);
};

const prevMonth = () => {
  currentDate.value = subMonths(currentDate.value, 1);
};

const getEventsForDay = (day: Date) => {
  return props.events.filter(event => isSameDay(new Date(event.start_datetime), day));
};

const selectedDayEvents = computed(() => getEventsForDay(selectedDate.value));

// Format: April 2026
const monthYearLabel = computed(() => format(currentDate.value, 'MMMM yyyy'));

const daysOfWeek = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];

const { getAssetUrl } = useDirectus();

const getEventTimes = (startDatetime: string) => {
  const date = new Date(startDatetime);
  const nyTime = formatInTimeZone(date, 'America/New_York', 'h:mm a');
  
  let localTime = null;
  let showLocal = false;
  
  if (import.meta.client) {
    const timeStr = date.toLocaleTimeString('en-US', { hour: 'numeric', minute: '2-digit' });
    const tzStr = date.toLocaleTimeString('en-US', { timeZoneName: 'short' }).split(' ').pop();
    localTime = `${timeStr} ${tzStr}`;
    
    const nyTimeOnly = nyTime.toLowerCase().replace(/\s/g, '');
    const localTimeOnly = timeStr.toLowerCase().replace(/\s/g, '');
    showLocal = nyTimeOnly !== localTimeOnly;
  }
  
  return { nyTime: `${nyTime} ET`, localTime, showLocal };
};
</script>

<template>
  <div class="calendar-view bg-stage-950 rounded-3xl border border-stage-800 overflow-hidden shadow-2xl">
    <div class="calendar-view__container flex flex-col lg:flex-row h-full lg:min-h-[600px]">
      
      <!-- Calendar Grid Side -->
      <div class="calendar-view__grid-side flex-grow p-6 lg:p-8 border-b lg:border-b-0 lg:border-r border-stage-800/60 bg-stage-900/30">
        <!-- Header -->
        <div class="calendar-view__header flex items-center justify-between mb-8">
          <h2 class="calendar-view__month text-2xl font-serif font-bold text-white">{{ monthYearLabel }}</h2>
          <div class="calendar-view__controls flex gap-2">
            <button 
              @click="prevMonth"
              class="w-10 h-10 flex items-center justify-center rounded-full bg-stage-800 text-stage-200 hover:text-brand-400 hover:bg-stage-700 transition-all border border-stage-700/50"
            >
              <svg class="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 19l-7-7 7-7" /></svg>
            </button>
            <button 
              @click="nextMonth"
              class="w-10 h-10 flex items-center justify-center rounded-full bg-stage-800 text-stage-200 hover:text-brand-400 hover:bg-stage-700 transition-all border border-stage-700/50"
            >
              <svg class="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5l7 7-7 7" /></svg>
            </button>
          </div>
        </div>

        <!-- Weekdays -->
        <div class="calendar-view__weekdays grid grid-cols-7 mb-4">
          <div 
            v-for="day in daysOfWeek" 
            :key="day"
            class="text-center text-[10px] uppercase tracking-widest font-black text-stage-400 py-2"
          >
            {{ day }}
          </div>
        </div>

        <!-- Days -->
        <div class="calendar-view__days grid grid-cols-7 gap-1 lg:gap-2">
          <button
            v-for="day in calendarDays"
            :key="day.toString()"
            @click="selectedDate = day"
            class="calendar-view__day min-h-[80px] lg:min-h-[110px] rounded-xl flex flex-col items-start p-2 relative transition-all duration-200 group"
            :class="[
              !isSameMonth(day, monthStart) ? 'opacity-10 pointer-events-none' : 'hover:bg-stage-800',
              isSameDay(day, selectedDate) ? 'bg-brand-500/20 ring-2 ring-brand-500/80 text-white' : 'text-stage-100',
              isToday(day) && !isSameDay(day, selectedDate) ? 'text-brand-400 font-black ring-1 ring-brand-500/30' : ''
            ]"
          >
            <span class="text-xs z-10 relative font-bold mb-1.5 opacity-60 group-hover:opacity-100">{{ format(day, 'd') }}</span>
            
            <!-- Event Info -->
            <div v-if="getEventsForDay(day).length > 0" class="w-full flex flex-col gap-1 overflow-hidden pointer-events-none">
              <div 
                v-for="ev in getEventsForDay(day).slice(0, 2)" 
                :key="ev.id"
                class="text-[9px] lg:text-[10px] leading-tight px-1 py-0.5 rounded bg-brand-500/10 text-brand-400 border-l-2 border-brand-500 truncate w-full text-left"
              >
                {{ ev.title }}
              </div>
              <div v-if="getEventsForDay(day).length > 2" class="text-[8px] lg:text-[9px] text-stage-500 font-bold px-1 mt-0.5">
                +{{ getEventsForDay(day).length - 2 }} more
              </div>
            </div>
          </button>
        </div>
      </div>

      <!-- Detail Side -->
      <div class="calendar-view__detail-side lg:w-96 bg-stage-950 p-6 lg:p-8 flex flex-col">
        <div class="calendar-view__detail-header mb-6">
          <p class="text-brand-400 font-black text-xs uppercase tracking-widest mb-1">{{ format(selectedDate, 'EEEE') }}</p>
          <h3 class="text-xl font-serif font-bold text-white">{{ format(selectedDate, 'MMMM do') }}</h3>
        </div>

        <div class="calendar-view__events-list flex-grow space-y-4 overflow-y-auto pr-2 custom-scrollbar">
          <div v-if="selectedDayEvents.length === 0" class="flex flex-col items-center justify-center h-40 text-stage-600 text-center opacity-60">
            <svg class="w-12 h-12 mb-4 opacity-20" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="1" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" /></svg>
            <p class="text-sm italic">No events scheduled for this day.</p>
          </div>

          <NuxtLink 
            v-for="event in selectedDayEvents" 
            :key="event.id"
            :to="`/events/${event.slug}`"
            class="calendar-view__event-card block p-4 rounded-2xl bg-stage-800/40 border border-stage-700/30 hover:border-brand-500/50 hover:bg-stage-800/60 transition-all group"
          >
            <div class="flex items-start gap-4">
              <!-- Event Image -->
              <div v-if="event.cover_image" class="w-16 h-16 rounded-xl overflow-hidden flex-shrink-0 bg-stage-800 border border-stage-700/50 shadow-lg">
                <img 
                  :src="getAssetUrl(event.cover_image, { width: 100, height: 100, fit: 'cover' })!" 
                  :alt="event.title"
                  class="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                />
              </div>

              <div class="flex-1 min-w-0">
                <div class="flex items-start justify-between gap-3">
                  <div>
                    <span class="inline-block px-2 py-0.5 rounded text-[10px] font-bold uppercase tracking-wider bg-brand-500/10 text-brand-400 mb-2">
                      {{ event.category }}
                    </span>
                    <h4 class="text-sm font-bold text-stage-100 group-hover:text-brand-400 transition-colors leading-snug">
                      {{ event.title }}
                    </h4>
                    <div class="flex items-start gap-2 mt-2 text-[10px] text-stage-500">
                      <svg class="w-3 h-3 mt-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
                      <div class="flex flex-col">
                        <span class="font-bold">{{ getEventTimes(event.start_datetime).nyTime }}</span>
                        <span v-if="getEventTimes(event.start_datetime).showLocal" class="opacity-60 italic text-[9px] mt-0.5">{{ getEventTimes(event.start_datetime).localTime }}</span>
                      </div>
                    </div>
                  </div>
                  <div class="flex-shrink-0 w-8 h-8 rounded-full bg-stage-700/30 flex items-center justify-center text-stage-500 group-hover:text-brand-400 transition-colors">
                    <svg class="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5l7 7-7 7" /></svg>
                  </div>
                </div>
              </div>
            </div>
          </NuxtLink>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
.custom-scrollbar::-webkit-scrollbar {
  width: 4px;
}
.custom-scrollbar::-webkit-scrollbar-track {
  background: transparent;
}
.custom-scrollbar::-webkit-scrollbar-thumb {
  background: rgba(255, 255, 255, 0.1);
  border-radius: 10px;
}
.custom-scrollbar::-webkit-scrollbar-thumb:hover {
  background: rgba(255, 255, 255, 0.2);
}
</style>
