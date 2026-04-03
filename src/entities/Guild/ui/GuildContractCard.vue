<script setup lang="ts">
import type { GuildContract } from "@/entities/Guild";

const props = defineProps<{
  contract: GuildContract;
}>();
</script>

<template>
  <div class="contract-guild-card">
    <p>{{ props.contract.title }}</p>
  </div>
</template>

<style scoped lang="scss">
.contract-guild-card {
  border: 1px solid black;
  padding: .5rem;
}
</style>