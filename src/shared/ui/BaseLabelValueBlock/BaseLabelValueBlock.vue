<script setup lang="ts">
const props = defineProps<{
  value: string | number;
  label: string;
}>();
</script>

<template>
  <div class="base-label-value-block">
    <p class="base-label-value-block__label">
      {{ props.label }}:
    </p>
    <p class="base-label-value-block__value">
      {{ props.value }}
    </p>
  </div>
</template>

<style scoped lang="scss">
.base-label-value-block {
  display: flex;
  align-items: center;
  gap: .5rem;
  &__label {
    text-decoration: underline;
  }
}
</style>