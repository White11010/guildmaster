<script setup lang="ts">
const props = defineProps<{
  withNavigation: boolean;
  showMenuButton: boolean;
  day: number;
  gold: number;
  logoText?: string;
}>();

const emit = defineEmits<{
  (e: 'click:menu'): void;
}>();
</script>

<template>
  <header class="app-header">
    <div
      class="app-header__main-row"
      :class="{
        'app-header__main-row--with-navigation': props.withNavigation,
      }"
    >
      <h1 class="app-header__logo">
        {{ props.logoText ?? 'GuildMaster' }}
      </h1>
      <div class="app-header__stats">
        <p>День: {{ props.day }}</p>
        <p>Золото: {{ props.gold }}</p>
      </div>
    </div>
    <button
      v-if="props.showMenuButton"
      class="app-header__menu-button"
      @click="emit('click:menu')"
    >
      Меню
    </button>
  </header>
</template>

<style scoped lang="scss">
.app-header {
  width: 100%;
  margin-bottom: 1rem;
  padding: 2rem 2rem 0 2rem;
  position: relative;

  &__menu-button {
    position: absolute;
    top: 2rem;
    right: 0;
    font-size: 1.5rem;
  }

  &__main-row {
    max-width: 2560px;
    margin: 0 auto;
    display: flex;
    align-items: center;
    gap: 2rem;
    font-size: 1.5rem;

    &--with-navigation {
      margin-left: 20rem;
    }
  }

  &__logo {
    font-size: 3rem;
    font-family: math;
    line-height: 3.25rem;
  }

  &__stats {
    display: flex;
    align-items: center;
    gap: 2rem;
  }
}
</style>
