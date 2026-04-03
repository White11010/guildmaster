<script setup lang="ts">
import type { GuildMercenary } from "@/entities/Guild";

const props = defineProps<{
  mercenary: GuildMercenary;
}>();
</script>

<template>
  <div class="mercenary-guild-card">
    <p>{{ props.mercenary.name }}</p>
    <p>Дней в гильдии: {{ props.mercenary.daysInGuild }}</p>
  </div>
</template>

<style scoped lang="scss">
.mercenary-guild-card {
  border: 1px solid black;
  padding: .5rem;
}
</style>