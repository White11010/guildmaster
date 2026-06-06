<script setup lang="ts">
const props = withDefaults(
  defineProps<{
    modelValue: boolean;
    disabled?: boolean;
  }>(),
  {
    disabled: false
  }
);

const emit = defineEmits<(e: 'update:modelValue', value: boolean) => void>();

function onChange(event: Event) {
  emit('update:modelValue', (event.target as HTMLInputElement).checked);
}
</script>

<template>
  <label class="base-checkbox">
    <input
      class="base-checkbox__input"
      type="checkbox"
      :checked="props.modelValue"
      :disabled="props.disabled"
      @change="onChange"
    />
    <span v-if="$slots.default" class="base-checkbox__label">
      <slot />
    </span>
  </label>
</template>

<style scoped lang="scss">
.base-checkbox {
  display: flex;
  align-items: center;
  gap: 0.75rem;
  cursor: pointer;
  padding: 0.35rem 0.25rem;
  border-radius: 0;

  &:hover:not(:has(input:disabled)) {
    background: color-mix(in srgb, var(--color-black) 4%, transparent);
  }

  &__input {
    flex-shrink: 0;
    width: 1.25rem;
    height: 1.25rem;
    cursor: pointer;
    accent-color: var(--color-black);

    &:disabled {
      cursor: not-allowed;
      opacity: 0.5;
    }
  }

  &__label {
    flex: 1;
  }

  &:has(input:disabled) {
    cursor: not-allowed;
    opacity: 0.7;
  }
}
</style>
