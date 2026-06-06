<script setup lang="ts">
withDefaults(
  defineProps<{
    variant?: 'default' | 'primary';
    size?: 'sm' | 'md' | 'lg';
  }>(),
  {
    variant: 'default',
    size: 'md'
  }
);
</script>

<template>
  <button
    class="base-button"
    :class="[`base-button--${variant}`, `base-button--${size}`]"
    v-bind="$attrs"
  >
    <slot />
  </button>
</template>

<style scoped lang="scss">
.base-button {
  font: inherit;
  font-family: inherit;
  border-radius: 0;
  cursor: pointer;
  border: 1px solid var(--color-black);
  background: var(--color-white);
  color: var(--color-black);

  &:hover:not(:disabled) {
    background: color-mix(in srgb, var(--color-black) 6%, var(--color-white));
  }

  &:disabled {
    cursor: not-allowed;
    opacity: 0.5;
  }

  &--primary {
    background: var(--color-black);
    color: var(--color-white);
    border-color: var(--color-black);

    &:hover:not(:disabled) {
      background: color-mix(in srgb, var(--color-black) 85%, var(--color-white));
    }
  }

  &--sm {
    min-height: 32px;
    padding: 0.35rem 0.75rem;
    font-size: 1rem;
  }

  &--md {
    padding: 0.5rem 1rem;
    font-size: 1.5rem;
  }

  &--lg {
    padding: 0.5rem 1.25rem;
    font-size: 2rem;
  }
}
</style>
