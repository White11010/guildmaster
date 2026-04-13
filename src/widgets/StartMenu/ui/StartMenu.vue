<script setup lang="ts">
import { useRouter } from 'vue-router';
import { useGameStore } from '@/entities/Game';
import { AppModals, useAppModalStore } from '@/shared/model/AppModal';
import { computed } from 'vue';

const router = useRouter();

const gameStore = useGameStore();
const appModalStore = useAppModalStore();

interface StartMenuItem {
  title: string;
  handler: () => void;
  disabled?: boolean;
}
const menuItems = computed<StartMenuItem[]>(() => {
  return [
    {
      title: 'Продолжить',
      handler: () => {
        if (gameStore.savedGamesIds.length) {
          gameStore.initLastSavedGame();
          router.push('/game');
        }
      },
      disabled: gameStore.savedGamesIds.length === 0
    },
    {
      title: 'Новая игра',
      handler: () => {
        appModalStore.setCurrentModal(AppModals.ENTER_NEW_GUILD_TITLE);
      }
    },
    {
      title: 'Загрузить игру',
      handler: () => {
        appModalStore.setCurrentModal(AppModals.LOAD_GAME);
      }
    },
    {
      title: 'Настройки',
      handler: () => {
        appModalStore.setCurrentModal(AppModals.CHANGE_SETTINGS);
      }
    }
  ];
});

gameStore.loadSavedGames();
</script>

<template>
  <div class="start-menu">
    <button
      v-for="menuItem in menuItems"
      :key="menuItem.title"
      :disabled="menuItem.disabled"
      class="start-menu__button"
      @click="menuItem.handler"
    >
      {{ menuItem.title }}
    </button>
  </div>
</template>

<style lang="scss" scoped>
.start-menu {
  border: 1px solid var(--color-black);
  padding: 2rem;
  display: flex;
  flex-direction: column;
  gap: 1rem;

  &__button {
    font-size: 1.5rem;
  }
}
</style>
