<script setup lang="ts">
import type { Mercenary } from "@/entities/Mercenary";

const props = defineProps<{
  mercenary: Mercenary;
}>();
</script>

<template>
  <div class="mercenary-guild-card">
    <p>{{ props.mercenary.name }}</p>
  </div>
</template>

<style scoped lang="scss">
.mercenary-guild-card {
  border: 1px solid black;
  padding: .5rem;
}
</style>