<script setup lang="ts">
import { useRoute } from "vue-router";
import { AppNavigation } from "../AppNavigation";

const emit = defineEmits<{
  (e: 'click:menu'): void;
}>();

const route = useRoute();
</script>

<template>
  <header class="app__header">
    <div class="app__header-container">
      <h1 class="app__header-heading">
        GuildMaster
      </h1>
      <button
        v-if="route.path !== '/'"
        class="app__header-menu-button"
        @click="emit('click:menu')"
      >
        Меню
      </button>
    </div>
  </header>
  <div class="app__main">
    <app-navigation class="app__navigation"/>
    <div class="app__container">
      <slot />
    </div>
  </div>
</template>

<style scoped lang="scss">
.app {
  &__header {
    width: 100vw;
    margin-bottom: 1rem;
    padding: 2rem 4rem 0 4rem;
  }

  &__header-container {
    max-width: 1920px;
    margin: 0 auto;
    display: flex;
    justify-content: center;
    align-items: center;
    position: relative;
    box-sizing: border-box;
  }

  &__header-heading {
    font-size: 3rem;
    text-align: center;
    font-family: math;
    line-height: 3.25rem;
  }
  &__header-menu-button {
    //margin-left: auto;
    font-size: 1.5rem;
    position: absolute;
    top: 0;
    right: 0;
  }

  &__main {
    width: min(100vw, 2560px);
    margin: 0 auto;
    // width: 100vw;
    height: calc(100vh - 6.25rem);
    overflow: hidden;
    padding: 0 22rem 2rem 2rem;
    box-sizing: border-box;
    position: relative;
    display: flex;
    gap: 2rem;
  }

  &__navigation {
    width: 18rem;
    min-width: 18rem;
  }
  &__container {
    height: calc(100vh - 6.25rem);
    width: calc(100vw - 19rem);
  }
}
</style>