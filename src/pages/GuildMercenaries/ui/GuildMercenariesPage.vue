<script setup lang="ts">
import { GuildMercenariesBlock } from '@/widgets/GuildMercenariesBlock';
import { useTryLoadLastGame } from '@/features/LoadGame';

useTryLoadLastGame();
</script>

<template>
  <div class="guild-mercenaries-page">
    <guild-mercenaries-block />
  </div>
</template>

<style lang="scss" scoped>
.guild-mercenaries-page {
  height: 100%;
}
</style>
