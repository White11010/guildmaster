<script setup lang="ts">
const props = withDefaults(defineProps<{
  title: string,
  emptyText?: string
  empty?: boolean
}>(), {
  emptyText: '',
  empty: false
});
</script>

<template>
  <div class="base-content-block">
    <header class="base-content-block__header">
      <h1 class="base-content-block__title">
        {{ props.title }}
      </h1>
    </header>
    <div class="base-content-block__content">
      <div
        v-if="props.empty && props.emptyText"
        class="base-content-block__empty"
      >
        <p>{{ props.emptyText }}</p>
      </div>
      <slot v-else />
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

  &__empty {
    height: 100%;
    display: flex;
    justify-content: center;
    align-items: center;
    font-size: 2rem;
  }
}
</style>