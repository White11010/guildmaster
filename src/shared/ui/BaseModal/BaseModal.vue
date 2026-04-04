<script setup lang="ts">
import type { BaseModalEmits, BaseModalProps } from "./BaseModal.types.ts";

interface BaseModalPropsExtended extends BaseModalProps {
  title: string;
  withCloseButton?: boolean;
}
const props = withDefaults(defineProps<BaseModalPropsExtended>(), {
  withCloseButton: false,
  width: 'auto',
  height: 'auto'
});

const emit = defineEmits<BaseModalEmits>();

function close () {
  emit('update:modelValue', false);
}
</script>

<template>
  <div
    v-if="props.modelValue"
    class="base-modal"
  >
    <div
      class="base-modal__window"
      :style="{
        width: props.width,
        height: props.height,
      }"
    >
      <header class="base-modal__header">
        <h3 class="base-modal__heading">
          {{ props.title }}
        </h3>
        <button
          v-if="props.withCloseButton"
          class="base-modal__close-button"
          @click="close"
        >
          Закрыть
        </button>
      </header>
      <div class="base-modal__body">
        <slot v-bind="{ close }" />
      </div>
    </div>
  </div>
</template>

<style lang="scss" scoped>
.base-modal {
  width: 100vw;
  height: 100vh;
  position: fixed;
  top: 0;
  left: 0;
  display: flex;
  justify-content: center;
  align-items: center;
  background-color: rgba(0, 0, 0, 0.5);

  &__window {
    border: 2px solid black;
    display: flex;
    flex-direction: column;
    gap: 1rem;
    background: white;
  }

  &__header {
    display: flex;
    gap: 2rem;
    padding: 1rem;
    align-items: center;
  }

  &__heading {
    margin: 0;
    font-size: 2rem;
  }

  &__close-button {
    margin-left: auto;
    font-size: 1.5rem;
  }

  &__body {
    flex: 1;
    padding: 1rem;
  }
}
</style>