<script setup lang="ts">
import type { Mercenary } from '@/entities/Mercenary';

const props = defineProps<{
  mercenary: Mercenary;
}>();
</script>

<template>
  <div class="watch-market-mercenary-info">
    <h3>{{ props.mercenary.name }}</h3>
    <p>{{ props.mercenary.background }}</p>
  </div>
</template>

<style lang="scss" scoped>
.watch-market-mercenary-info {
}
</style>
