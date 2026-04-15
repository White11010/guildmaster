<script setup lang="ts">
import { LogBlock } from '@/widgets/LogBlock';
import { useTryLoadLastGame } from '@/features/LoadGame';

useTryLoadLastGame();
</script>

<template>
  <div class="log-page">
    <log-block />
  </div>
</template>

<style lang="scss" scoped>
.log-page {
  height: 100%;
}
</style>
