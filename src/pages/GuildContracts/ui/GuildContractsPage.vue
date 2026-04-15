<script setup lang="ts">
import { GuildContractsBlock } from '@/widgets/GuildContractsBlock';
import { useTryLoadLastGame } from '@/features/LoadGame';

useTryLoadLastGame();
</script>

<template>
  <div class="guild-contracts-page">
    <guild-contracts-block />
  </div>
</template>

<style lang="scss" scoped>
.guild-contracts-page {
  height: 100%;
}
</style>
