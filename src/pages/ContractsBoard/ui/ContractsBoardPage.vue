<script setup lang="ts">
import { ContractsBlock } from '@/widgets/ContractsBlock';
import { useTryLoadLastGame } from '@/features/LoadGame';

useTryLoadLastGame();
</script>

<template>
  <div class="contracts-board-page">
    <contracts-block />
  </div>
</template>

<style lang="scss" scoped>
.contracts-board-page {
  height: 100%;
}
</style>
