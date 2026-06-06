<script setup lang="ts">
import { BaseButton } from '@/shared/ui/BaseButton';

const props = defineProps<{
  withNavigation: boolean;
  showMenuButton: boolean;
  day: number;
  gold: number;
  logoText?: string;
}>();

const emit = defineEmits<(e: 'click:menu') => void>();
</script>

<template>
  <header class="app-header">
    <h1 class="app-header__logo">
      {{ props.logoText ?? 'GuildMaster' }}
    </h1>
    <div class="app-header__stats">
      <p>Золото: {{ props.gold }}</p>
      <p>День: {{ props.day }}</p>
    </div>
    <base-button
      v-if="props.showMenuButton"
      class="app-header__menu-button"
      @click="emit('click:menu')"
    >
      Меню
    </base-button>
  </header>
</template>

<style scoped lang="scss">
.app-header {
  width: 100%;
  margin-bottom: 2rem;
  padding: 2rem 2rem 0 2rem;
  position: relative;
  display: grid;
  grid-template-columns: 18rem 1fr 8rem;
  gap: 2rem;

  &__logo {
    font-size: 3rem;
    font-family: math;
    line-height: 3.25rem;
    text-align: center;
  }

  &__stats {
    display: flex;
    align-items: center;
    gap: 2rem;
    font-size: 2rem;
  }
}
</style>
