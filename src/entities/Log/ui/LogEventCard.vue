<script setup lang="ts">
import type { LogEvent } from "@/entities/Log";

const props = defineProps<{
  event: LogEvent;
}>();
</script>

<template>
  <div class="log-event-card">
    <p class="log-event-card__text">
      {{ props.event.text }}
    </p>
  </div>
</template>

<style scoped lang="scss">
.log-event-card {
  &__text {

  }
}
</style>