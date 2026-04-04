<script setup lang="ts">
import { useRouter } from "vue-router";
import { useGameStore } from "@/entities/Game";
import { AppModals, useAppModalStore } from "@/shared/model/AppModal";

const router = useRouter();

const gameStore = useGameStore();
const appModalStore = useAppModalStore();

interface StartMenuItem {
  title: string;
  handler: () => void;
}
const menuItems: Array<StartMenuItem> = [
  {
    title: 'Продолжить',
    handler: () => {
      gameStore.startNewGame({ guildTitle: 'Мандалорцы' });
      router.push('/game');
    }
  },
  {
    title: 'Новая игра',
    handler: () => {
      appModalStore.setCurrentModal(AppModals.ENTER_NEW_GUILD_TITLE);
      // gameStore.startNewGame({ guildTitle: 'Мандалорцы' });
      // router.push('/game');
    }
  },
  {
    title: 'Загрузить игру',
    handler: () => {
      router.push('/game');
    }
  },
  {
    title: 'Настройки',
    handler: () => {
      appModalStore.setCurrentModal(AppModals.CHANGE_SETTINGS);
    }
  }
];
</script>

<template>
  <div class="start-menu">
    <button
      v-for="menuItem in menuItems"
      :key="menuItem.title"
      class="start-menu__button"
      @click="menuItem.handler"
    >
      {{ menuItem.title }}
    </button>
  </div>
</template>

<style lang="scss" scoped>
.start-menu {
  border: 1px solid black;
  padding: 2rem;
  display: flex;
  flex-direction: column;
  gap: 1rem;

  &__button {
    font-size: 1.5rem;
  }
}
</style>