<script setup lang="ts">
import { BaseModal, type BaseModalEmits, type BaseModalProps } from "@/shared/ui/BaseModal";
import { useGameStore } from "@/entities/Game";
import { AppModals, useAppModalStore } from "@/shared/model/AppModal";

const props = defineProps<BaseModalProps>();
const emit = defineEmits<BaseModalEmits>();

const gameStore = useGameStore();
const appModalStore = useAppModalStore();

interface GameMenuItem {
  title: string;
  handler: () => void;
}
const gameMenuItems: Array<GameMenuItem> = [
  {
    title: 'Продолжить',
    handler () {
      emit('update:modelValue', false);
    }
  },
  {
    title: 'Настройки',
    handler () {
      appModalStore.setCurrentModal(AppModals.CHANGE_SETTINGS);
    }
  },
  {
    title: 'Сохранить игру',
    handler () {
      gameStore.saveGame();
    }
  },
  {
    title: 'Загрузить игру',
    handler () {
      appModalStore.setCurrentModal(AppModals.LOAD_GAME);
    }
  }
];
</script>

<template>
  <base-modal
    title="Пауза"
    :model-value="props.modelValue"
    @update:model-value="emit('update:modelValue', $event)"
  >
    <div class="game-menu">
      <button
        v-for="item in gameMenuItems"
        :key="item.title"
        class="game-menu__item"
        @click="item.handler"
      >
        {{ item.title }}
      </button>
    </div>
  </base-modal>
</template>

<style scoped lang="scss">
.game-menu {
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  gap: 1rem;
  padding: 0 2rem 1rem 2rem;

  &__item {
    width: 100%;
    font-size: 2rem;
  }
}
</style>