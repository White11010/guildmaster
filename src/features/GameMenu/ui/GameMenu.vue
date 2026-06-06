<script setup lang="ts">
import { BaseButton } from '@/shared/ui/BaseButton';
import { BaseModal, type BaseModalEmits, type BaseModalProps } from '@/shared/ui/BaseModal';
import { useGameStore } from '@/entities/Game';
import { AppModals, useAppModalStore } from '@/shared/model/AppModal';
import { useRouter } from 'vue-router';

const props = defineProps<BaseModalProps>();
const emit = defineEmits<BaseModalEmits>();

const gameStore = useGameStore();
const appModalStore = useAppModalStore();
const router = useRouter();

interface GameMenuItem {
  title: string;
  handler: () => void | Promise<void>;
}
const gameMenuItems: GameMenuItem[] = [
  {
    title: 'Продолжить',
    handler() {
      emit('update:modelValue', false);
    }
  },
  {
    title: 'Настройки',
    handler() {
      appModalStore.setCurrentModal(AppModals.CHANGE_SETTINGS);
    }
  },
  {
    title: 'Сохранить игру',
    handler() {
      gameStore.saveGame();
      appModalStore.setCurrentModal(AppModals.SUCCESS_SAVE);
    }
  },
  {
    title: 'Загрузить игру',
    handler() {
      appModalStore.setCurrentModal(AppModals.LOAD_GAME);
    }
  },
  {
    title: 'Сохранить и выйти',
    async handler() {
      gameStore.saveGame();
      await router.push('/');
      emit('update:modelValue', false);
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
      <base-button
        v-for="item in gameMenuItems"
        :key="item.title"
        class="game-menu__item"
        size="lg"
        @click="item.handler"
      >
        {{ item.title }}
      </base-button>
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
  }
}
</style>
