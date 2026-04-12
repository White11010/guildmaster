<script setup lang="ts">
import { BaseModal, type BaseModalEmits, type BaseModalProps } from "@/shared/ui/BaseModal";

const props = defineProps<BaseModalProps>();
const emit = defineEmits<BaseModalEmits>();
</script>

<template>
  <base-modal
    :model-value="props.modelValue"
    @update:model-value="emit('update:modelValue', $event)"
  >
    <div class="show-success-save-message">
      <p class="show-success-save-message__text">
        Игра сохранена
      </p>
      <button
        class="show-success-save-message__button"
        @click="emit('update:modelValue', false)"
      >
        Продолжить
      </button>
    </div>
  </base-modal>
</template>

<style scoped lang="scss">
.show-success-save-message {
  padding: 1rem;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 1rem;

  &__text {
    font-size: 2rem;
  }
  &__button {
    font-size: 1.2rem;
  }
}
</style>