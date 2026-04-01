<script setup lang="ts">
const props = defineProps<{
  title: string
}>();
</script>

<template>
  <div class="base-content-block">
    <header class="base-content-block__header">
      <h1 class="base-content-block__title">
        {{ props.title }}
      </h1>
    </header>
    <div class="base-content-block__content">
      <slot />
    </div>
  </div>
</template>

<style scoped lang="scss">
.base-content-block {
  width: 100%;
  height: 100%;
  overflow: hidden;
  border: 4px solid black;
  padding: 1rem;

  &__header {

  }

  &__title {
    line-height: 2.5rem;
    text-decoration: underline;
  }
  &__content {
    margin-top: 1rem;
    height: calc(100% - 3.5rem);
  }
}
</style>