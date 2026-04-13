<script setup lang="ts">
import { type LogEvent, LogEventCard, useLogStore } from '@/entities/Log';
import { BaseContentBlock } from '@/shared/ui/BaseContentBlock';
import { computed } from 'vue';

const logStore = useLogStore();

type LogRow =
  | { kind: 'sep'; day: number; key: string }
  | { kind: 'ev'; event: LogEvent; key: string };

const displayedRows = computed((): LogRow[] => {
  const rows: LogRow[] = [];
  let prevDay: number | undefined;
  for (let i = 0; i < logStore.log.length; i++) {
    const event = logStore.log[i];
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

  &__day-separator {
    margin-top: 0.25rem;
    padding: 0.35rem 0 0.15rem;
    border-top: 2px solid color-mix(in srgb, var(--color-black) 20%, transparent);
    font-size: 0.8rem;
    font-weight: 700;
    letter-spacing: 0.04em;
    text-transform: uppercase;
    color: color-mix(in srgb, var(--color-black) 55%, transparent);
  }
}
</style>
