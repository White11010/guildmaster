<script setup lang="ts">
import { BaseButton } from '@/shared/ui/BaseButton';
import { AppNavigation } from '../AppNavigation';
import { AppHeader } from '../AppHeader';

const props = defineProps<{
  withNavigation: boolean;
  withHeader: boolean;
  withFooter: boolean;
  showMenuButton: boolean;
  showEndDayButton: boolean;
  day: number;
  gold: number;
}>();
const emit = defineEmits<{
  (e: 'click:menu'): void;
  (e: 'click:end-day'): void;
}>();
</script>

<template>
  <app-header
    v-if="props.withHeader"
    :with-navigation="props.withNavigation"
    :show-menu-button="props.showMenuButton"
    :day="props.day"
    :gold="props.gold"
    @click:menu="emit('click:menu')"
  />
  <div
    class="app__main"
    :class="{
      'app__main--with-navigation': props.withNavigation,
      'app__main--with-header': props.withHeader,
      'app__main--with-footer': props.withFooter
    }"
  >
    <app-navigation v-if="props.withNavigation" class="app__navigation" />
    <div
      class="app__container"
      :class="{
        'app__container--with-navigation': props.withNavigation
      }"
    >
      <slot />
    </div>
  </div>
  <footer v-if="props.withFooter" class="app__footer">
    <div
      class="app__footer-content"
      :class="{
        'app__footer-content--with-navigation': props.withNavigation
      }"
    >
      <base-button
        v-if="props.showEndDayButton"
        class="app__end-day-button"
        size="lg"
        @click="emit('click:end-day')"
      >
        Завершить день
      </base-button>
    </div>
  </footer>
</template>

<style scoped lang="scss">
.app {
  &__main {
    width: min(100vw, 2560px);
    margin: 0 auto;
    height: 100vh;
    overflow: hidden;
    padding: 0 2rem;
    box-sizing: border-box;
    position: relative;
    display: flex;
    gap: 2rem;

    &--with-navigation {
      padding: 0 2rem 2rem 2rem;
    }

    &--with-header {
      height: calc(100vh - 8.5rem);
    }

    &--with-footer {
      height: calc(100vh - 13rem);
    }

    &--with-header {
      &--with-footer {
        height: calc(100vh - 18.5rem);
      }
    }
  }

  &__navigation {
    width: 18rem;
    min-width: 18rem;
  }

  &__container {
    height: 100%;
    width: 100vw;

    &--with-navigation {
      width: calc(100vw - 19rem);
    }
  }

  &__footer {
    width: min(100vw, 2560px);
    margin: 1rem auto 0 auto;
    padding: 0 2rem 1rem 2rem;
  }

  &__footer-content {
    display: flex;
    justify-content: flex-end;
    max-width: 100%;

    &--with-navigation {
      margin-left: 20rem;
    }
  }
}
</style>
