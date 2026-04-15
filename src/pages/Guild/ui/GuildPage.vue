<script setup lang="ts">
import { GuildInfoBlock } from '@/widgets/GuildInfoBlock';
import { useTryLoadLastGame } from '@/features/LoadGame';

useTryLoadLastGame();
</script>

<template>
  <div class="guild-page">
    <guild-info-block />
  </div>
</template>

<style lang="scss" scoped>
.guild-page {
  height: 100%;
}
</style>
