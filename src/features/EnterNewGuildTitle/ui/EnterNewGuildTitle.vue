<script setup lang="ts">
import { BaseModal, type BaseModalEmits, type BaseModalProps } from "@/shared/ui/BaseModal";
import { ref } from "vue";
import { useGameStore } from "@/entities/Game";
import { useRouter } from "vue-router";
import { useAppModalStore } from "@/shared/model/AppModal";

const props = defineProps<BaseModalProps>();
const emit = defineEmits<BaseModalEmits>();

const router = useRouter();
const gameStore = useGameStore();
const appModalStore = useAppModalStore();

const newGuildTitle = ref(null);

function onStartButtonClick () {
  gameStore.startNewGame({ guildTitle: newGuildTitle.value });
  router.push('/game');
  appModalStore.closeModal();
}
</script>

<template>
  <base-modal
    title="Новая игра"
    :model-value="props.modelValue"
    @update:model-value="emit('update:modelValue', $event)"
  >
    <div class="enter-new-guild-title">
      <p class="enter-new-guild-title__label">
        Введите название гильдии
      </p>
      <input
        v-model="newGuildTitle"
        class="enter-new-guild-title__input"
        type="text"
        maxlength="100"
      >
      <footer class="enter-new-guild-title__footer">
        <button
          class="enter-new-guild-title__start-button"
          :disabled="!newGuildTitle"
          @click="onStartButtonClick"
        >
          Начать
        </button>
      </footer>
    </div>
  </base-modal>
</template>

<style scoped lang="scss">
.enter-new-guild-title {
  padding: 0 0 1rem 0;
  display: flex;
  flex-direction: column;
  gap: .5rem;

  &__label {
    font-size: 1.5rem;
  }
  &__input {
    width: 500px;
    font-size: 1.5rem;
  }

  &__footer {
    margin-top: 1.5rem;
    width: 100%;
    display: flex;
    justify-content: center;
  }

  &__start-button {
    font-size: 1.5rem;
  }
}
</style>