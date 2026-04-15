<script setup lang="ts">
import { GuildInfoBlock } from '@/widgets/GuildInfoBlock';
import { useTryLoadLastGame } from '@/features/LoadGame';
import { ForecastBlock } from '@/widgets/ForecastBlock';

useTryLoadLastGame();
</script>

<template>
  <div class="guild-page">
    <guild-info-block />
    <forecast-block />
  </div>
</template>

<style lang="scss" scoped>
.guild-page {
  height: 100%;
  display: grid;
  grid-template-columns: 1fr 18rem;
  gap: 2rem;
}
</style>
