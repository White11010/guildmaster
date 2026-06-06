<script setup lang="ts">
import { useTemplateRef } from 'vue';

const props = withDefaults(
  defineProps<{
    modelValue: string;
    type?: string;
    placeholder?: string;
    maxlength?: number;
    disabled?: boolean;
  }>(),
  {
    type: 'text',
    placeholder: '',
    maxlength: undefined,
    disabled: false
  }
);

const emit = defineEmits<(e: 'update:modelValue', value: string) => void>();

const inputRef = useTemplateRef<HTMLInputElement>('inputRef');

function focus() {
  inputRef.value?.focus();
}

defineExpose({ focus });
</script>

<template>
  <input
    ref="inputRef"
    class="base-input"
    :type="props.type"
    :value="props.modelValue"
    :placeholder="props.placeholder"
    :maxlength="props.maxlength"
    :disabled="props.disabled"
    @input="emit('update:modelValue', ($event.target as HTMLInputElement).value)"
  />
</template>

<style scoped lang="scss">
.base-input {
  font: inherit;
  font-family: inherit;
  font-size: 1.5rem;
  border-radius: 0;
  border: 1px solid var(--color-black);
  background: var(--color-white);
  color: var(--color-black);
  padding: 0.5rem;

  &:disabled {
    cursor: not-allowed;
    opacity: 0.5;
  }

  &:focus {
    outline: 2px solid var(--color-black);
    outline-offset: 0;
  }
}
</style>
