<script setup lang="ts">
import { BaseButton } from '@/shared/ui/BaseButton';
import { appNavigationItems } from '@/shared/model/AppNavigation/AppNavigation.constants';
import { type AppNavigationItem } from '@/shared/model/AppNavigation';
import { useRoute, useRouter } from 'vue-router';

const router = useRouter();
const route = useRoute();

function onTabItemClick(tab: AppNavigationItem) {
  router.push(tab.path);
}
</script>

<template>
  <nav class="app-navigation">
    <ul class="app-navigation__nav-list">
      <li v-for="tab in appNavigationItems" :key="tab.path" class="app-navigation__nav-item">
        <base-button
          class="app-navigation__nav-item-button"
          size="lg"
          :variant="tab.path === route.path ? 'primary' : 'default'"
          @click="onTabItemClick(tab)"
        >
          {{ tab.title }}
        </base-button>
      </li>
    </ul>
  </nav>
</template>

<style scoped lang="scss">
.app-navigation {
  height: fit-content;

  &__nav-list {
    display: flex;
    flex-direction: column;
    justify-content: flex-start;
    list-style: none;
    gap: 1rem;
    margin: 0;
    padding: 0;
  }

  &__nav-item-button {
    width: 100%;
    height: 5rem;
  }
}
</style>
