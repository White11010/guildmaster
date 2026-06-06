<script setup lang="ts">
import { BaseButton } from '@/shared/ui/BaseButton';
import { BaseModal, type BaseModalEmits, type BaseModalProps } from '@/shared/ui/BaseModal';

const props = defineProps<BaseModalProps>();
const emit = defineEmits<BaseModalEmits>();

function onSkipOnboardingButtonClick() {
  emit('update:modelValue', false);
}
function onStartOnboardingButtonClick() {
  emit('update:modelValue', false);
}
</script>

<template>
  <base-modal
    :model-value="props.modelValue"
    width="500px"
    @update:model-value="emit('update:modelValue', $event)"
  >
    <div class="choose-onboarding">
      <p class="choose-onboarding__text">
        Вы — глава гильдии наёмников, и перед вами новое начало. У вас есть ресурсы, люди и
        возможности, но ни один путь не гарантирует успеха. Каждый выбор будет менять ситуацию —
        иногда незаметно, иногда необратимо. Посмотрим, как далеко вы сможете зайти.
      </p>
      <div class="choose-onboarding__footer">
        <base-button class="choose-onboarding__button" @click="onSkipOnboardingButtonClick">
          Пропустить обучение
        </base-button>
        <base-button
          class="choose-onboarding__button"
          variant="primary"
          @click="onStartOnboardingButtonClick"
        >
          Начать обучение
        </base-button>
      </div>
    </div>
  </base-modal>
</template>

<style scoped lang="scss">
.choose-onboarding {
  display: flex;
  flex-direction: column;
  gap: 1rem;

  &__footer {
    width: 100%;
    display: flex;
    justify-content: center;
    gap: 4rem;
  }

  &__text {
    font-size: 1.2rem;
  }
}
</style>
