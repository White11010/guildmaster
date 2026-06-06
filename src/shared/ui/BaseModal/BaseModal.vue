<script setup lang="ts">
import { BaseButton } from '@/shared/ui/BaseButton';
import type { BaseModalEmits, BaseModalProps } from './BaseModal.types.ts';
import { computed } from 'vue';

interface BaseModalPropsExtended extends BaseModalProps {
  title?: string;
  withCloseButton?: boolean;
}
const props = withDefaults(defineProps<BaseModalPropsExtended>(), {
  withCloseButton: false,
  width: 'auto',
  height: 'auto',
  maxHeight: 'auto',
  title: ''
});

const emit = defineEmits<BaseModalEmits>();

function close() {
  emit('update:modelValue', false);
}

const getModalBodyStyles = computed((): Record<string, string> => {
  const styles: Record<string, string> = {};
  if (props.title && props.height !== 'auto') {
    styles.height = `calc(${props.height} - 81px - 1rem)`;
  }
  if (props.title && props.maxHeight !== 'auto') {
    styles.maxHeight = `calc(${props.maxHeight} - 81px - 1rem)`;
  }
  if (!props.height && !props.maxHeight) {
    styles.flex = '1';
  }
  return styles;
});
</script>

<template>
  <div v-if="props.modelValue" class="base-modal">
    <div
      class="base-modal__window"
      :style="{
        width: props.width,
        height: props.height,
        maxHeight: props.maxHeight
      }"
    >
      <header v-if="props.title" class="base-modal__header">
        <h3 class="base-modal__heading">
          {{ props.title }}
        </h3>
        <base-button
          v-if="props.withCloseButton"
          class="base-modal__close-button"
          size="sm"
          @click="close"
        >
          Закрыть
        </base-button>
      </header>
      <div class="base-modal__body" :style="getModalBodyStyles">
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
  background-color: color-mix(in srgb, var(--color-black) 50%, transparent);
  z-index: 2;

  &__window {
    border: 2px solid var(--color-black);
    display: flex;
    flex-direction: column;
    gap: 1rem;
    background: var(--color-white);
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
    line-height: 2rem;
  }

  &__close-button {
    margin-left: auto;
  }

  &__body {
    padding: 1rem;
  }
}
</style>
