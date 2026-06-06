<script setup lang="ts">
import { type LogEvent, LogEventCard, useLogStore } from '@/entities/Log';
import { BaseContentBlock } from '@/shared/ui/BaseContentBlock';
import { computed } from 'vue';

const logStore = useLogStore();

const MAX_VISIBLE_EVENTS = 200;

type LogRow =
  | { kind: 'sep'; day: number; key: string }
  | { kind: 'ev'; event: LogEvent; key: string };

const visibleEvents = computed((): LogEvent[] => logStore.log.slice(0, MAX_VISIBLE_EVENTS));

const hiddenEventsCount = computed(() => Math.max(0, logStore.log.length - MAX_VISIBLE_EVENTS));

const displayedRows = computed((): LogRow[] => {
  const rows: LogRow[] = [];
  let prevDay: number | undefined;
  const events = visibleEvents.value;
  for (let i = 0; i < events.length; i++) {
    const event = events[i];
    const d = event.day;
    if (d !== undefined && d !== prevDay) {
      rows.push({ kind: 'sep', day: d, key: `sep-${d.toString()}-${i.toString()}` });
      prevDay = d;
    }
    rows.push({ kind: 'ev', event, key: event.id });
  }
  return rows;
});
</script>

<template>
  <base-content-block
    title="События"
    empty-text="Пока нет событий"
    :empty="logStore.log.length === 0"
  >
    <div class="log-block">
      <template v-for="row in displayedRows" :key="row.key">
        <div v-if="row.kind === 'sep'" class="log-block__day-separator">День {{ row.day }}</div>
        <log-event-card v-else :event="row.event" />
      </template>
      <div v-if="hiddenEventsCount > 0" class="log-block__truncated">
        …и ещё {{ hiddenEventsCount }} событий
      </div>
    </div>
  </base-content-block>
</template>

<style scoped lang="scss">
.log-block {
  height: 100%;
  overflow: auto;
  display: flex;
  flex-direction: column;
  gap: 0.5rem;

  &__truncated {
    padding: 0.5rem 0;
    text-align: center;
    font-size: 0.875rem;
    color: color-mix(in srgb, var(--color-black) 55%, transparent);
  }

  &__day-separator {
    margin-top: 0.25rem;
    padding: 0.35rem 0 0.15rem;
    border-top: 2px solid color-mix(in srgb, var(--color-black) 20%, transparent);
    font-size: 0.875rem;
    font-weight: 700;
    letter-spacing: 0.04em;
    text-transform: uppercase;
    color: color-mix(in srgb, var(--color-black) 55%, transparent);
  }
}
</style>
