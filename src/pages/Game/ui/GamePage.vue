<script setup lang="ts">
import { HiringMarketBlockBlock } from '@/entities/HiringMarket';
import { GuildBlock } from "@/entities/Guild";
import { GuildContractsBlock } from "@/features/GuildContractsBlock";
import { GuildMercenariesBlock } from "@/widgets/GuildMercenariesBlock";
import { ContractsBlock } from "@/features/ContractsBlock";
import { ItemsMarketBlock } from "@/features/ItemsMarketBlock";
import { useGameStore } from "@/entities/Game";
import { useRouter } from "vue-router";

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
        <hiring-market-block-block />
        <guild-contracts-block />
        <contracts-block />
        <guild-mercenaries-block />
        <items-market-block />
      </div>
      <footer class="game__footer">
        <div class="game__footer-days-block">
          <p>Дней прошло:</p>
          <p>1</p>
        </div>
        <button class="game__end-day-button">
          Завершить день
        </button>
      </footer>
    </template>
  </div>
</template>

<style lang="scss" scoped>
.game {
  width: 100%;
  height: 100%;

  &__content {
    max-width: 1920px;
    height: calc(100% - 4rem);
    display: grid;
    gap: 2rem;
    grid-template-columns: 1fr 1fr;
    grid-template-rows: 1fr 1fr 1fr;
    margin: 0 auto;
    padding: 2rem;
    border: 1px solid black;
  }
  &__footer {
    margin: 1rem auto 0 auto;
    max-width: 1920px;
    display: flex;
    justify-content: space-between;
    align-items: center;
  }
  &__footer-days-block {
    display: flex;
    align-items: center;
    gap: .5rem;
    height: 3rem;
    font-size: 2rem;
  }
  &__end-day-button {
    font-size: 2rem;
  }
}
</style>