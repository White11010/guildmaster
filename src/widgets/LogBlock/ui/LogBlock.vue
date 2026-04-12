<script setup lang="ts">
import { LogEventCard, useLogStore, type LogEvent } from "@/entities/Log";
import { BaseContentBlock } from "@/shared/ui/BaseContentBlock";
import { computed } from "vue";

const logStore = useLogStore();

type LogRow =
    | { kind: "sep"; day: number; key: string }
    | { kind: "ev"; event: LogEvent; key: string };

const displayedRows = computed((): Array<LogRow> => {
    const rows: Array<LogRow> = [];
    let prevDay: number | undefined;
    for (let i = 0; i < logStore.log.length; i++) {
        const event = logStore.log[i];
        const d = event.day;
        if (d !== undefined && d !== prevDay) {
            rows.push({ kind: "sep", day: d, key: `sep-${d}-${i}` });
            prevDay = d;
        }
        rows.push({ kind: "ev", event, key: event.id });
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
      <template
        v-for="row in displayedRows"
        :key="row.key"
      >
        <div
          v-if="row.kind === 'sep'"
          class="log-block__day-separator"
        >
          День {{ row.day }}
        </div>
        <log-event-card
          v-else
          :event="row.event"
        />
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
  gap: .5rem;

  &__day-separator {
    margin-top: .25rem;
    padding: .35rem 0 .15rem;
    border-top: 2px solid rgba(0, 0, 0, 0.2);
    font-size: 0.8rem;
    font-weight: 700;
    letter-spacing: 0.04em;
    text-transform: uppercase;
    color: rgba(0, 0, 0, 0.55);
  }
}
</style>