<script setup lang="ts">
import { LogEventCard, useLogStore } from "@/entities/Log";
import { BaseContentBlock } from "@/shared/ui/BaseContentBlock";

const logStore = useLogStore();
</script>

<template>
  <base-content-block
    title="События"
    empty-text="Пока нет событий"
    :empty="logStore.log.length === 0"
  >
    <div class="log-block">
      <log-event-card
        v-for="event in logStore.log"
        :key="event.id"
        :event="event"
      />
    </div>
  </base-content-block>
</template>

<style scoped lang="scss">
.log-block {
  display: flex;
  flex-direction: column-reverse;
  gap: .5rem;
}
</style>