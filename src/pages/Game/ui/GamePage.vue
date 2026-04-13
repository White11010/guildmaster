<script setup lang="ts">
import { HiringMarketBlock } from '@/widgets/HiringMarketBlock';
import { GuildBlock } from "@/entities/Guild";
import { GuildContractsBlock } from "@/widgets/GuildContractsBlock";
import { GuildMercenariesBlock } from "@/widgets/GuildMercenariesBlock";
import { ContractsBlock } from "@/widgets/ContractsBlock";
import { useGameStore } from "@/entities/Game";
import { useRouter } from "vue-router";
import { LogBlock } from "@/widgets/LogBlock";

const gameStore = useGameStore();
const router = useRouter();

function loadLastSavedGame () {
  if (!gameStore.isGameLoaded) {
    gameStore.loadSavedGames();

    if (Object.keys(gameStore.savedGames).length) {
      gameStore.initLastSavedGame();
    } else {
      router.push('/');
    }
  }
}
loadLastSavedGame();
</script>

<template>
  <div class="game">
    <template v-if="gameStore.isGameLoaded">
      <div class="game__content">
        <guild-block />
        <hiring-market-block />
        <guild-contracts-block />
        <contracts-block />
        <guild-mercenaries-block />
        <log-block />
      </div>
    </template>
  </div>
</template>

<style lang="scss" scoped>
.game {
  width: 100%;
  height: 100%;

  &__content {
    max-width: 1920px;
    height: 100%;
    display: grid;
    gap: 2rem;
    grid-template-columns: 1fr 1fr;
    grid-template-rows: 1fr 1fr 1fr;
    margin: 0 auto;
    padding: 2rem;
    border: 4px solid black;
    background-color: rgb(black, .1);
  }
}
</style>