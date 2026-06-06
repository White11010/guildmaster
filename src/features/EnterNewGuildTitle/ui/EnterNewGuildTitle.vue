<script setup lang="ts">
import { BaseButton } from '@/shared/ui/BaseButton';
import { BaseInput } from '@/shared/ui/BaseInput';
import { BaseModal, type BaseModalEmits, type BaseModalProps } from '@/shared/ui/BaseModal';
import { onMounted, ref, useTemplateRef } from 'vue';
import { useGameStore } from '@/entities/Game';
import { useRouter } from 'vue-router';
import { AppModals, useAppModalStore } from '@/shared/model/AppModal';
import { ROUTE_PATH } from '@/shared/config';

const props = defineProps<BaseModalProps>();
const emit = defineEmits<BaseModalEmits>();

const router = useRouter();
const gameStore = useGameStore();
const appModalStore = useAppModalStore();

const newGuildTitle = ref('');

async function onStartButtonClick() {
  if (newGuildTitle.value) {
    gameStore.startNewGame({ guildTitle: newGuildTitle.value });
    await router.push(ROUTE_PATH.GUILD);
    appModalStore.setCurrentModal(AppModals.ONBOARDING);
  }
}

const titleInput = useTemplateRef<{ focus: () => void }>('titleInput');
onMounted(() => {
  titleInput.value?.focus();
});
</script>

<template>
  <base-modal
    title="Новая игра"
    :model-value="props.modelValue"
    with-close-button
    @update:model-value="emit('update:modelValue', $event)"
  >
    <div class="enter-new-guild-title">
      <p class="enter-new-guild-title__label">Введите название гильдии</p>
      <base-input
        ref="titleInput"
        v-model="newGuildTitle"
        class="enter-new-guild-title__input"
        :maxlength="100"
      />
      <footer class="enter-new-guild-title__footer">
        <base-button
          class="enter-new-guild-title__start-button"
          variant="primary"
          size="lg"
          :disabled="!newGuildTitle"
          @click="onStartButtonClick"
        >
          Начать
        </base-button>
      </footer>
    </div>
  </base-modal>
</template>

<style scoped lang="scss">
.enter-new-guild-title {
  padding: 0 0 1rem 0;
  display: flex;
  flex-direction: column;
  gap: 0.5rem;

  &__label {
    font-size: 1.5rem;
  }

  &__input {
    width: 500px;
  }

  &__footer {
    margin-top: 1.5rem;
    width: 100%;
    display: flex;
    justify-content: center;
  }
}
</style>
